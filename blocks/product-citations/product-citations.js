import { object } from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';

function createCitations() {
  const citations = object({
    id: 'wobj-3230-mica-q',
    type: 'text/html',
    data: 'https://www.bioz.com/v_widget_6_0/3230/mica/',
    style: 'width:100%; height: 193px',
  });
  return citations;
}

export default async function decorate(block) {
  const attrs = { defer: true };
  await loadScript('https://cdn.bioz.com/assets/jquery-2.2.4.js', attrs);
  await loadScript('https://cdn.bioz.com/assets/bioz-w-api-6.0.min.js', attrs);

  block.innerHTML = '';
  block.append(createCitations());
}
