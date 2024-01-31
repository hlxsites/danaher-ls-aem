import { loadCSS } from '../../scripts/lib-franklin.js';

loadCSS('/blocks/banner/banner.css');

export default function decorate(block) {
  const main = document.querySelector('main');
  main.parentNode.insertBefore(block, main);
}
