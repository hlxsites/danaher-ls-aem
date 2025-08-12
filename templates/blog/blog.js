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
 * Extracts and clones image, title, and text for a column.
 * Always clones nodes to preserve originals and avoid "detached" images.
 * @param {Element} node
 * @returns {[Element|null, Element|null, Element|null]} Array for columns block
 */
function extractColumnContent(node) {
  if (!node) return [null, null, null];

  // Clone image node (picture or img)
  let image = node.querySelector('picture, img');
  if (image) image = image.cloneNode(true);

  // Clone title node (first heading found)
  let title = node.querySelector('h1, h2, h3, h4, h5, h6');
  if (title) title = title.cloneNode(true);

  // Get all <p> that are not inside title or image, clone them into a wrapper div
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

/**
 * Dynamically extracts tags from a <meta name="tags"> or from a metadata table in the DOM.
 * No hardcoded tags.
 * @returns {Array<string>}
 */
function extractTagsFromMetadata() {
  // Try meta tag first (for future compatibility)
  const metaTags = document.querySelector('meta[name="tags"]');
  if (metaTags && metaTags.content.trim() !== '') {
    return metaTags.content.split(',').map(t => t.trim()).filter(Boolean);
  }

  // Try to extract from metadata table
  // Looks for a table cell with "tags" (case-insensitive), then grabs the next cell's text
  const tables = Array.from(document.querySelectorAll('table'));
  for (const table of tables) {
    const rows = Array.from(table.querySelectorAll('tr'));
    for (const row of rows) {
      const cells = row.querySelectorAll('td,th');
      if (cells.length >= 2 && cells[0].textContent.trim().toLowerCase() === 'tags') {
        return cells[1].textContent
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);
      }
    }
  }

  // Fallback: empty tags
  return [];
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

  // Clone nodes before removing from DOM!
  let clonedH1 = blogH1 ? blogH1.cloneNode(true) : null;
  let clonedP1 = blogHeroP1 ? blogHeroP1.cloneNode(true) : null;
  let clonedP2 = blogHeroP2 ? blogHeroP2.cloneNode(true) : null;

  // Remove originals from DOM
  if (blogH1 && blogH1.parentElement === section) section.removeChild(blogH1);

  let columnElements = [];
  let blogHeroImage = null;

  if (blogHeroP2) {
    // Extract and clone image before removing from DOM
    let imgNode = blogHeroP2.querySelector(':scope > picture, :scope > img');
    if (imgNode) blogHeroImage = imgNode.cloneNode(true);

    if (blogHeroP1 && blogHeroP1.parentElement === section) section.removeChild(blogHeroP1);
    if (blogHeroP2.parentElement === section) section.removeChild(blogHeroP2);

    moveImageInstrumentation(blogHeroImage);

    columnElements.push([blogHeroImage, clonedH1, clonedP1]);
  } else if (blogHeroP1) {
    let imgNode = blogHeroP1.querySelector(':scope > picture, :scope > img');
    if (imgNode) blogHeroImage = imgNode.cloneNode(true);

    moveImageInstrumentation(blogHeroImage);

    if (blogHeroP1.parentElement === section) section.removeChild(blogHeroP1);

    columnElements.push([blogHeroImage, clonedH1, null]);
  } else if (blogH1) {
    columnElements.push([null, clonedH1, null]);
  }

  // Defensive: If no columns found, log and skip
  if (!columnElements.length) {
    console.warn('Auto Blocking: No columns content extracted.');
    return;
  }

  // Prepend blocks in REVERSE order for desired order in DOM:
  section.prepend(
    buildBlock('article-info', { elems: [] }),
  );
  section.prepend(
    buildBlock('columns', columnElements),
  );
  section.prepend(
    buildBlock('social-media', { elems: [] }),
  );

  // Dynamically extract tags
  const tags = extractTagsFromMetadata();

  // Add tags and related articles after the section
  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: tags }),
    buildBlock('related-articles', { elems: [] }),
  );
  section.after(additionalContentSection);

  buildArticleSchema();

  // Ensure the content section is the first element in main
  if (section.parentElement.firstChild !== section) {
    section.parentElement.prepend(section);
  }
}
