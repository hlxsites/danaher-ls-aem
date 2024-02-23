import {
  div, nav,
} from '../../scripts/dom-builder.js';
import { createDropdownList, createTabList } from '../page-tabs/page-tabs.js';

export default async function decorate(block) {
  const main = block.closest('main');
  const pageJumpMenuContainer = block.closest('.page-jump-menu-container');
  const pageMenus = block.children;
  const currentTab = window.location.pathname.split('/').pop().replace('.html', '');

  const menus = [...pageMenus].map((element) => {
    const anc = element.querySelector('a');
    const url = new URL(anc.href);
    const tabId = url.pathname.split('/').pop().replace('.html', '');
    const tabName = element.querySelector('a').title;
    const tabLink = element.querySelector('a').href;
    const icon = element.querySelector('span').classList.value;
    return {
      name: tabName, id: tabId, link: tabLink, icon,
    };
  });

  const navList = createTabList(menus, currentTab, true);
  const navElement = nav(
    div({ class: 'flex justify-center' }, navList),
  );

  // For Mobile View
  const dropdownList = createDropdownList(menus, currentTab, true);
  main.prepend(dropdownList);

  block.innerHTML = '';
  block.append(navElement);
  pageJumpMenuContainer.classList.add(...'hidden mb-4 -mt-16 md:block !p-0'.split(' '));

  const selectEl = document.getElementById('selectedTabId');
  selectEl.addEventListener('change', (event) => {
    window.location.replace(event.target.value);
  });

  let originalOffset = 0;
  window.addEventListener('scroll', () => {
    if (!originalOffset) {
      const rectPageTabs = pageJumpMenuContainer.getBoundingClientRect();
      originalOffset = rectPageTabs.top;
    }
    if (window.scrollY > originalOffset) {
      pageJumpMenuContainer.classList.add('fixed', 'inset-x-0', 'top-[83px]', 'w-full', 'lg:!pb-4', 'z-20');
    } else {
      pageJumpMenuContainer.classList.remove('fixed', 'inset-x-0', 'top-[83px]', 'w-full', 'lg:!pb-4', 'z-20');
    }
  });

  block.classList.add(...'z-20 relative'.split(' '));
  return block;
}
