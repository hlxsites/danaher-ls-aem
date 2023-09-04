import { span } from '../../scripts/dom-builder.js';
import { a, div, img, ul, domEl, li, nav, button } from '../../scripts/dom-builder.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import megamenu from './megamenu.js';
import partners from './partners.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function buildLogosBlock(headerBlock) {
  const logosWrapper = div({ class: 'bg-danaherblue-600' },
    nav({ class: 'lg:flex' }),
  );
  const logosUl = ul({ class: 'h-14 flex flex-grow justify-center' });
  const partnerNames = Object.keys(partners);
  partnerNames.forEach((partner) => {
    const partnerInfo = partners[partner];
    const logoLi = li({ class: 'flex justify-center items-center group md:mx-5 mx-10' },
      a({
        class: 'h-full flex justify-center items-center group-hover:bg-danaherblue-700 bg-danaherblue-600',
        href: `${partnerInfo.website}?utm_source=dhls_website&utm_medium=referral&utm_content=header`,
        target: '_blank',
        rel: 'noopener noreferrer'
      },
        img({
          class: 'h-7 px-4 at-element-marker',
          src: `/icons/logos/${partner}.svg`,
          alt: partnerInfo.name,
          style: 'filter: brightness(0) invert(1);',
        }),
      ),
    );
    logosUl.append(logoLi);
  });
  logosWrapper.querySelector('nav').append(logosUl);
  headerBlock.append(logosWrapper);
}

function buildSearchBlock(headerBlock) {
  // TODO
}

function buildNavBlock(headerBlock) {
  const navWrapper = div({ class: 'megamenu' },
    domEl('nav', { class: 'bg-danaherblue-900' },
      div({ class: 'lg:block mx-auto max-w-7xl bg-danaherblue-900' }),
    ),
  );
  const desktopNav = nav({ class: 'flex items-center' });
  desktopNav.append(
    div({ class: 'ml-1 mr-14 lg:flex lg:pl-8 xl:pl-4 items-center' },
      a({ class: 'flex items-center !text-white text-lg hover:text-white lifesciences-logo-link', href: '/', target: '_self' },
        'Life Sciences',
        img({ class: 'inline-block h-5 w-5 ml-3 text-gray-500', src: '/icons/icon-home.svg', alt: 'Home', style: 'filter: brightness(0) invert(0.5);' }),
      ),
    )
  );
  megamenu.sections.forEach((item) => {
    if (megamenu.includedSections.includes(item.name)) {
      const menuItemEl = div({ class: 'py-2 space-x-4 hoverable' },
        button({
          class: 'btn !bg-transparent !text-white !font-medium !ring-0 !border-0 !ring-offset-0 group relative',
        },
          span(item.name),
          item.items.length > 0 ? img({
            class: 'chevy ml-2 h-5 w-5 transition group-hover:hidden',
            src: '../../icons/icon-chevron-down.svg',
            style: 'filter: brightness(0) invert(1);',
            alt: item.name,
          }) : '',
          item.items.length > 0 ? img({
            class: 'chevy ml-2 h-5 w-5 transition hidden group-hover:block',
            src: '../../icons/icon-chevron-up.svg',
            style: 'filter: brightness(0) invert(1);',
            alt: item.name,
          }) : '',
        ),
      );
      desktopNav.append(menuItemEl);
    }
  });
  navWrapper.querySelector('nav > div').append(desktopNav);
  headerBlock.append(navWrapper);
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
//   const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
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
  block.innerHTML = '';
  console.log(megamenu);

  buildLogosBlock(block);
  buildSearchBlock(block);
  buildNavBlock(block);

}
