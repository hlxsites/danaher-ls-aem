import {
  span, div, nav, button, input,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
// const isDesktop = window.matchMedia('(min-width: 900px)');

function buildLogosBlock(headerBlock) {
  const logoHtmlBlock = headerBlock.children[0];
  logoHtmlBlock.classList.add('bg-danaherblue-600', 'lg:flex');
  const logoUl = logoHtmlBlock.querySelector('ul');
  logoUl.classList.add('h-14', 'flex', 'flex-grow', 'justify-center');
  const logoLis = logoUl.querySelectorAll(':scope > li');
  logoLis.forEach((logoLi) => {
    logoLi.classList.add('flex', 'justify-center', 'items-center', 'group', 'md:mx-5', 'mx-10');
    const logoPicture = logoLi.querySelector(':scope > picture');
    const logoImg = logoPicture.querySelector('img');
    logoImg.classList.add('h-7', 'w-auto', 'px-4');
    logoImg.removeAttribute('height');
    logoImg.removeAttribute('width');
    logoPicture.setAttribute('style', 'filter: brightness(0) invert(1);');
    const logoLink = logoLi.querySelector(':scope > a');
    const logoTitle = logoLink.textContent;
    logoLink.textContent = '';
    logoLink.classList.add('h-full', 'flex', 'justify-center', 'items-center', 'group-hover:bg-danaherblue-700', 'bg-danaherblue-600');
    logoLink.setAttribute('alt', logoTitle);
    logoLink.append(logoPicture);
    logoLi.innerHTML = '';
    logoLi.append(logoLink);
  });
}

function buildSearchBlock(headerBlock) {
  const searchHtmlBlock = headerBlock.children[1];
  searchHtmlBlock.className = 'bg-danaherblue-600 flex-grow';
  const searchHtmlBlockInner = div({ class: 'flex mx-auto items-center max-w-7xl flex-col md:flex-row f-new f-row' });
  const searchNewBlock = div();

  // danaher logo
  const logoBlock = div({ class: 'flex items-center justify-center md:justify-start lg:w-1/4' });
  const logoPictureBlock = searchHtmlBlock.querySelector(':scope > p > picture');
  const logoLinkBlock = searchHtmlBlock.querySelector(':scope > p > a');
  logoPictureBlock.setAttribute('alt', logoLinkBlock.textContent);
  logoPictureBlock.classList.add('h-full', 'object-contain', 'at-element-click-tracking');
  logoPictureBlock.setAttribute('style', 'filter: brightness(0) invert(1);');
  logoLinkBlock.classList.add('justify-start', 'w-28', 'lg:w-44', 'lg:h-8', 'bg-danaherblue-600');
  logoLinkBlock.innerHTML = '';
  logoLinkBlock.append(logoPictureBlock);
  logoBlock.append(logoLinkBlock);
  searchHtmlBlockInner.append(logoBlock);

  // log in area
  const loginBlock = div({ class: 'f-col lg:w-1/4 my-auto order-none md:order-last ml-auto md:ml-0 h-full md:justify-end' });
  const loginBlockInner = div({ class: 'flex flex-row items-center justify-end h-20 gap-2' });
  const searchLinks = searchHtmlBlock.querySelectorAll(':scope > ul > li > a');
  const loginLink = searchLinks[0];
  loginLink.className = 'text-white hover:text-white relative lg:inline-flex text-xs pr-3 font-semibold';
  const loginIcon = loginLink.querySelector('span');
  loginIcon.setAttribute('style', 'filter: brightness(0) invert(1);');
  const loginSpan = span({ class: 'w-12 pl-2 lg:block' }, loginLink.textContent);
  loginLink.textContent = '';
  loginLink.append(loginIcon);
  loginLink.append(loginSpan);
  const quoteLink = searchLinks[1];
  quoteLink.className = 'text-white hover:text-white relative lg:inline-flex text-xs pr-3 font-semibold';
  const quoteIcon = quoteLink.querySelector('span');
  quoteIcon.setAttribute('style', 'filter: brightness(0) invert(1);');
  const quoteSpan = span({ class: 'w-12 pl-2 lg:block' }, quoteLink.textContent);
  const quoteCount = span({ class: 'absolute top-4 left-6 text-lightblue-500' }, 0);
  quoteLink.textContent = '';
  quoteLink.append(quoteIcon);
  quoteLink.append(quoteSpan);
  quoteLink.append(quoteCount);
  loginBlockInner.append(loginLink);
  loginBlockInner.append(quoteLink);
  loginBlock.append(loginBlockInner);
  searchHtmlBlockInner.append(loginBlock);

  // search box
  searchHtmlBlockInner.append(div(
    { class: 'lg:w-1/2' },
    input({
      type: 'text',
      placeholder: 'Search',
      class: 'h-full outline-none w-full grow px-4 py-3.5 text-neutral-dark placeholder-neutral-dark text-lg rounded-md',
    }),
  ));

  // aggregation
  searchNewBlock.append(searchHtmlBlockInner);
  searchHtmlBlock.innerHTML = searchNewBlock.innerHTML;
}

function buildNavBlock(headerBlock) {
  const navHtmlBlock = headerBlock.children[2];
  navHtmlBlock.className = 'bg-danaherblue-900';
  const menuLinks = navHtmlBlock.querySelectorAll(':scope > ul > li');
  const homeLink = menuLinks[0].querySelector('a');
  homeLink.className = 'flex items-center !text-white text-lg hover:text-white lifesciences-logo-link';
  const homeLinkImg = homeLink.querySelector('span.icon');
  homeLinkImg.setAttribute('style', 'filter: brightness(0) invert(0.5);');
  homeLinkImg.classList.add('inline-block', 'h-5', 'w-5', 'ml-3', 'text-gray-500');
  homeLinkImg.setAttribute('alt', 'Home');
  const navWrapper = div(
    { class: 'megamenu' },
    nav(
      { class: 'bg-danaherblue-900' },
      div({ class: 'lg:block mx-auto max-w-7xl bg-danaherblue-900' }),
    ),
  );
  const desktopNav = nav({ class: 'flex items-center' });
  desktopNav.append(
    div(
      { class: 'ml-1 mr-14 lg:flex lg:pl-8 xl:pl-4 items-center' },
      homeLink,
    ),
  );
  [...menuLinks].forEach((item, idx) => {
    if (idx > 0) {
      const menuItemName = item.querySelector(':scope > p').textContent;
      const childMenuItems = item.querySelectorAll(':scope > ul > li');
      const menuItemEl = div(
        { class: 'py-2 space-x-4 hoverable' },
        button(
          {
            class: 'btn !bg-transparent !text-white !font-medium !ring-0 !border-0 !ring-offset-0 group relative',
          },
          span(menuItemName),
          childMenuItems.length > 0 ? span({ class: 'up hidden group-hover:block' }) : '',
          childMenuItems.length > 0 ? span({ class: 'down group-hover:hidden' }) : '',
        ),
      );
      if (childMenuItems.length > 0) {
        menuItemEl.querySelector('.up').innerHTML = `
          <svg data-v-5a2dd2cf="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="chevy ml-2 h-5 w-5 transition" data-di-rand="1694003395964">
            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd"></path>
          </svg>`;
        menuItemEl.querySelector('.down').innerHTML = `
          <svg data-v-5a2dd2cf="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="chevy ml-2 h-5 w-5 transition" data-di-rand="1694003395964">
            <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd"></path>
          </svg>`;
      }
      desktopNav.append(menuItemEl);
    }
  });
  navWrapper.append(desktopNav);
  navHtmlBlock.innerHTML = '';
  navHtmlBlock.append(navWrapper);

  // navWrapper.querySelector('nav > div').append(desktopNav);
  // headerBlock.append(navWrapper);
}

// function closeOnEscape(e) {
//   if (e.code === 'Escape') {
//     const nav = document.getElementById('nav');
//     const navSections = nav.querySelector('.nav-sections');
//     const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
//     if (navSectionExpanded && isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections);
//       navSectionExpanded.focus();
//     } else if (!isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections);
//       nav.querySelector('button').focus();
//     }
//   }
// }

// function openOnKeydown(e) {
//   const focused = document.activeElement;
//   const isNavDrop = focused.className === 'nav-drop';
//   if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
//     const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
//     // eslint-disable-next-line no-use-before-define
//     toggleAllNavSections(focused.closest('.nav-sections'));
//     focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
//   }
// }

// function focusNavSection() {
//   document.activeElement.addEventListener('keydown', openOnKeydown);
// }

// /**
//  * Toggles all nav sections
//  * @param {Element} sections The container element
//  * @param {Boolean} expanded Whether the element should be expanded or collapsed
//  */
// function toggleAllNavSections(sections, expanded = false) {
//   sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
//     section.setAttribute('aria-expanded', expanded);
//   });
// }

// /**
//  * Toggles the entire nav
//  * @param {Element} nav The container element
//  * @param {Element} navSections The nav sections within the container element
//  * @param {*} forceExpanded Optional param to force nav expand behavior when not null
//  */
// function toggleMenu(nav, navSections, forceExpanded = null) {
//   const expanded = forceExpanded !== null ?
//    !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
//   const button = nav.querySelector('.nav-hamburger button');
//   document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
//   nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//   toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
//   button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
//   // enable nav dropdown keyboard accessibility
//   const navDrops = navSections.querySelectorAll('.nav-drop');
//   if (isDesktop.matches) {
//     navDrops.forEach((drop) => {
//       if (!drop.hasAttribute('tabindex')) {
//         drop.setAttribute('role', 'button');
//         drop.setAttribute('tabindex', 0);
//         drop.addEventListener('focus', focusNavSection);
//       }
//     });
//   } else {
//     navDrops.forEach((drop) => {
//       drop.removeAttribute('role');
//       drop.removeAttribute('tabindex');
//       drop.removeEventListener('focus', focusNavSection);
//     });
//   }
//   // enable menu collapse on escape keypress
//   if (!expanded || isDesktop.matches) {
//     // collapse menu on escape press
//     window.addEventListener('keydown', closeOnEscape);
//   } else {
//     window.removeEventListener('keydown', closeOnEscape);
//   }
// }

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const resp = await fetch('/fragments/header/master.plain.html');

  if (resp.ok) {
    const html = await resp.text();

    // build header DOM
    const headerBlock = div();
    headerBlock.innerHTML = html;

    buildLogosBlock(headerBlock);
    buildSearchBlock(headerBlock);
    buildNavBlock(headerBlock);

    // decorate nav DOM
    const navEl = nav({ id: 'nav' });
    navEl.innerHTML = html;

    // const classes = ['brand', 'sections', 'tools'];
    // classes.forEach((c, i) => {
    //   const section = nav.children[i];
    //   if (section) section.classList.add(`nav-${c}`);
    // });

    // const navSections = nav.querySelector('.nav-sections');
    // if (navSections) {
    //   navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
    //     if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
    //     navSection.addEventListener('click', () => {
    //       if (isDesktop.matches) {
    //         const expanded = navSection.getAttribute('aria-expanded') === 'true';
    //         toggleAllNavSections(navSections);
    //         navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    //       }
    //     });
    //   });
    // }

    // hamburger for mobile
    //   const hamburger = document.createElement('div');
    //   hamburger.classList.add('nav-hamburger');
    //   hamburger.innerHTML = `<button type="button" aria-controls="nav"
    // aria-label="Open navigation">
    //       <span class="nav-hamburger-icon"></span>
    //     </button>`;
    //   hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    //   nav.prepend(hamburger);
    //   nav.setAttribute('aria-expanded', 'false');
    //   // prevent mobile nav behavior on window resize
    //   toggleMenu(nav, navSections, isDesktop.matches);
    //   isDesktop.addEventListener('change', () => toggleMenu(nav, navSections,
    // isDesktop.matches));

    // const navWrapper = div({ class: 'nav-wrapper' }, navEl);
    decorateIcons(headerBlock);
    block.append(headerBlock);
  }
  // buildLogosBlock(block);
  // buildSearchBlock(block);
  // buildNavBlock(block);
  return block;
}
