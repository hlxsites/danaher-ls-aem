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

/**
 * Extracts image, title, and text for a column
 * @param {Element} node
 * @returns {{image: Element|null, title: Element|null, text: Element|null}}
 */
function extractColumnContent(node) {
  if (!node) return { image: null, title: null, text: null };

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
  return { image, title, text };
}

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
  if (blogH1) section.removeChild(blogH1);

  let columnElements = [];
  let blogHeroImage;

  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    if (blogHeroP1) section.removeChild(blogHeroP1);
    section.removeChild(blogHeroP2);

    // Move image instrumentation for analytics
    moveImageInstrumentation(blogHeroImage);

    // Build column object {image, title, text}
    columnElements.push({
      image: blogHeroImage,
      title: blogH1,
      text: blogHeroP1
    });
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    moveImageInstrumentation(blogHeroImage);
    section.removeChild(blogHeroP1);

    columnElements.push({
      image: blogHeroImage,
      title: blogH1,
      text: null
    });
  } else if (blogH1) {
    columnElements.push({
      image: null,
      title: blogH1,
      text: null
    });
  }

  // Optionally, handle more columns if your section contains more column divs
  const moreColumns = Array.from(section.querySelectorAll('.column'));
  moreColumns.forEach(colNode => {
    columnElements.push(extractColumnContent(colNode));
  });

  // Prepend social-media, columns, article-info blocks
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
  section.parentElement.prepend(section);
}
