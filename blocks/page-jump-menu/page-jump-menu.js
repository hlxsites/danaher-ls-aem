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

  // For Mobile View
  const dropdownList = createDropdownList(menus, currentTab, true);
  const bannerEl = document.querySelector('.banner');
  if (bannerEl) bannerEl.before(dropdownList);
  else main.prepend(dropdownList);

  block.innerHTML = '';
  block.append(navList);

  pageJumpMenuContainer.classList.add(...'hidden md:block -mt-20 px-0 md:px-4 lg:px-0 [&_.page-jump-menu-wrapper]:flex [&_.page-jump-menu-wrapper]:mx-auto'.split(' '));

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
    // justify-center
    if (window.scrollY > originalOffset) {
      pageJumpMenuContainer.classList.add(...'w-full fixed inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden'.split(' '));
      pageJumpMenuContainer.classList.remove(...'[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul>li>a]:h-32 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center'.split(' '));
    } else {
      pageJumpMenuContainer.classList.remove(...'w-full fixed inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden'.split(' '));
      pageJumpMenuContainer.classList.add(...'[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul>li>a]:h-32 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center'.split(' '));
    }
  });

  block.classList.add(...'z-10 relative'.split(' '));
  return block;
}
