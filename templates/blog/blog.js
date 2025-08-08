import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';
import {
  div,
} from '../../scripts/dom-builder.js';
// eslint-disable-next-line import/named
import { moveInstrumentation } from '../../scripts/scripts.js';

function moveImageInstrumentation(picture) {
  if (picture && picture.tagName === 'PICTURE') {
    moveInstrumentation(picture.parentElement, picture.querySelector('img'));
  }
}

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  if (!main) {
    console.warn('No <main> element found.');
    return;
  }

  const section = main.querySelector(':scope > div:nth-child(2)');
  if (!section) {
    console.warn('No second <div> child found in <main>.');
    return;
  }

  let blogH1 = null;
  let blogHeroP1 = null;
  let blogHeroP2 = null;

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

  if (blogH1) section.removeChild(blogH1);
  let columnElements = '';
  let blogHeroImage = null;

  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    if (blogHeroP1) section.removeChild(blogHeroP1);
    section.removeChild(blogHeroP2);

    const divEl = div();
    if (blogH1) divEl.append(blogH1);
    if (blogHeroP1) divEl.append(blogHeroP1);

    moveImageInstrumentation(blogHeroImage);

    columnElements = [[divEl, blogHeroImage]];
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    moveImageInstrumentation(blogHeroImage);

    section.removeChild(blogHeroP1);

    columnElements = [[blogHeroImage, blogH1]];
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

  // Make the content section the first element in main, before breadcrumb section.
  section.parentElement.prepend(section);
}
