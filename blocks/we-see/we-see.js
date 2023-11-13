import { loadScript } from '../../scripts/lib-franklin.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const url = block.querySelector('a').href;
  if (new URL(url).origin !== window.location.origin) {
    block.innerHTML = '<p>Cannot use unsafe cross-origin reference for the HTML Snippets.<p>';
    return;
  }

  if (!url) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn('no snippet found');
    return;
  }

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
    console.warn(`cannot load snippet at ${url}: ${e}`);
  }
}
