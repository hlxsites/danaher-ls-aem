import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateStickyFooter(stickyFooter) {
  const stickyFooterClone = stickyFooter[0].cloneNode(true);
  const allNestedAnchorChilds = stickyFooterClone.querySelectorAll('a');
  const container = document.createElement('div');
  container.className = 'sticky-footer';
  const wrapper = document.createElement('div');
  wrapper.className = 'btn-group';
  allNestedAnchorChilds.forEach((child) => {
    const childClone = child.cloneNode(true);
    childClone.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5 users"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg> <span class="hidden md:block">${child.textContent}</span>`;
    childClone.className = 'btn';
    childClone.title = childClone.textContent.trim();
    wrapper.appendChild(childClone);
  });
  const topFeature = document.createElement('button');
  topFeature.className = 'btn';
  topFeature.title = 'Top';
  topFeature.setAttribute('aria-label', 'scroll to top of the page');
  topFeature.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5" data-di-rand="1694779822323"><path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clip-rule="evenodd"></path></svg> <span class="hidden md:block">Top</span>';
  topFeature.addEventListener('click', scrollToTop);
  wrapper.appendChild(topFeature);
  stickyFooter[0].remove();
  container.append(wrapper);
  const accessibe = document.createElement('button');
  accessibe.setAttribute('aria-label', 'users');
  accessibe.setAttribute('data-acsb-custom-trigger', 'true');
  accessibe.className = 'accessibility';
  accessibe.innerHTML = `<svg class="w-5 md:w-6 h-5 md:h-6" viewBox="0 0 22 27" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.6019 4.99946C11.7063 4.99946 12.6016 4.10415 12.6016 2.99973C12.6016 1.89531 11.7063 1 10.6019 1C9.49748 1 8.60217 1.89531 8.60217 2.99973C8.60217 4.10415 9.49748 4.99946 10.6019 4.99946Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
      <path d="M8.01355 13.9217C8.15836 13.0188 8.22333 12.1455 7.98878 11.5421C7.78891 11.0229 7.35395 10.7327 6.82869 10.5345L2.20211 9.03747C1.60197 8.83761 1.04147 8.5023 1.00238 7.84049C0.952275 6.99039 1.70217 6.44035 2.45262 6.64077C2.45262 6.64077 6.85236 8.19783 10.6024 8.19783C14.3525 8.19783 18.7021 6.64792 18.7021 6.64792C19.6023 6.39796 20.2019 7.09775 20.2019 7.83719C20.2019 8.57663 19.6519 8.79741 19.0022 9.03417L14.6024 10.6298C14.2027 10.7795 13.5525 11.0796 13.3025 11.5388C13.0024 12.0762 13.0525 13.0155 13.1973 13.9184L13.4924 15.4001L15.3628 23.595C15.5026 24.2524 15.0478 24.8668 14.3927 24.9819C13.7375 25.097 13.2023 24.6499 13.0079 24.014L11.1299 18.2174C11.0396 17.9394 10.9597 17.658 10.8898 17.3739L10.6019 16.2001L10.337 17.2825C10.2528 17.6277 10.1564 17.9691 10.0469 18.3066L8.20185 24.009C8.00199 24.6516 7.47673 25.0964 6.82208 24.9819C6.16688 24.8674 5.70219 24.2023 5.84919 23.595L7.71844 15.4034L8.01355 13.9217Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
  </svg>`;
  container.append(accessibe);
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
