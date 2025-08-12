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

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const section = main.querySelector(':scope > div:nth-child(2)');
  if (!section) return;

  // Gather first H1 and two Ps (for Title and Text)
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';
  let blogHeroImage = '';

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
    if (imgElement) blogHeroImage = imgElement;
    if (imgElement) return false;
    return true;
  });

  // Remove elements from section (in order: image, H1, Ps)
  if (blogHeroImage && blogHeroImage.closest('p')) {
    // If image is inside P, remove the P (handled below)
  }
  if (blogH1) section.removeChild(blogH1);
  if (blogHeroP1) section.removeChild(blogHeroP1);
  if (blogHeroP2) section.removeChild(blogHeroP2);

  // Build the column div
  const columnDiv = div();
  if (blogHeroImage) {
    moveImageInstrumentation(blogHeroImage);
    // If image is inside a P, move the image out
    if (blogHeroImage.parentElement && blogHeroImage.parentElement.tagName === 'P') {
      columnDiv.appendChild(blogHeroImage);
    } else {
      columnDiv.appendChild(blogHeroImage);
    }
  }
  if (blogH1) columnDiv.appendChild(blogH1);
  if (blogHeroP1) columnDiv.appendChild(blogHeroP1);
  if (blogHeroP2) columnDiv.appendChild(blogHeroP2);

  // Wrap columnDiv in an array (single column for buildBlock)
  const columnsData = [[columnDiv]];

  // Remove any previous columns block if present
  const oldColumns = section.querySelector('.columns');
  if (oldColumns) oldColumns.remove();

  // Prepend the new columns block
  section.prepend(
    buildBlock('social-media', { elems: [] }),
    buildBlock('columns', columnsData),
    buildBlock('article-info', { elems: [] }),
  );

  // Add additional content section after current section
  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
  section.after(additionalContentSection);

  buildArticleSchema();

  // Move section to be first in main
  section.parentElement.prepend(section);
}
