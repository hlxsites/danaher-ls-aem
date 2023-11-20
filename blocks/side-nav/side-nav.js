import { div, a, strong } from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { makePublicUrl } from '../../scripts/scripts.js';
import { fetchTopicsForCategory } from '../topic-list/topic-list.js';

async function fetchAllProductCategories() {
  const products = await ffetch('/us/en/products-index.json')
    .filter(({ type, path }) => type === 'Category' && path.endsWith('/topics'))
    .all();
  return products.sort((item1, item2) => item1.title.localeCompare(item2.title));
}

function renderSideNav(sideNavItems) {
  const sideNavElements = div({ class: 'flex flex-col items-start' });
  sideNavItems.forEach((sideNavItem) => {
    sideNavElements.append(div(
      {
        class: 'w-full side-nav-item hover:bg-danaherpurple-25 hover:rounded-md',
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
  if (block.classList.contains('topics')) {
    const category = getMetadata('fullcategory');
    sideNavItems = await fetchTopicsForCategory(category);
    const categoryObj = await ffetch('/us/en/products-index.json')
      .filter(({ path }) => path === `/us/en/products/${category}`)
      .first();
    sideNavTitle = categoryObj?.title || category || sideNavTitle;
  } else if (block.classList.contains('products')) {
    sideNavItems = await fetchAllProductCategories();
    sideNavTitle = 'Products';
  }
  sideNavElements = renderSideNav(sideNavItems);
  selectedNavItem = sideNavElements.querySelector(`.side-nav-item a[href="${window.location.pathname}"]`)?.closest('.side-nav-item');
  if (selectedNavItem) selectedNavItem.classList.add('font-bold', 'bg-danaherpurple-50', 'hover:bg-danaherpurple-50', 'rounded-md');
  block.append(div({ class: 'text-lg px-5 py-4' }, strong(sideNavTitle)), sideNavElements);
  block.classList.add('pt-6', 'pr-2');

  const main = document.querySelector('main');
  main.classList.add('grid', 'px-4', 'lg:px-0', 'max-w-7xl', 'mx-auto', 'lg:grid-cols-4');
  main.querySelector(':scope > div.side-nav-container').classList.add('lg:!col-span-1', 'lg:!col-start-1', 'row-span-6', 'hidden', 'lg:block');
  main.querySelectorAll(':scope > div').forEach((child) => child.classList.add('lg:col-span-3', 'lg:col-start-2', 'space-y-4', 'mb-2', 'flex-1', 'p-0', 'pl-0', 'lg:pl-6'));
  return block;
}
