import { button, div, span } from '../../scripts/dom-builder.js';

import { readBlockConfig, decorateIcons, loadScript } from '../../scripts/lib-franklin.js';

function loadAccessibe() {
  loadScript('../../scripts/lib-accessibe.js')
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateStickyFooter(stickyFooter) {
  const stickyFooterClone = stickyFooter[0].cloneNode(true);
  const allNestedAnchorChilds = stickyFooterClone.querySelectorAll('a');
  const container = div({ class: 'sticky-footer' });
  const wrapper = div({ class: 'btn-group' });
  allNestedAnchorChilds.forEach((child) => {
    const childClone = child.cloneNode(true);
    childClone.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" aria-label="${child.textContent}" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5 users"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg> <span class="hidden md:block">${child.textContent}</span>`;
    childClone.className = 'btn';
    const url = new URL(childClone.href);
    url.searchParams.set('utm_previouspage', window.location.href.split('?')[0]);
    childClone.href = url.href;
    childClone.title = childClone.textContent.trim();
    wrapper.appendChild(childClone);
  });
  const topFeature = button(
    { class: 'btn', title: 'Top', 'aria-label': 'scroll to top of the page' },
    span({ class: 'icon icon-chevron-up block w-5 h-5' }),
    span({ class: 'hidden md:block' }, 'Top'),
  );
  topFeature.addEventListener('click', scrollToTop);
  wrapper.appendChild(topFeature);
  stickyFooter[0].remove();
  container.append(wrapper);
  const accessibe = button(
    { class: 'accessibility', 'aria-label': 'users', 'data-acsb-custom-trigger': 'true' },
    span({ class: 'icon icon-accessibe block w-5 md:w-6 h-5 md:h-6' }),
  );
  accessibe.addEventListener('click', loadAccessibe);
  container.append(accessibe);
  decorateIcons(container);
  document.body.appendChild(container);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/fragments/footer/';
  const resp = await fetch(`${footerPath}master.plain.html`, window.location.pathname.endsWith('/master.plain.html') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;
    generateStickyFooter(footer.getElementsByClassName('sticky-footer'));
    const manageCookiesLink = footer.querySelector('ul>li>a[href="#manage-cookies"]');
    manageCookiesLink.classList.add('ot-sdk-show-settings');
    manageCookiesLink.href = '/#';
    decorateIcons(footer);
    block.append(footer);
  }
}
