import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';
import { div } from '../../scripts/dom-builder.js';
// eslint-disable-next-line import/named
import { moveInstrumentation } from '../../scripts/scripts.js';

function moveImageInstrumentation(picture) {
  if (picture?.tagName === 'PICTURE') {
    moveInstrumentation(picture.parentElement, picture.querySelector('img'));
  }
}

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  if (!main) {
    console.warn('No <main> element found.');
    return;
  }

  // Look for the first <h1> in the document to identify the section
  const blogH1 = main.querySelector('h1');
  if (!blogH1) {
    console.warn('No <h1> found in main content.');
    return;
  }

  // Use the section that contains the H1
  const section = blogH1.closest('.section');
  if (!section) {
    console.warn('Could not find section containing the <h1>.');
    return;
  }

  let blogHeroP1 = '';
  let blogHeroP2 = '';
  const children = Array.from(section.children);
  const maxChildrenToCheck = 4;

  // Identify paragraphs and check for image
  children.slice(0, maxChildrenToCheck).every((child) => {
    if (child === blogH1) return true;

    if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }

    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) return false; // Stop searching if image found
    return true;
  });

  // Build hero block elements
  let columnElements = '';
  let blogHeroImage;

  // Remove H1 from original location
  section.removeChild(blogH1);

  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    section.removeChild(blogHeroP1);
    section.removeChild(blogHeroP2);
    const divEl = div();
    divEl.append(blogH1, blogHeroP1);
    if (blogHeroImage) moveImageInstrumentation(blogHeroImage);
    columnElements = [[divEl, blogHeroImage]];
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    if (blogHeroImage) moveImageInstrumentation(blogHeroImage);
    section.removeChild(blogHeroP1);
    columnElements = [[blogHeroImage, blogH1]];
  } else {
    columnElements = [blogH1];
  }

  // Prepend main content blocks
  section.prepend(
    buildBlock('social-media', { elems: [] }),
    buildBlock('columns', columnElements),
    buildBlock('article-info', { elems: [] })
  );

  // Add additional content section
  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] })
  );
  section.after(additionalContentSection);

  // Build structured data
  buildArticleSchema();

  // Ensure correct order in main
  section.parentElement.prepend(section);
}
