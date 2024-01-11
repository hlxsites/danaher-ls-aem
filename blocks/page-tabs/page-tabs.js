import {
  a, div, li, nav, span, ul,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

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
  }
}

function createTabList(tabs, currentTab) {
  return ul(
    { class: 'flex justify-center overflow-hidden bg-white bg-opacity-0 rounded-lg shadow-lg' },
    ...tabs.map((tab) => {
      const isSelectedTab = tab.id === currentTab;
      const navItem = li(
        { class: 'flex items-center justify-center w-32 h-32 overflow-hidden capitalize bg-gray-50 group', 'data-tabid': tab.id, 'aria-selected': isSelectedTab },
        a(
          {
            class: 'text-danaherblack-500 bg-white flex flex-col items-center justify-center w-full h-full group-hover:bg-danaherlightblue-500 group-hover:text-white',
            href: `#${tab.id}`,
          },
          span({ class: `icon icon-dam-${tab.icon}` }),
          span({ class: 'py-3 text-sm font-bold leading-5' }, tab.name),
          span({ class: 'view-icon' }),
        ),
      );
      navItem.querySelector('a .view-icon').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="flex-shrink-0 w-5 h-5 font-bold group-hover:text-white text-gray-400">
          <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd"></path>
        </svg>
      `;
      decorateIcons(navItem);
      navItem.querySelector('.icon').classList.add('group-hover:brightness-50');
      return navItem;
    }),
  );
}

export default async function decorate(block) {
  const main = block.closest('main');
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

    const navList = createTabList(tabs, currentTab);

    const navElement = nav(
      div({ class: 'flex justify-center' }, navList),
    );

    block.innerHTML = '';
    block.append(navElement);
    document.querySelector('.page-tabs-container').classList.add(...'hidden mb-4 -mt-16 md:block !p-0'.split(' '));
    document.querySelector('.product-hero-container').classList.add(...'!pb-32'.split(' '));
  }

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

  return block;
}
