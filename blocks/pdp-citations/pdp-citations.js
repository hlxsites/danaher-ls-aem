import {
  a, div, img, object,
} from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.id = 'citations-tab';
  // const citationsLinkEl = block.querySelector('a');
  // if (citationsLinkEl) {
  // wobj-3230-5080337-q
  // const id = citationsLinkEl.getAttribute('title');
  // //https://www.bioz.com/v_widget_6_0/3230/5080337/
  // const data = citationsLinkEl.getAttribute('href');
  const id = 'wobj-3230-5080337-q';
  const data = 'https://www.bioz.com/v_widget_6_0/3230/5080337/';
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
  // }
}
