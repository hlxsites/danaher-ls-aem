import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.append(div({ class: 'block-pdp-description' }, 'PDP Description'));
}
