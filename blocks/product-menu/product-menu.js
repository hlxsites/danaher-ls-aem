import {
  div, li, ul,
} from '../../scripts/dom-builder.js';
import { processEmbedFragment } from '../../scripts/scripts.js';

const classActive = 'active';

function handleTabClick(e, idx) {
  e.preventDefault();
  const { target } = e;
  [...target.closest('.tabs-nav').children].forEach((nav) => nav.classList.remove(classActive));
  target.closest('.tabs-nav-item').classList.add(classActive);
  const panes = target.closest('.product-menu').querySelectorAll('.tab-pane');
  [...panes].forEach((pane) => pane.classList.remove(classActive));
  panes[idx].classList.add(classActive);
}

function buildNav(block) {
  const titles = block.querySelectorAll('.product-menu > div > div:first-child');
  const navList = ul({ class: 'tabs-nav flex flex-col gap-2' });
  [...titles].forEach((title, idx) => {
    title.classList.add(...'flex items-center space-x-3 p-3'.split(' '));
    const tabTitle = title.querySelector('p:last-child');
    tabTitle.classList.add(...'text-lg leading-6 font-semibold'.split(' '));
    title.querySelector('img').classList.add(...'w-20 h-20 lg:flex-shrink-0 object-contain object-center border-2 border-white rounded-md shadow-md'.split(' '));
    const listItem = li(
      {
        class: 'tabs-nav-item cursor-pointer hover:bg-danaherlightblue-50 rounded-md transform duration-300 hover:scale-95 shadow-md',
        onclick: (e) => { handleTabClick(e, idx); },
        'aria-label': tabTitle.textContent,
      },
      title,
    );
    navList.append(listItem);
  });
  navList.querySelector('li').classList.add(classActive);
  const navBlock = div({ class: 'w-full md:w-1/3' }, navList);
  return navBlock;
}

async function buildTabs(block) {
  const tabPanes = block.querySelectorAll('.product-menu > div > div:last-child');
  const tabList = div({ class: 'tabs-list' });
  const decoratedPanes = await Promise.all([...tabPanes].map(async (pane) => {
    pane.classList.add('tab-pane', 'hidden');
    const decoratedPane = await processEmbedFragment(pane);
    return decoratedPane;
  }));
  decoratedPanes.forEach((pane) => { tabList.append(pane); });
  tabList.querySelector('.tab-pane')?.classList.add(classActive);
  return tabList;
}

export default async function decorate(block) {
  const nav = buildNav(block);
  const tabs = await buildTabs(block);
  block.innerHTML = '';

  block.append(nav);
  block.append(tabs);

  block.classList.add(...'flex flex-col w-full md:flex-row gap-10 justify-between self-center py-4'.split(' '));
  return block;
}
