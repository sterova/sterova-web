import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

// Load environment variables for Supabase (fallback to process.env if available)
import { loadEnv } from 'vite';
const env = loadEnv('production', process.cwd(), '');

const SUPABASE_URL = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const template = fs.readFileSync(toAbsolute('dist/client/index.html'), 'utf-8');

// The SSR build output
const { render } = await import(toAbsolute('dist/server/entry-server.js'));

const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/process',
  '/blog',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/404'
];

async function fetchPosts() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase credentials missing. Blog posts will not be prerendered with real data.');
    return [];
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?status=eq.published&select=slug,updated_at`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) {
      console.warn(`⚠️ Supabase returned ${res.status} ${res.statusText}. Blog posts will not be prerendered with real data.`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.warn(`⚠️ Could not reach Supabase. Blog posts will not be prerendered with real data.`);
    return [];
  }
}

async function generateSitemap(routes, posts) {
  const baseUrl = 'https://sterova.tech';
  const urls = routes.filter(r => r !== '/404').map(route => {
    return `<url><loc>${baseUrl}${route === '/' ? '' : route}</loc></url>`;
  });
  
  posts.forEach(post => {
    urls.push(`<url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${post.updated_at}</lastmod></url>`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`;

  fs.writeFileSync(toAbsolute('dist/client/sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
}

async function build() {
  const posts = await fetchPosts();
  
  const allRoutes = [...staticRoutes];
  posts.forEach(post => {
    allRoutes.push(`/blog/${post.slug}`);
  });

  for (const url of allRoutes) {
    try {
      // For blog posts, we could seed the react-query cache, but to keep it simple,
      // rendering the component might trigger suspense or we can prefetch.
      // Since it's a simple setup, we render the HTML shell and metadata.
      const { html, head } = await render(url === '/404' ? '/this-page-does-not-exist' : url);

      let appHtml = template
        .replace(`<!--ssr-head-->`, head)
        .replace(`<!--ssr-body-->`, html);
      
      const is404 = url === '/404';
      const filePath = is404 ? 'dist/client/404.html' : `dist/client${url === '/' ? '/index.html' : `${url}/index.html`}`;
      
      const dir = path.dirname(toAbsolute(filePath));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(toAbsolute(filePath), appHtml);
      console.log(`✅ Prerendered ${url}`);
    } catch (e) {
      console.error(`❌ Failed to prerender ${url}:`, e);
      process.exit(1);
    }
  }
  
  await generateSitemap(staticRoutes, posts);
}

build();
