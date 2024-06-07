import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';
import {
  div
} from '../../scripts/dom-builder.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const defaultContentWrapper = main.querySelector(':scope > div:nth-child(2)');
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';
  const firstThreeChildren = Array.from(defaultContentWrapper.children).slice(0, 3);
  firstThreeChildren.every((child) => {
    if (child.tagName === 'H1' && !blogH1) {
      blogH1 = child;
    } else if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }
    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) return false;
    return true;
  });
  defaultContentWrapper.removeChild(blogH1);
  let columnBlock = '';
  let columnElements = '';
  let blogHeroImage;
  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    defaultContentWrapper.removeChild(blogHeroP1);
    defaultContentWrapper.removeChild(blogHeroP2);
    const divEl = div();
    divEl.append(blogH1, blogHeroP1);
    columnElements = [[divEl, blogHeroImage]];
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    defaultContentWrapper.removeChild(blogHeroP1);
    columnElements = [[blogHeroImage, blogH1]];
  } else {
    columnElements = [blogH1];
  }

  columnBlock = buildBlock('columns', columnElements);
  defaultContentWrapper.prepend(
    buildBlock('social-media', { elems: [] }),
    columnBlock,
    buildBlock('article-info', { elems: [] })
  );
  
  defaultContentWrapper.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
  buildArticleSchema();
}
