import { Helmet } from 'react-helmet-async';
import { SITE } from '@/data/constants';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
}

export default function SEO({ title, description, canonical, type = 'website' }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const fullDescription = description || SITE.description;
  const url = canonical ? `${SITE.url}${canonical}` : SITE.url;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      
      <link rel="canonical" href={url} />
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
    </Helmet>
  );
}
