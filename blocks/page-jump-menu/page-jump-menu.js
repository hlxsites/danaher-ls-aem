import { createDropdownList, createTabList } from '../page-tabs/page-tabs.js';

let originalOffset = 0;

function scrollJumpMenuFixed(pageJumpMenuContainer) {
  if (!originalOffset) {
    const rectPageTabs = pageJumpMenuContainer.getBoundingClientRect();
    originalOffset = rectPageTabs.top;
  }
  if (window.scrollY > originalOffset) {
    pageJumpMenuContainer.classList.add(...'w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden'.split(' '));
    document.querySelector('.page-jump-menu-container.fixed ul')?.classList.add('shadow-none', 'rounded-none');
    document.querySelectorAll('.page-jump-menu-container.fixed ul li')?.forEach((el) => {
      el?.firstElementChild?.classList.add('rounded-full');
      el?.firstElementChild?.querySelector('span.icon svg use')?.classList.add('stroke-danaherpurple-500');
    });
    document.querySelector('.page-jump-menu-container.fixed li[aria-selected="true"] a span.icon svg')?.classList.add('stroke-white');
    pageJumpMenuContainer.classList.remove(...'[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center'.split(' '));
  } else {
    pageJumpMenuContainer.classList.remove(...'w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden'.split(' '));
    document.querySelectorAll('.page-jump-menu-container ul li')?.forEach((el) => el?.firstElementChild?.classList.remove('rounded-full'));
    pageJumpMenuContainer.classList.add(...'[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center'.split(' '));
  }
}

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

  pageJumpMenuContainer.classList.add(...'hidden md:block -mt-20 px-0 md:px-4 lg:px-0 [&_.page-jump-menu-wrapper]:flex [&_.page-jump-menu-wrapper]:mx-auto [&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center'.split(' '));
  document.querySelector('.page-jump-menu-container li[aria-selected="true"] a')?.classList.add('!text-white', '!bg-danaherpurple-500');
  const selectEl = document.getElementById('selectedTabId');
  selectEl.addEventListener('change', (event) => {
    window.location.replace(event.target.value);
  });

  scrollJumpMenuFixed(pageJumpMenuContainer);
  window.addEventListener('scroll', () => {
    scrollJumpMenuFixed(pageJumpMenuContainer);
  });

  block.classList.add(...'z-10 relative'.split(' '));
  return block;
}
