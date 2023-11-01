import { decorateIcons, loadScript } from '../../scripts/lib-franklin.js';

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
  const parser = new DOMParser();
  const html = parser.parseFromString(text, 'text/html');
  return html.body.children;
}

function loadAccessibe() {
  loadScript('../../scripts/lib-accessibe.js');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateStickyFooter(stickyFooter) {
  const stickyFooterClone = stickyFooter[0].cloneNode(true);
  const accessibeBtn = stickyFooterClone.children[stickyFooterClone.children.length - 1];
  const topBtn = stickyFooterClone.querySelector('button.scroll-top');
  topBtn.addEventListener('click', scrollToTop);
  stickyFooter[0].remove();
  accessibeBtn.addEventListener('click', loadAccessibe);
  stickyFooterClone.append(accessibeBtn);
  decorateIcons(stickyFooterClone);
  document.body.appendChild(stickyFooterClone);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  try {
    // get the content
    const fragment = await getFragmentFromFile('/fragments/footer/master.plain.html');
    block.innerHTML = '';
    const divEl = document.createElement('div');
    if (fragment && fragment.length > 0) {
      document.querySelector('.footer').parentElement.className += ' bg-danaherpurple-800';
      document.querySelector('.footer').className += ' max-w-7xl mx-auto text-white py-6 px-6 sm:px-6 lg:px-8 divide-y divide-danaherpurple-500 print:hidden';
      [...fragment].forEach((item) => {
        if (item.className === 'sticky-footer') {
          generateStickyFooter([item]);
        } else block.innerHTML = block.innerHTML + item.outerHTML;
      });
    }
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${e}`);
  }
}