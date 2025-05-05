import {
  div, a, strong,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { makePublicUrl } from '../../scripts/scripts.js';
import { fetchTopicsForCategory } from '../topic-list/topic-list.js';

async function fetchAllProductCategories() {
  const topicHubs = await ffetch('/us/en/products-index.json')
    .filter(({ type }) => type === 'TopicHub')
    .all();
  return topicHubs.sort((item1, item2) => item1.title.localeCompare(item2.title));
}

function renderSideNav(sideNavItems) {
  const sideNavElements = div({ class: 'flex flex-col items-start pt-6' });
  sideNavItems.forEach((sideNavItem) => {
    sideNavElements.append(
      a(
        {
          class: 'w-full side-nav-item py-4 pr-2 pl-2.5 hover:bg-danaherpurple-25 border-b border-gray-300',
          href: makePublicUrl(sideNavItem.path),
        },
        div(
          {
            class: 'text-base',
          },
        ),
        sideNavItem.title,
      ),
    );
  });
  return sideNavElements;
}

export default async function decorate(block) {
  let sideNavItems = [];
  let sideNavTitle = 'Side Navigation';
  let selectedNavItem = null;
  let sideNavElements = div();
  const blockParent = block?.parentElement?.parentElement;
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
  } else if (block.classList.contains('process-steps')) {
    block.classList.add('hidden', 'lg:block');
    const requestedUrl = window.location.pathname.split('/');
    const solutionPath = requestedUrl.slice(0, 6)?.join('/');
    const solutionType = requestedUrl[5];
    const solutionObj = await ffetch('/us/en/solutions-index.json')
      .filter(({ path }) => path === solutionPath).first();
    sideNavTitle = solutionObj?.title;
    sideNavItems = await ffetch('/us/en/solutions-index.json')
      .filter(({ solution }) => solution === solutionType).all();

    // Sort by pageorder (ascending)
    sideNavItems.sort((x, y) => {
      const orderA = x.pageorder || Number.MAX_SAFE_INTEGER;
      const orderB = y.pageorder || Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }
  sideNavElements = renderSideNav(sideNavItems);
  selectedNavItem = sideNavElements.querySelector(`a[href="${window.location.pathname}"].side-nav-item`)?.closest('.side-nav-item');
  if (selectedNavItem) selectedNavItem.classList.add(...'font-bold bg-danaherpurple-50 hover:bg-danaherpurple-50'.split(' '));
  const navHeadingDiv = div({ class: 'text-xl font-normal' }, strong(sideNavTitle));
  if (blockParent?.classList.contains('default-content-wrapper')) {
    navHeadingDiv.classList.add('pt-0');
  }
  block.append(navHeadingDiv, sideNavElements);
  block?.parentElement?.parentElement?.nextElementSibling?.classList.add(...'lg:col-span-8 lg:col-start-5 space-y-4 mb-2 flex-1 lg:pt-6 px-0 stretch'.split(' '));
  return block;
}
