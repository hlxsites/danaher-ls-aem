import {
  a, div, img, object,
} from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const citationsLinkEl = block.querySelector('a');
  if (citationsLinkEl && window.location.toString().includes('#citations')) {
    const id = citationsLinkEl.getAttribute('title');
    const data = citationsLinkEl.getAttribute('href');
    block.innerHTML = '';
    block.append(object({
      id, type: 'text/html', data, class: 'w-full h-48',
    }));
    block.append(div(
      { id, class: 'text-xs text-danaherblue-900' },
      img({ src: '/icons/bioz-favicon.png', class: 'w-3 h-3 align-top pb-0 ml-0 mb-0 float-none', alt: `${id}` }),
      a({ href: 'https://www.bioz.com/', target: '_blank', title: 'link' }, 'Powered by Bioz See more details on Bioz © 2024'),
    ));

    const attrs = { defer: true };
    loadScript('https://cdn.bioz.com/assets/jquery-2.2.4.js', attrs);
    loadScript('https://cdn.bioz.com/assets/bioz-w-api-6.0.min.js', attrs);
  }
}
