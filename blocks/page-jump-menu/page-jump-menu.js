import { createDropdownList, createTabList } from '../page-tabs/page-tabs.js';
import { scrollJumpMenuFixed } from '../../scripts/scripts.js';

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
