import { loadScript } from '../../scripts/lib-franklin.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  try {
    // get the content
    const fragment = await getFragmentFromFile('/fragments/wesee.html');
    block.innerHTML = '';
    if (fragment) {
      block.innerHTML = fragment;
      // prepare the animations
      await loadScript('https://unpkg.com/scroll-out/dist/scroll-out.min.js');
      // eslint-disable-next-line no-undef
      ScrollOut({
        // eslint-disable-next-line func-names, object-shorthand
        onShown: function (el) {
          const ani = el.getAttribute('data-animation');
          el.classList.remove(ani);
          // eslint-disable-next-line no-void
          void el.offsetWidth;
          el.classList.add(ani);
        },
      });
    }
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load we see snippet: ${e}`);
  }
}
