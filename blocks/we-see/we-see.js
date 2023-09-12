import { loadScript } from '../../scripts/lib-franklin.js';

async function getFragmentFromFile(fragmentURL) {
  const response = await fetch(fragmentURL);
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading fragment details', response);
    return null;
  }
  const text = await response.text();
  if (!text) {
    // eslint-disable-next-line no-console
    console.error('fragment details empty', fragmentURL);
    return null;
  }
  return text;
}

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
    const fragment = await getFragmentFromFile(url);
    block.innerHTML = fragment;

    // prepare the animations
    await loadScript('https://unpkg.com/scroll-out/dist/scroll-out.min.js');
    ScrollOut({
      onShown: function (el) {
        let ani = '';
        ani = el.getAttribute('data-animation');
        el.classList.remove(ani);
        void el.offsetWidth;
        el.classList.add(ani);
      },
    });
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${url}: ${e}`);
  }
}
