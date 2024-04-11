import {
  img,
} from './dom-builder.js';
import { createOptimizedPicture } from './lib-franklin.js';

/**
 * Get the Image URL from Scene7 and Optimize the picture
 * @param {string} imageUrl
 * @param {string} imageAlt
 * @param {boolean} eager
 * @returns Optimized image
 */
export function imageHelper(imageUrl, imageAlt, eager = false) {
  if (imageUrl.indexOf('.scene7.com') > -1) {
    return img({
      src: `${imageUrl}`,
      alt: imageAlt,
      loading: eager ? 'eager' : 'lazy',
      class: 'mb-2 h-48 w-full object-cover',
    });
  }
  const cardImage = createOptimizedPicture(imageUrl, imageAlt, eager, [{ width: '500' }]);
  cardImage.querySelector('img').className = 'mb-2 h-48 w-full object-cover';
  return cardImage;
}

export function createOptimizedS7Picture(src, alt = '', eager = false) {
  if (src.startsWith('/is/image') || src.indexOf('.scene7.com') > -1) {
    const picture = document.createElement('picture');
    picture.appendChild(img({ src: `${src}?$danaher-mobile$`, alt, loading: eager ? 'eager' : 'lazy' }));
    return picture;
  }
  return img({
    src,
    alt,
    loading: eager ? 'eager' : 'lazy',
  });
}
