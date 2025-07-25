import { div } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  block.id = 'products-tab';
  block.append(div({ class: 'block-pdp-page-tabs' }, 'PDP Products Block'));
}