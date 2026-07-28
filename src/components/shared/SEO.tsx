import { Helmet } from 'react-helmet-async';
import { SITE } from '@/data/constants';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonical, 
  type = 'website', 
  image, 
  noindex = false,
  publishedTime,
  modifiedTime,
  authorName
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const fullDescription = description || SITE.description;
  const url = canonical ? `${SITE.url}${canonical.startsWith('/') ? canonical : `/${canonical}`}` : SITE.url;
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE.url}${image}`) : `${SITE.url}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      <link rel="canonical" href={url} />
      
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && authorName && <meta property="article:author" content={authorName} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
