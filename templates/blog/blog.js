import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';
import {
  div,
} from '../../scripts/dom-builder.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const section = main.querySelector(':scope > div:nth-child(2)');
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';
  const firstThreeChildren = Array.from(section.children).slice(0, 3);
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
  section.removeChild(blogH1);
  let columnElements = '';
  let blogHeroImage;
  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    section.removeChild(blogHeroP1);
    section.removeChild(blogHeroP2);
    const divEl = div();
    divEl.append(blogH1, blogHeroP1);
    columnElements = [[divEl, blogHeroImage.parentElement]];
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    section.removeChild(blogHeroP1);
    columnElements = [[blogHeroImage.parentElement, blogH1]];
  } else {
    columnElements = [blogH1];
  }

  section.prepend(
    buildBlock('social-media', { elems: [] }),
    buildBlock('columns', columnElements),
    buildBlock('article-info', { elems: [] }),
  );

  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
  section.after(additionalContentSection);

  buildArticleSchema();

  // make the content section the first element in main, first before the breadcrumb section.
  // do that hear to avoid the tag-list and related-articles to be moved as well.
  // loading order should be social-media, columns, article-info, breadcrumb, tags-list
  // related-articles
  section.parentElement.prepend(section);
}
