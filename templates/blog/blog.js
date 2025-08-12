import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';
import { div } from '../../scripts/dom-builder.js';
// eslint-disable-next-line import/named
import { moveInstrumentation } from '../../scripts/scripts.js';

function moveImageInstrumentation(picture) {
  if (picture && picture.tagName === 'PICTURE') {
    moveInstrumentation(picture.parentElement, picture.querySelector('img'));
  }
}

/**
 * Extracts image, title, and text for a column
 * @param {Element} node
 * @returns {[Element|null, Element|null, Element|null]} Array for columns block
 */
function extractColumnContent(node) {
  if (!node) return [null, null, null];

  const image = node.querySelector('picture, img');
  const title = node.querySelector('h1, h2, h3, h4, h5, h6');
  // Get all <p> that are not inside title or image
  const paragraphs = Array.from(node.querySelectorAll('p')).filter(
    (p) => (!title || !title.contains(p)) && (!image || !image.contains(p))
  );
  let text = null;
  if (paragraphs.length) {
    text = document.createElement('div');
    paragraphs.forEach(p => text.appendChild(p.cloneNode(true)));
  }
  return [image, title, text];
}

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  if (!main) {
    console.error('Auto Blocking failed: <main> not found.');
    return;
  }
  // Try section, then fallback to div
  let section = main.querySelector(':scope > section, :scope > div');
  if (!section) {
    console.error('Auto Blocking failed: No <section> or <div> found as a direct child of <main>.');
    return;
  }

  // Defensive: get first three children, check existence
  const children = Array.from(section.children).slice(0, 3);
  if (!children.length) {
    console.warn('Auto Blocking: No children found in section/div.');
    return;
  }

  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';

  children.every((child) => {
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

  if (blogH1 && blogH1.parentElement === section) section.removeChild(blogH1);

  let columnElements = [];
  let blogHeroImage;

  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    if (blogHeroP1 && blogHeroP1.parentElement === section) section.removeChild(blogHeroP1);
    if (blogHeroP2.parentElement === section) section.removeChild(blogHeroP2);

    moveImageInstrumentation(blogHeroImage);

    columnElements.push([blogHeroImage, blogH1, blogHeroP1]);
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    moveImageInstrumentation(blogHeroImage);
    if (blogHeroP1.parentElement === section) section.removeChild(blogHeroP1);

    columnElements.push([blogHeroImage, blogH1, null]);
  } else if (blogH1) {
    columnElements.push([null, blogH1, null]);
  }

  // Defensive: If no columns found, log and skip
  if (!columnElements.length) {
    console.warn('Auto Blocking: No columns content extracted.');
    return;
  }

  // Prepend blocks in reverse order so they appear in the intended order
  section.prepend(
    buildBlock('social-media', { elems: [] }),
  );

  section.prepend(
    buildBlock('columns', columnElements),
    buildBlock('article-info', { elems: [] }),
  );

  // Add tags and related articles after the section
  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
  section.after(additionalContentSection);

  buildArticleSchema();

  // Ensure the content section is the first element in main
  if (section.parentElement.firstChild !== section) {
    section.parentElement.prepend(section);
  }
}
