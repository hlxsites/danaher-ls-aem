import { div } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  block.id = 'resources-tab';
  block.replaceChildren();
  block.append(div({ class: 'block-pdp-page-tabs' }, 'PDP Resources Block'));
}