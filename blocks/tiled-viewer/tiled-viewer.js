import { loadScript } from '../../scripts/lib-franklin.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  try {
    // get the content
    const fragment = await getFragmentFromFile('/fragments/tiled.html');
    block.innerHTML = '';
    const parser = new DOMParser();
    const fragmentHtml = parser.parseFromString(fragment, 'text/html');
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadScript(fragmentHtml?.head?.firstElementChild?.src, { type: 'module' });
        block.append(fragmentHtml?.body?.firstElementChild);
      }
    });
    observer.observe(block);
    block.parentElement.classList.add('w-full');
    block.classList.add('h-[200px]', 'md: h-[385px]', 'lg: h-[642px]');
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${e}`);
  }
} // eslint-disable-next-line no-multiple-empty-lines
