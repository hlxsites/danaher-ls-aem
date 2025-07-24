import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.append(div({ class: 'block-pdp-bundle-list' }, 'PDP Bundle List'));
}
