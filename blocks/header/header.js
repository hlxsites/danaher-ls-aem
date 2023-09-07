import {
  span, div, nav, button, input, a,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
// const isDesktop = window.matchMedia('(min-width: 900px)');

function buildLogosBlock(headerBlock) {
  const logoHtmlBlock = headerBlock.children[0];
  logoHtmlBlock.className = 'bg-danaherblue-600 hidden lg:block';
  const logoUl = logoHtmlBlock.querySelector('ul');
  logoUl.className = 'h-14 flex justify-center';
  const logoLis = logoUl.querySelectorAll(':scope > li');
  logoLis.forEach((logoLi) => {
    logoLi.className = 'group md:mx-5 mx-10';
    const logoLink = logoLi.querySelector(':scope > a');
    const logoPicture = logoLi.querySelector(':scope > picture');
    const logoImg = logoPicture.querySelector('img');
    logoImg.className = 'h-7 w-auto px-4';
    const logoTitle = logoLink.textContent;
    logoImg.setAttribute('alt', logoTitle);
    logoPicture.setAttribute('style', 'filter: brightness(0) invert(1);');
    logoLink.textContent = '';
    logoLink.className = 'h-full flex items-center group-hover:bg-danaherblue-700';
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
  const logoBlock = div({ class: 'flex items-center justify-center md:justify-start h-full w-full md:w-1/4' });
  const logoPictureBlock = searchHtmlBlock.querySelector(':scope > p > picture');
  const logoLinkBlock = searchHtmlBlock.querySelector(':scope > p > a');
  logoPictureBlock.setAttribute('alt', logoLinkBlock.textContent);
  logoPictureBlock.querySelector('img').className = 'h-full object-contain md:ml-4 mx-auto';
  logoPictureBlock.setAttribute('style', 'filter: brightness(0) invert(1);');
  logoLinkBlock.className = 'justify-start mx-auto py-2 lg:py-0 w-44 md:w-28 lg:w-44 lg:h-8';
  logoLinkBlock.innerHTML = '';
  logoLinkBlock.append(logoPictureBlock);
  const hamburgerIcon = a({ class: 'md:bg-danaherblue-900 md:py-6 h-full lg:hidden h-full px-2 my-auto !ring-0 !ring-offset-0 sticky' });
  hamburgerIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-8 w-8 text-danaherlightblue-500 hover:text-danaherlightblue-50" data-di-rand="1693233993603">
      <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z" clip-rule="evenodd"/>
    </svg>
  `;
  logoBlock.append(hamburgerIcon);
  logoBlock.append(logoLinkBlock);
  searchHtmlBlockInner.append(logoBlock);

  // log in  & quote
  const loginBlock = div({ class: 'f-col w-full md:w-1/4 my-auto order-last md:ml-auto md:mr-2 h-full md:justify-end' });
  const loginBlockInner = div({ class: 'flex flex-row items-center justify-end md:h-20 gap-2' });
  const searchLinks = searchHtmlBlock.querySelectorAll(':scope > ul > li > a');
  const loginLink = searchLinks[0];
  loginLink.className = 'text-white hover:text-white relative lg:inline-flex text-xs pr-3 font-semibold';
  const loginIcon = loginLink.querySelector('span');
  loginIcon.className = '';
  loginIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-white rounded-full" data-di-rand="1693233993603">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  `
  loginIcon.setAttribute('style', 'filter: brightness(0) invert(1);');
  const loginSpan = span({ class: 'w-12 pl-2 lg:block hidden lg:inline' }, loginLink.textContent);
  loginLink.textContent = '';
  loginLink.append(loginIcon);
  loginLink.append(loginSpan);
  const quoteLink = searchLinks[1];
  quoteLink.className = 'text-white hover:text-white relative lg:inline-flex text-xs pr-3 font-semibold';
  const quoteIcon = quoteLink.querySelector('span');
  quoteIcon.className = '';
  quoteIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-white rounded-full" data-di-rand="1693233993603">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
    </svg>
  `;
  quoteIcon.setAttribute('style', 'filter: brightness(0) invert(1);');
  const quoteSpan = span({ class: 'w-12 pl-2 lg:block hidden lg:inline' }, quoteLink.textContent);
  const quoteCount = span({ class: 'absolute top-4 left-6 text-lightblue-500' }, 0);
  quoteLink.textContent = '';
  quoteLink.append(quoteIcon);
  quoteLink.append(quoteSpan);
  quoteLink.append(quoteCount);
  const searchIcon = a({ class: 'pr-3' });
  searchIcon.innerHTML = `
    <svg data-v-7a6a1796="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="md:hidden h-6 w-6 text-white" data-di-rand="1694019027553">
      <path data-v-7a6a1796="" fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd"></path>
    </svg>
  `;
  const mobileHomeLink = a({
    class: 'h-full flex block md:hidden bg-danaherblue-900 py-2.5 px-3 items-center text-base text-white rounded-tr-xl overflow-hidden mr-auto'
  }, 'Life Sciences');
  loginBlockInner.append(mobileHomeLink);
  loginBlockInner.append(searchIcon);
  loginBlockInner.append(loginLink);
  loginBlockInner.append(quoteLink);
  loginBlock.append(loginBlockInner);
  searchHtmlBlockInner.append(loginBlock);

  // search box
  searchHtmlBlockInner.append(div(
    { class: 'hidden md:block md:w-1/2' },
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
  navHtmlBlock.className = 'bg-danaherblue-900 hidden lg:block';
  const menuLinks = navHtmlBlock.querySelectorAll(':scope > ul > li');

  // home link
  const homeLink = menuLinks[0].querySelector('a');
  homeLink.className = 'flex items-center !text-white text-lg hover:text-white';
  const homeLinkImg = homeLink.querySelector('span.icon');
  homeLinkImg.className = 'inline-block w-5 ml-2';
  homeLinkImg.setAttribute('style', 'filter: brightness(0) invert(0.5);');
  homeLinkImg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="inline-block h-5 w-5 ml-3 text-gray-500" data-di-rand="1693233993608">
      <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69z"/>
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.43z"/>
    </svg>
  `;

  // nav
  const navWrapper = div(
    { class: 'megamenu' },
    nav(
      { class: 'bg-danaherblue-900' },
      div({ class: 'lg:block mx-auto max-w-7xl bg-danaherblue-900' }),
    ),
  );
  const desktopNav = nav({ class: 'flex content-start max-w-7xl  mx-auto' });
  desktopNav.append(
    div(
      { class: 'flex-none flex-grow-0 ml-1 mr-14 lg:flex lg:pl-8 xl:pl-4 items-center' },
      homeLink,
    ),
  );
  [...menuLinks].forEach((item, idx) => {
    if (idx > 0) {
      const menuItemName = item.querySelector(':scope > p').textContent;
      const childMenuItems = item.querySelectorAll(':scope > ul > li');
      const menuItemEl = div(
        { class: 'py-4 space-x-4 hoverable' },
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3BC7E5" aria-hidden="true" class="chevy ml-2 h-5 w-5 transition" data-di-rand="1693233993612">
            <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5z" clip-rule="evenodd"/>
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
