import { decorateIcons, loadScript } from '../../scripts/lib-franklin.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

function loadAccessibe() {
  loadScript('../../scripts/lib-accessibe.js');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateStickyFooter(stickyFooter) {
  const stickyFooterClone = stickyFooter[0].cloneNode(true);
  stickyFooterClone.classList.add(...'fixed w-full flex gap-x-2 justify-center bottom-3 px-5 transition z-10'.split(' '));
  const firstButton = stickyFooterClone.querySelectorAll('button:not(.accessibility), a');
  firstButton.forEach((btn, index) => {
    if (index === 0) btn?.classList.add('rounded-l-full');
    else btn?.classList.add('rounded-r-full');
    btn?.classList.add(...'gap-x-2 px-3.5 py-2.5 text-white bg-danahergray-900 hover:bg-danaherpurple-500'.split(' '));
  });
  stickyFooterClone.querySelector('svg.users')?.classList.add('fill-transparent');
  stickyFooterClone.querySelector('button.accessibility')?.classList.add(...'gap-x-1 px-2.5 py-2.5 text-white rounded-full bg-danahergray-900 hover:bg-danaherpurple-500'.split(' '));
  const accessibeBtn = stickyFooterClone.children[stickyFooterClone.children.length - 1];
  const topBtn = stickyFooterClone.querySelector('button.scroll-top');
  topBtn.addEventListener('click', scrollToTop);
  stickyFooter[0].remove();
  accessibeBtn.addEventListener('click', loadAccessibe);
  stickyFooterClone.append(accessibeBtn);
  decorateIcons(stickyFooterClone.querySelector('button.accessibility')?.firstElementChild);
  document.querySelector('footer').appendChild(stickyFooterClone);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  try {
    // get the content
    const fragment = await getFragmentFromFile('/fragments/footer.html');
    block.innerHTML = '';
    if (fragment) {
      document.querySelector('.footer').parentElement.className += ' bg-danaherpurple-50';
      document.querySelector('.footer').className += ' max-w-7xl mx-auto py-6 px-6 sm:px-6 lg:px-8 divide-y divide-danaherpurple-500 print:hidden';
      const parser = new DOMParser();
      const fragmentHtml = parser.parseFromString(fragment, 'text/html');
      [...fragmentHtml.body.children].forEach((item) => {
        if (item.className === 'sticky-footer') {
          generateStickyFooter([item]);
        } else block.append(item);
      });
    }
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${e}`);
  }
}
