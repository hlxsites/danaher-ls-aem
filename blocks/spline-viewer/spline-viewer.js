import { getFragmentFromFile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  try {
    // get the content
    const fragment = await getFragmentFromFile('/fragments/spline.html');
    block.innerHTML = '';
    const parser = new DOMParser();
    const fragmentHtml = parser.parseFromString(fragment, 'text/html');
    [...fragmentHtml.body.children].forEach((item) => {
      block.append(item);
    });
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${e}`);
  }
}
