import {
  div, li, ul, a, span,
} from '../../scripts/dom-builder.js';
import { processEmbedFragment, getFragmentFromFile } from '../../scripts/scripts.js';
import { buildItemListSchema } from '../../scripts/schema.js';

const classActive = 'active';
const danaherPurpleClass = 'bg-danaherpurple-500';
const danaherPurple50Class = 'bg-danaherpurple-50';

function toggleClass(element, className, shouldAdd) {
  element.classList.toggle(className, shouldAdd);
}

function updateTabsNav(tabsNav, idx) {
  [...tabsNav.children].forEach((nav, i) => {
    const isClicked = i === idx;
    toggleClass(nav, classActive, isClicked);
    toggleClass(nav.querySelector('a'), danaherPurpleClass, isClicked);
  });
}

function updateTabItems(items, idx) {
  [...items].forEach((item, i) => {
    const isCurrentPane = i === idx;
    toggleClass(item, classActive, isCurrentPane);
    toggleClass(item.querySelector('a'), danaherPurpleClass, isCurrentPane);
    toggleClass(item.querySelector('a'), danaherPurple50Class, !isCurrentPane);
  });
}

function updatePanes(panes, idx) {
  [...panes].forEach((pane, i) => {
    const isCurrentPane = i === idx;
    toggleClass(pane, classActive, isCurrentPane);
    toggleClass(pane, 'off-screen', !isCurrentPane);
  });
}

function handleTabClick(e, idx) {
  e.preventDefault();
  const { target } = e;
  const tabsNav = target.closest('.tabs-nav');
  const items = target.closest('.tabs-nav').querySelectorAll('.tabs-nav-item');
  const panes = target.closest('.workflow-tabs').querySelectorAll('.tab-pane');

  updateTabsNav(tabsNav, idx);
  updateTabItems(items, idx);
  updatePanes(panes, idx);
}

function buildNav(block) {
  const titles = block.querySelectorAll('.workflow-tabs > div > div:first-child');
  const navList = ul({ class: 'tabs-nav flex justify-start flex flex-wrap gap-x-2 !ml-0' });

  [...titles].forEach((title, idx) => {
    const listItem = li(
      {
        class: 'tabs-nav-item h-max inline-flex items-center justify-center cursor-pointer overflow-hidden capitalize group !mt-0',
        onclick: (e) => handleTabClick(e, idx),
        'aria-label': title.textContent,
      },
      a(
        { class: `${idx === 0 ? `${danaherPurpleClass} text-white` : `${danaherPurple50Class} text-danaherpurple-800`} px-4 py-1 flex flex-col items-center justify-center w-full h-full hover:${danaherPurpleClass} hover:text-danaherpurple-800 border border-solid border-gray-300 rounded-full shadow-md` },
        span({ class: 'text-xs font-medium leading-5' }, title.textContent),
      ),
    );
    navList.append(listItem);
  });
  navList.querySelector('li')?.classList.add(classActive);
  return div({ class: 'w-full md:w-2/5' }, navList);
}

async function buildTabs(block) {
  const tabPanes = block.querySelectorAll('.workflow-tabs > div > div:last-child');
  const tabList = div({ class: 'tabs-list' });
  const decoratedPanes = await Promise.all([...tabPanes].map(async (pane, index) => {
    // Added for SEO Schema generation
    if (pane.textContent?.includes('workflow-carousels/master')) {
      const fragment = await getFragmentFromFile(`${pane.textContent}.plain.html`);
      const wfCarousel = document.createElement('div');
      wfCarousel.innerHTML = fragment;
      const childs = wfCarousel.querySelector('div.workflow-carousel').children;
      buildItemListSchema([...childs].splice(1, childs.length), 'workflow');
    }
    // End of SEO Schema generation

    const isActive = index === 0;
    pane.classList.add('tab-pane', isActive ? classActive : 'off-screen');
    const decoratedPane = await processEmbedFragment(pane);
    decoratedPane.firstElementChild?.classList?.add('!py-0');
    return decoratedPane;
  }));
  decoratedPanes.forEach((pane) => tabList.append(pane));
  tabList.querySelector('.tab-pane')?.classList.add(classActive);
  return tabList;
}

export default async function decorate(block) {
  const nav = buildNav(block);
  const tabs = await buildTabs(block);

  block.innerHTML = '';
  block.append(nav, tabs);
  block.classList.add(...'flex flex-col w-full mx-auto max-w-7xl'.split(' '));

  return block;
}
