import {
  a, div, img, object,
} from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';
import { extractJsonFromHtml } from '../../scripts/html-to-json-parser.js';

export default async function decorate(block) {
  block.id = 'citations-tab';
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  const isPIM = document.querySelector('#authored-citations')?.children[0].textContent;
  let citationsId = response?.raw?.citationsid;
  let citationsUrl = response?.raw?.citationsurl;

  let citationsObj = {};
  const elem = document.querySelector('#authored-citations')?.children[3];
  let parsedData;
  if (elem) {
    parsedData = extractJsonFromHtml(elem);
  }
  if (isPIM !== undefined && isPIM === 'only-authored') {
    citationsObj = parsedData;
    citationsId = citationsObj?.id;
    citationsUrl = citationsObj?.data;
  }

  block.innerHTML = '';
  block.append(object({
    citationsId, type: 'text/html', citationsUrl, class: 'w-full h-48',
  }));
  block.append(div(
    { citationsId, class: 'text-xs text-danaherblue-900' },
    img({ src: '/icons/bioz-favicon.png', class: 'w-3 h-3 align-top pb-0 ml-0 mb-0 float-none', alt: `${citationsId}` }),
    a({ href: 'https://www.bioz.com/', target: '_blank', title: 'link' }, 'Powered by Bioz See more details on Bioz © 2024'),
  ));

  const attrs = { defer: true };
  loadScript('https://cdn.bioz.com/assets/jquery-2.2.4.js', attrs);
  loadScript('https://cdn.bioz.com/assets/bioz-w-api-6.0.min.js', attrs);
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}
