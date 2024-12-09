import { loadScript } from '../../scripts/lib-franklin.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  try {
    // get the content
    const fragment = await getFragmentFromFile('/fragments/spline.html');
    block.innerHTML = '';
    const parser = new DOMParser();
    const fragmentHtml = parser.parseFromString(fragment, 'text/html');
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        setTimeout(() => {
          loadScript(fragmentHtml?.head?.firstElementChild?.src, { type: 'module' });
          block.append(fragmentHtml?.body?.firstElementChild);
        }, 2000);
      }
    });
    observer.observe(block);
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${e}`);
  }
}
