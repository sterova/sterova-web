import { Helmet } from 'react-helmet-async';
import { 
  getOrganizationSchema, 
  getProfessionalServiceSchema, 
  getSoftwareApplicationSchema,
  getWebSiteSchema,
  getArticleSchema,
  getBreadcrumbSchema,
  getServiceSchema,
  getCollectionPageSchema,
  getFAQPageSchema
} from '@/lib/schema';

export type SchemaType = 'organization' | 'service' | 'software' | 'website' | 'article' | 'breadcrumb' | 'specificService' | 'collection' | 'faqs';

interface JsonLdProps {
  type: SchemaType | SchemaType[];
  post?: any;
  url?: string;
  breadcrumbs?: { name: string, item: string }[];
  collectionName?: string;
  collectionDescription?: string;
  faqs?: { question: string, answer: string }[];
}

export default function JsonLd({ 
  type, 
  post, 
  url = '', 
  breadcrumbs, 
  collectionName, 
  collectionDescription, 
  faqs 
}: JsonLdProps) {
  const types = Array.isArray(type) ? type : [type];
  
  const schemas = types.map(t => {
    switch (t) {
      case 'organization': return getOrganizationSchema();
      case 'service': return getProfessionalServiceSchema();
      case 'software': return getSoftwareApplicationSchema();
      case 'website': return getWebSiteSchema();
      case 'article': return post ? getArticleSchema(post, url) : null;
      case 'breadcrumb': return breadcrumbs ? getBreadcrumbSchema(breadcrumbs) : null;
      case 'specificService': return getServiceSchema();
      case 'collection': return collectionName && collectionDescription ? getCollectionPageSchema(collectionName, collectionDescription, url) : null;
      case 'faqs': return faqs ? getFAQPageSchema(faqs) : null;
      default: return null;
    }
  }).filter(Boolean);

  if (schemas.length === 0) return null;

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script type="application/ld+json" key={`${types[index]}-${index}`}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
