import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

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

    const manageCookiesLink = footer.querySelector('ul>li>a[href="#manage-cookies"]');
    manageCookiesLink.classList.add('ot-sdk-show-settings');
    manageCookiesLink.href = `/#`;

    decorateIcons(footer);
    block.append(footer);
  }
}
