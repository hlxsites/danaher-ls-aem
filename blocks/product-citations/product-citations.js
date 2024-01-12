import { object } from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';

function buildCitations(id, data) {
  const citations = object({
    id,
    type: 'text/html',
    data,
    style: 'width:100%; height: 193px',
  });
  return citations;
}

export default async function decorate(block) {
  const attrs = { defer: true };
  await loadScript('https://cdn.bioz.com/assets/jquery-2.2.4.js', attrs);
  await loadScript('https://cdn.bioz.com/assets/bioz-w-api-6.0.min.js', attrs);

  const biozDiv = `<div id="bioz-w-pb-3230-bzen-q" href="https://www.bioz.com/" target="_blank" style="font-size: 12px; text-decoration: none; color: rgb(10, 67, 133);">
                  <img src="https://cdn.bioz.com/assets/favicon.png" 
                       style="width: 11px; height: 11px; vertical-align: baseline; padding-bottom: 0px; margin-left: 0px; margin-bottom: 0px; float: none;">
                  Powered by Bioz See more details on Bioz © 2024</div>`;

  const citationsLinkEl = block.querySelector('a');
  if (citationsLinkEl) {
    const id = citationsLinkEl.getAttribute('title');
    const data = citationsLinkEl.getAttribute('href');
    block.innerHTML = biozDiv;
    block.prepend(buildCitations(id, data));
  }
}
