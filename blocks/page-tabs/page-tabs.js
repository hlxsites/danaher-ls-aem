import {
  a, div, li, option, select, span, ul,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getProductResponse } from '../../scripts/commerce.js';
import { scrollPageTabFixed } from '../../scripts/scripts.js';

const extractIconName = (path) => path.split('/').pop().split('.')[0];

function openTab(target) {
  const parent = target.parentNode;
  const main = parent.closest('main');
  const selected = target.getAttribute('aria-selected') === 'true';
  if (!selected) {
    // close all open tabs
    const openPageNav = target.closest('ul').querySelectorAll('li[aria-selected="true"]');
    const openContent = main.querySelectorAll('.section.page-tab[aria-hidden="false"]');
    openPageNav.forEach((tab) => {
      tab.setAttribute('aria-selected', false);
      parent.children[0]?.classList.remove();
      tab?.children[0]?.children[2]?.classList.remove('[&_svg]:stroke-white');
      tab?.children[0]?.children[2]?.classList.add('[&_svg]:stroke-danaherpurple-500');
    });
    openContent.forEach((tab) => {
      tab.setAttribute('aria-hidden', true);
      tab.classList.add('hidden');
    });
    // open clicked tab
    parent.setAttribute('aria-selected', true);
    const tabs = main.querySelectorAll(`div.section[aria-labelledby="${target.getAttribute('href').substring(1)}"]`);
    tabs.forEach((tab) => {
      tab.setAttribute('aria-hidden', false);
      tab.classList.remove('hidden');
    });
    const productHeroBottom = main.querySelector('.product-hero .basic-info');
    productHeroBottom.scrollIntoView({
      behavior: 'smooth',
    });
  }
}

export function createTabList(tabs, currentTab, isJumpMenu) {
  const ulTag = ul(
    { class: 'flex overflow-hidden shadow-lg', role: 'tablist' },
    ...tabs.map((tab) => {
      const isSelectedTab = tab.id === currentTab;
      const tabIcon = isJumpMenu ? tab.icon : `icon-dam-${tab.icon}`;
      const ancHref = isJumpMenu ? tab.link : `#${tab.id}`;
      const navItem = li(
        {
          class: 'overflow-hidden capitalize group', role: 'tab', 'data-tabid': tab.id, 'aria-selected': isSelectedTab,
        },
        a(
          {
            class: 'w-48 flex gap-x-2 pl-3 pr-2 bg-white text-danaherblack-500 group-hover:text-white group-hover:bg-danaherpurple-500',
            href: ancHref,
            title: tab.name,
          },
          span({ class: `w-8 h-8 icon ${tabIcon} stroke-1 stroke-danaherpurple-500 group-hover:stroke-white` }),
          span({ class: 'py-2 text-sm tracking-wider font-bold' }, tab.name),
          span({ class: `icon icon-chevron-down mt-4 mb-2 [&_svg]:duration-300 [&_svg]:stroke-1 [&_svg]:group-hover:translate-y-1 [&_svg]:group-hover:stroke-white ${isSelectedTab ? '[&_svg]:stroke-white' : '[&_svg]:stroke-danaherpurple-500'}` }),
        ),
      );
      return navItem;
    }),
  );
  decorateIcons(ulTag);
  return ulTag;
}

// For mobile view
export function createDropdownList(tabs, currentTab, isJumpMenu) {
  const dropdownWrapper = div(
    { class: 'mobile-jump-menu' },
    select(
      { id: 'selectedTabId', class: 'selected-tab', 'aria-label': 'selectedTabId' },
      ...tabs.map((tab) => {
        const value = isJumpMenu ? tab.link : tab.id;
        const isSelectedTab = tab.id === currentTab;
        const navItem = option({ value }, tab.name);
        if (isSelectedTab) navItem.setAttribute('selected', isSelectedTab);
        return navItem;
      }),
    ),
  );
  return dropdownWrapper;
}

function hasProducts(productResponse) {
  return productResponse?.raw?.objecttype === 'Family' && productResponse?.raw?.numproducts > 0;
}

function hasParts(productResponse) {
  return productResponse?.raw?.objecttype === 'Bundle' && productResponse?.raw?.numproducts > 0;
}

function hasResources(productResponse) {
  return productResponse?.raw?.numresources > 0;
}

function hasSpecifications(productResponse) {
  return productResponse?.raw?.numattributes > 0;
}

function hasOverview(productResponse) {
  return productResponse?.raw?.numattributes > 0;
}

export default async function decorate(block) {
  const response = await getProductResponse();
  let productResponse;
  if (response?.length > 0) {
    productResponse = response.at(0);
  }

  const main = block.closest('main');
  const pageTabsContainer = main.querySelector('.page-tabs-container');
  const sections = main.querySelectorAll('.section.page-tab');
  const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));

  if (tabSections) {
    let currentTab = window.location.hash?.replace('#', '') || tabSections[0].getAttribute('.aria-labelledby');
    const tabExists = tabSections.some((section) => section.getAttribute('aria-labelledby') === currentTab);
    if (!tabExists) {
      const element = document.getElementById(currentTab);
      if (element) {
        currentTab = element.closest('.page-tab')?.getAttribute('aria-labelledby');
        setTimeout(() => {
          element.scrollIntoView();
        }, 5000);
      } else {
        currentTab = tabSections[0].getAttribute('aria-labelledby');
      }
    }

    sections.forEach((section) => {
      if (currentTab === section.getAttribute('aria-labelledby')) {
        section.setAttribute('aria-hidden', false);
        section.classList.remove('hidden');
      } else {
        section.setAttribute('aria-hidden', true);
        section.classList.add('hidden');
      }
    });

    const tabs = tabSections.map((tabSection) => {
      const tabName = tabSection.dataset.tabname;
      const tabId = tabSection.getAttribute('aria-labelledby');
      const tabIconPath = tabSection.dataset.tabicon;
      const iconName = extractIconName(tabIconPath);
      return { name: tabName, id: tabId, icon: iconName };
    });

    const filteredTabs = tabs.filter((tab) => {
      switch (tab.id) {
        case 'specifications':
          return hasSpecifications(productResponse);
        case 'resources':
          return hasResources(productResponse);
        case 'products':
          return hasProducts(productResponse);
        case 'product-details':
          return hasParts(productResponse);
        case 'overview':
          return hasOverview(productResponse);
        default:
          return true;
      }
    });

    const navList = createTabList(filteredTabs, currentTab);

    // For Mobile View
    const dropdownList = createDropdownList(filteredTabs, currentTab);
    const menuElement = document.querySelector('mobilemenu');
    menuElement.appendChild(dropdownList);

    block.innerHTML = '';
    block.append(navList);
  }

  const selectEl = document.getElementById('selectedTabId');
  selectEl.addEventListener('change', (event) => {
    const innerText = event.target.value;
    window.location.hash = `#${innerText}`;
  });

  window.addEventListener('hashchange', () => {
    const currentTab = window.location.hash?.replace('#', '') || tabSections[0].getAttribute('.aria-labelledby');
    if (!currentTab) return;

    const element = main.querySelector(`.page-tab[aria-labelledby="${currentTab}"]`);
    if (element) {
      const targetTabId = element.getAttribute('aria-labelledby');
      const targetTab = block.querySelector(`a[href="#${targetTabId}"]`);
      if (!targetTab) return;
      openTab(targetTab);
    }

    const targetTab = block.querySelector(`a[href="#${currentTab}"]`);
    if (!targetTab) return;

    openTab(targetTab);
  });

  scrollPageTabFixed(pageTabsContainer);
  window.addEventListener('scroll', () => {
    scrollPageTabFixed(pageTabsContainer);
  });

  block.classList.add('z-10');
  return block;
}
