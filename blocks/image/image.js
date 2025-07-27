import {
  div,
} from '../../scripts/dom-builder.js';
import {
  decorateIcons,
} from '../../scripts/lib-franklin.js';

export function createImageBlockFromColumnsWrapper(columnsWrapper) {
  const columnsBlock = columnsWrapper.querySelector('div.columns.block.columns-2-cols');
  if (!columnsBlock) return;

  const imgCol = columnsBlock.querySelector('div.columns-img-col');
  if (!imgCol) return;

  const picture = imgCol.querySelector('picture');
  if (!picture) return;

  const pictureClone = picture.cloneNode(true);

  const imageBlockWrapper = div({ class: 'image-block-wrapper' });

  const labelP = document.createElement('p');
  labelP.textContent = 'Image Block';
  labelP.className = 'image-block-label';

  imageBlockWrapper.appendChild(labelP);
  imageBlockWrapper.appendChild(pictureClone);

  columnsBlock.before(imageBlockWrapper);

  // Optionally remove original block
  // columnsBlock.remove();

  decorateIcons(imageBlockWrapper);
}

// Immediately call the function on the page element
const columnsWrapper = document.querySelector('.columns-wrapper');
if (columnsWrapper) {
  createImageBlockFromColumnsWrapper(columnsWrapper);
}
