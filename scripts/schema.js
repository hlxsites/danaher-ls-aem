import { getMetadata } from './lib-franklin.js';
import { makePublicUrl } from './url-helper.js';

/**
 * Set the JSON-LD script in the head
 * @param {*} data
 * @param {string} name
 */
export function setJsonLd(data, name) {
  const existingScript = document.head.querySelector(`script[data-name="${name}"]`);
  if (existingScript) {
    existingScript.innerHTML = JSON.stringify(data);
    return;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';

  script.innerHTML = JSON.stringify(data);
  script.dataset.name = name;
  document.head.appendChild(script);
}


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

// eslint-disable-next-line import/prefer-default-export
export function buildProductSchema() {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    name: getMetadata('og:title').replace(' | Danaher Life Sciences', ''),
    image: getMetadata('og:image'),
    description: getMetadata('description'),
    brand: {
      '@type': 'Brand',
      name: getMetadata('brand'),
    },
    sku: getMetadata('sku'),
    offers: {
      '@type': 'Offer',
      priceCurrency: getMetadata('priceCurrency'),
      price: getMetadata('price'),
      availability: getMetadata('availability'),
      url: `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
      seller: {
        '@type': 'Organization',
        name: getMetadata('brand'),
      },
    },
    manufacturer: {
      '@type': 'Organization',
      name: getMetadata('brand'),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    },
  };

  if (getMetadata('creationdate')) data.datePublished = getMetadata('creationdate');
  if (getMetadata('updatedate')) data.dateModified = getMetadata('updatedate');
  if (getMetadata('authorname')) {
    data.manufacturer = {
      '@type': 'Organization',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(
    data,
    'product',
  );
}

// eslint-disable-next-line import/prefer-default-export
export function buildProductCategorySchema(products) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    name: `${document.querySelector('h1').textContent} - Types`,
    image: getMetadata('og:image'),
    description: getMetadata('description'),
    itemListElement: [],
  };

  products.forEach((product, index) => {
    data.itemListElement.push({
      '@type': 'ListItem',
      position: index + 1,
      '@id': `https://lifesciences.danaher.com${makePublicUrl(product.path)}`,
      name: product.title,
      image: `https://lifesciences.danaher.com${product.image}`,
      description: product.description,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://lifesciences.danaher.com${makePublicUrl(product.path)}`,
      },
    });
  });

  setJsonLd(
    data,
    'productItemList',
  );
}
