import { div, a, strong } from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { makePublicUrl } from '../../scripts/scripts.js';
import { fetchTopicsForCategory } from '../topic-list/topic-list.js';

function renderSideNav(sideNavItems) {
  const sideNavElements = div({ class: 'flex flex-col items-start' });
  sideNavItems.forEach((sideNavItem) => {
    sideNavElements.append(div(
      {
        class: 'w-full side-nav-item',
      },
      div(
        {
          class: 'flex gap-3',
        },
        a({
          class: 'px-6 py-2 text-base',
          href: makePublicUrl(sideNavItem.path),
        }, sideNavItem.title),
      ),
    ));
  });
  return sideNavElements;
}

export default async function decorate(block) {
  let sideNavItems = [];
  let sideNavTitle = 'Side Navigation';
  let selectedNavItem = null;
  let sideNavElements = div();
  if (block.classList.contains('topic-content')) {
    const category = getMetadata('fullcategory');
    sideNavItems = await fetchTopicsForCategory(category);
    const categoryObj = await ffetch('/us/en/products-index.json')
      .filter(({ path }) => path === `/us/en/products/${category}`)
      .first();
    sideNavTitle = categoryObj?.title || category || sideNavTitle;
    sideNavElements = renderSideNav(sideNavItems);
    selectedNavItem = sideNavElements.querySelector(`.side-nav-item:has(a[href="${window.location.pathname}"])`);
  }

  if (selectedNavItem) selectedNavItem.classList.add('font-bold', 'bg-danaherpurple-50', 'rounded-md');
  block.append(div({ class: 'text-lg px-5 py-4' }, strong(sideNavTitle)), sideNavElements);
  block.classList.add('pt-6', 'pr-2');
  return block;
}
