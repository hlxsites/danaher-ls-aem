import { buildBlock } from "../../scripts/lib-franklin.js";
import { div, } from '../../scripts/dom-builder.js';

export default async function buildAutoBlocks() {
    alert('Hey! I am PDP');
    const main = document.querySelector('main');
    const pageTabsBlock = div(buildBlock('pdp-page-tabs', { elems: [] }));
    main.querySelector('div')?.append(pageTabsBlock);
}