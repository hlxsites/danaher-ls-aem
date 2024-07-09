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

function generateItemListElement(type, position, url, name, image, description) {
  return {
    '@type': 'ListItem',
    position,
    item: {
      '@type': type,
      '@id': url,
      name,
      image,
      description,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// eslint-disable-next-line import/prefer-default-export
export function buildItemListSchema(srcObjs, type) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    '@id': `https://lifesciences.danaher.com${makePublicUrl(window.location.pathname)}`,
    name: `${document.querySelector('h1').textContent} - Types`,
    image: getMetadata('og:image'),
    description: getMetadata('description'),
    itemListElement: [],
  };

  let title;
  let position;
  let url;
  let image;
  let description;

  srcObjs.forEach((obj, index) => {
    switch (type) {
      case 'product-family':
        data.itemListElement.push(generateItemListElement(
          'Product',
          index + 1,
          obj.clickUri,
          obj.title,
          obj?.raw?.images?.at(0),
          obj.excerpt,
        ));
        break;
      case 'product-category':
        data.itemListElement.push(generateItemListElement(
          'Product',
          index + 1,
          `https://lifesciences.danaher.com${makePublicUrl(obj.path)}`,
          obj.title,
          `https://lifesciences.danaher.com${obj.image}`,
          obj.description,
        ));
        break;
      case 'workflow':
        title = obj.querySelector('p:nth-child(3)')?.textContent;
        position = obj.querySelector('p:nth-child(2) > strong')?.textContent;
        url = obj.querySelector('p:nth-child(4) > a')?.href;
        image = obj.querySelector('p > picture > img')?.src;
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          position,
          makePublicUrl(url),
          title,
          image,
          description,
        ));
        break;
      case 'process-steps':
        title = obj.querySelector('div:nth-child(2) > h2')?.textContent;
        position = obj.querySelector('div:first-child')?.textContent;
        url = obj.querySelector('div:nth-child(2) > p > a')?.href;
        image = obj.querySelector('div:last-child > p > picture > img')?.src;
        description = obj.querySelector('div:nth-child(2) > p:nth-child(3)')?.textContent;
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          position,
          makePublicUrl(url),
          title,
          image,
          description,
        ));
        break;
      case 'individual-steps':
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          index + 1,
          makePublicUrl(obj.path),
          obj.title,
          image,
          description,
        ));
        break;
      case 'resources':
        data.itemListElement.push(generateItemListElement(
          'ListItem',
          index + 1,
          makePublicUrl(obj.path),
          obj.title,
          obj.image,
          obj.description,
        ));
        break;
      default:
        break;
    }
  });

  setJsonLd(
    data,
    'productItemList',
  );
}
