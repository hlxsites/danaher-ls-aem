import { div, a, span } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { renderGridCard } from "./gridData.js";
import { renderListCard } from "./listData.js";
import { getProductInfo } from "../../scripts/common-utils.js";
/**
 * Determines the number of cards to display per page in grid view based on window width.
 * @returns {number} - Number of cards per page (1 for mobile, 2 for tablet, 4 for desktop).
 */
function getCardsPerPageGrid() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

/**
 * Main function to decorate the top-selling block with a carousel of product cards.
 * @param {HTMLElement} block - The block element to decorate.
 */
export default async function decorate(block) {}
