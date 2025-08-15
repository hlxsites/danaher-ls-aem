import { div, a, strong } from '../../scripts/dom-builder.js';
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
      div(
        {
          class:
            'w-full side-nav-item hover:bg-danaherpurple-25 border-b border-gray-300',
        },
        div(
          {
            class: 'flex gap-3',
          },
          a(
            {
              class: 'py-4 pr-2 pl-2.5 text-base',
              href: makePublicUrl(sideNavItem.path),
            },
            sideNavItem.title,
          ),
        ),
      ),
    );
  });
  return sideNavElements;
}

export default async function decorate(block) {
  const elToClean = document.querySelector('.bg-danaherlightblue-50.side-nav-container');
  if (elToClean) {
    elToClean.classList.remove('bg-danaherlightblue-50');
  }
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
    const solutionPath = requestedUrl
      .slice(0, requestedUrl.length - 1 || 6)
      ?.join('/');
    const solutionObj = await ffetch('/us/en/solutions-index.json')
      .filter(({ path }) => path === solutionPath)
      .first();
    sideNavTitle = solutionObj?.title;
    sideNavItems = await ffetch('/us/en/solutions-index.json')
      .filter(({ path }) => {
        const pathParts = path?.split('/');
        const solutionParts = solutionPath?.split('/');

        if (!pathParts || !solutionParts) return false;

        const expectedLength = solutionParts.length + 1;

        if (solutionPath.includes('/process-steps')) {
          return (
            pathParts.length === expectedLength
            && path.includes(`${solutionPath}/`)
          );
        }

        return (
          !path.includes('/process-steps')
          && pathParts.length === expectedLength
          && path.includes(`${solutionPath}/`)
        );
      })
      .all();
    // Sort by pageorder (ascending)
    sideNavItems.sort((x, y) => {
      const orderA = x.pageorder || Number.MAX_SAFE_INTEGER;
      const orderB = y.pageorder || Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }
  sideNavElements = renderSideNav(sideNavItems);
  selectedNavItem = sideNavElements
    .querySelector(`.side-nav-item a[href="${window.location.pathname}"]`)
    ?.closest('.side-nav-item');
  if (selectedNavItem) {
    selectedNavItem.classList.add(
      ...'font-bold bg-danaherpurple-50 hover:bg-danaherpurple-50'.split(' '),
    );
  }
  const navHeadingDiv = div(
    { class: 'text-xl font-normal' },
    strong(sideNavTitle),
  );
  if (blockParent?.classList.contains('default-content-wrapper')) {
    navHeadingDiv.classList.add('pt-0');
  }
  block.append(navHeadingDiv, sideNavElements);
  const blockSideNavContent = block?.parentElement?.parentElement?.nextElementSibling?.querySelector('.default-content-wrapper');
  block?.parentElement?.parentElement?.querySelector('.default-content-wrapper')?.append(blockSideNavContent);
  const currentSection = block?.closest('.section');
  const nextSection = currentSection?.nextElementSibling;
  if (!currentSection || !nextSection) return;
  const parentWrapper = currentSection.querySelector('.default-content-wrapper');
  const nestedWrapper = parentWrapper?.querySelector('.default-content-wrapper');

  if (!nestedWrapper) return;
  const productCardWrapper = nextSection.querySelector('.product-card-wrapper');
  if (nestedWrapper && productCardWrapper) {
    productCardWrapper.prepend(nestedWrapper);
  }
  block?.parentElement?.parentElement?.nextElementSibling?.classList.add(...'lg:col-span-8 lg:col-start-5 space-y-4 mb-2 flex-1 lg:pt-6 px-0 stretch'.split(' '));
}
