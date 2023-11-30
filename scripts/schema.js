import { getMetadata } from './lib-franklin.js';
import { makePublicUrl, setJsonLd } from './scripts.js';

// eslint-disable-next-line import/prefer-default-export
export function buildArticleSchema() {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'Article',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    headline: getMetadata('og:title'),
    image: getMetadata('og:image'),
    datePublished: getMetadata('publishdate'),
    publisher: {
      '@type': 'Organization',
      name: 'Danaher Life Sciences',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lifesciences.danaher.com/content/dam/danaher/brand-logos/danaher/Logo.svg',
      },
    },
    description: getMetadata('description'),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    },
  };

  if (getMetadata('creationdate')) data.datePublished = getMetadata('creationdate');
  if (getMetadata('updatedate')) data.dateModified = getMetadata('updatedate');
  if (getMetadata('authorname')) {
    data.author = {
      '@type': 'Person',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(data, 'article');
}
