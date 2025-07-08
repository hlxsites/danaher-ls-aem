import {
  a,
  div,
  li,
  option,
  select,
  span,
  ul,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getProductResponse } from '../../scripts/commerce.js';
import productCta from './product-additional-cta.js';
import topSellingProducts from './top-selling-product.js';
import relatedProducts from './related-products.js';

const extractIconName = (path) => path.split('/').pop().split('.')[0];

export function scrollPageTabFixed1(pageTabsContainer) {
  const tabList = document.getElementById('tabList');
  if (!tabList) return;
  let pageTabsOriginalOffset = 0;
  if (!pageTabsOriginalOffset) {
    const rectPageTabs = pageTabsContainer.getBoundingClientRect();
    pageTabsOriginalOffset = rectPageTabs.top;
  }

  if (window.scrollY < pageTabsOriginalOffset) {
    tabList.classList.add(
      ...'sticky ml-[auto] mr-[auto] inset-x-0 top-[83px] z-50 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden'.split(' '),
    );
    tabList.classList.remove(
      ...'sticky ml-[auto] mr-[auto] top-[87px] z-50 inset-x-0 bg-white [&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-full [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:justify-center'.split(' '),
    );
  } else {
    tabList.classList.remove(
      ...'sticky ml-[auto] mr-[auto] inset-x-0 top-[83px] z-50 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden'.split(' '),
    );
    tabList.classList.add(
      ...'sticky top-[87px] ml-[auto] mr-[auto] z-50 bg-white inset-x-0 [&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-full [&_ul>li>a]:flex-row [&_ul>li>a]:items-start [&_ul>li>a]:justify-center'.split(' '),
    );
  }
}

function openTab(target, main) {
  if (!target) return;
  const currentTab = target.getAttribute('href')?.replace('#', '') || main.querySelector('.section.page-tab').getAttribute('aria-labelledby');
  console.log('openTab: currentTab=', currentTab);

  const sections = main.querySelectorAll('.section.page-tab');
  const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));
  if (!tabSections.length) return;

  sections.forEach((section) => {
    section.style.paddingTop = '0px';
    if (currentTab === section.getAttribute('aria-labelledby')) {
      section.setAttribute('aria-hidden', 'false');
      section.classList.remove('hidden');
      section.style.display = 'block';
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      section.setAttribute('aria-hidden', 'true');
      section.classList.add('hidden');
      section.style.display = 'none';
    }
  });

  const tabLinks = document.querySelectorAll('.page-tabs-container li > a');
  tabLinks.forEach(link => {
    link.style.backgroundColor = '';
    link.style.background = '';
  });

  const tabList = document.querySelectorAll('.listTab');
  tabList.forEach((list) => {
    if (list.getAttribute('data-tabid') === currentTab) {
      list.classList.add(
        'text-violet-600',
        'text-base',
        'font-bold',
        'border-l',
        'border-violet-500',
        'border-gray-500',
      );
    } else {
      list.classList.remove(
        'text-violet-600',
        'text-base',
        'font-bold',
        'bg-gray-100',
        'border-l',
        'border-violet-500',
        'border-gray-500',
      );
    }
  });
}

export function createTabList(tabs, currentTab, isJumpMenu) {
  const ulTag = ul(
    { class: 'w-[190px] ml-[-4px] inline-flex flex-col', id: 'tabList', role: 'tablist' },
    ...tabs.map((tab) => {
      const ancHref = isJumpMenu ? tab.link : `#${tab.id}`;
      const navItem = li(
        {
          role: 'tab',
          'data-tabid': tab.id,
          id: tab.id,
          class: 'listTab px-6 py-4 cursor-pointer',
        },
        a(
          {
            class: 'cursor-pointer tab-no-hover-bg',
            href: ancHref,
            title: tab.name,
          },
          span({ class: 'text-base font-normal text-black' }, tab.name),
        ),
      );
      navItem.style.borderRight = '1px solid #d1d5db'; // border-gray-500
      return navItem;
    }),
  );
  decorateIcons(ulTag);
  return ulTag;
}

export function createDropdownList(tabs, currentTab, isJumpMenu) {
  const dropdownWrapper = div(
    { class: 'mobile-jump-menu' },
    select(
      {
        id: 'selectedTabId',
        class: 'selected-tab',
        'aria-label': 'selectedTabId',
      },
      ...tabs.map((tab) => {
        const value = isJumpMenu ? tab.link : tab.id;
        const isSelectedTab = tab.id === currentTab;
        const navItem = option({ value }, tab.name);
        if (isSelectedTab) navItem.setAttribute('selected', 'selected');
        return navItem;
      }),
    ),
  );
  return dropdownWrapper;
}

function hasProducts(productResponse) {
  return (
    productResponse?.raw?.objecttype === 'Family' &&
    productResponse?.raw?.numproducts > 0
  );
}

function hasParts(productResponse) {
  return (
    productResponse?.raw?.objecttype === 'Bundle' &&
    productResponse?.raw?.numproducts > 0
  );
}

function hasResources(productResponse) {
  return productResponse?.raw?.numresources > 0;
}

function hasSpecifications(productResponse) {
  return productResponse?.raw?.numattributes > 0;
}

function hasOverview(productResponse) {
  return productResponse?.raw?.richlongdescription;
}

export default async function decorate(block) {
  // Inject CSS to override hover background color
  const styleId = 'tab-hover-override';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .page-tabs-container li:hover > a,
      .page-tabs-container li:hover > a.tab-no-hover-bg,
      .page-tabs-container .listTab:hover > a {
        background-color: transparent !important;
        background: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  const response = await getProductResponse();
  let productResponse;
  if (response?.length > 0) {
    productResponse = response.at(0);
  }

  const main = block.closest('main');
  const pageTabsContainer = main.querySelector('.page-tabs-container');
  if (!pageTabsContainer) {
    console.error('page-tabs-container not found');
    return block;
  }
  pageTabsContainer.classList.add('border-r', 'border-gray-500', 'mt-0');
  const pageTabsWrapper = main.querySelector('.page-tabs-wrapper');
  if (pageTabsWrapper) {
    pageTabsWrapper.style.marginLeft = 'auto';
    pageTabsWrapper.style.paddingTop = '0';
  }

  const sections = main.querySelectorAll('.section.page-tab');
  const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));
  console.log('tab sections:', tabSections);

  const productTab = div({
    class: 'inline-flex justify-between dhls-container gap-5',
    id: 'tabs-container',
  });
  block.append(productTab);
  const tabsContainer = document.getElementById('tabs-container');

  const tabWrapper = div({
    class: 'w-[190px] inline-flex flex-col border-r border-gray-500',
    id: 'tabs-wrapper',
  });
  productTab.append(tabWrapper);
  const tabsWrapper1 = document.getElementById('tabs-wrapper');
  tabsContainer.append(tabsWrapper1);

  if (tabSections.length) {
    let currentTab;
    const hash = window.location.hash?.replace('#', '');
    const validTabs = tabSections.map(section => section.getAttribute('aria-labelledby'));
    console.log('validTabs:', validTabs, 'hash:', hash);

    if (hash && validTabs.includes(hash)) {
      currentTab = hash;
    } else if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        currentTab = element.closest('.page-tab')?.getAttribute('aria-labelledby') || tabSections[0].getAttribute('aria-labelledby');
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 5000);
      } else {
        currentTab = tabSections[0].getAttribute('aria-labelledby');
      }
    } else {
      currentTab = tabSections[0].getAttribute('aria-labelledby');
    }
    console.log('initial currentTab:', currentTab);

    const descriptionDiv = div({ class: 'w-[1070px]' });
    sections.forEach((section) => {
      section.style.paddingTop = '0px';
      descriptionDiv.append(section);
      if (currentTab === section.getAttribute('aria-labelledby')) {
        section.setAttribute('aria-hidden', 'false');
        section.classList.remove('hidden');
        section.style.display = 'block';
      } else {
        section.setAttribute('aria-hidden', 'true');
        section.classList.add('hidden');
        section.style.display = 'none';
      }
    });
    productTab.append(descriptionDiv);

    const relatedProductsDiv = div(
      {
        'data-section-status': 'initialized',
        'data-tabicon': '/content/dam/danaher/system/icons/Chart-bar.svg',
        'data-tabname': 'Related Products',
        'aria-labelledby': 'related-products',
        'aria-hidden': currentTab === 'related-products' ? 'false' : 'true',
      },
      div(
        {
          class: 'product-related-products-wrapper',
        },
        div(
          {
            class: 'product-related-products block',
            'data-block-name': 'product-specifications',
            'data-block-status': 'loaded',
          },
        ),
      ),
    );

    relatedProductsDiv.removeAttribute('class');
    relatedProductsDiv.removeAttribute('style');

    const productCategories = localStorage.getItem('product-categories');
    const parsedProductCategoryData = productCategories ? JSON.parse(productCategories) : { results: [] };
    const skus = parsedProductCategoryData.results.map((prod) => {
      const url = prod.Uri || '';
      const parts = url.split('://');
      const productCode = parts[1]?.replace(/\/$/, '') || '';
      return productCode;
    }).filter(Boolean);
    console.log('sku:', skus);

    const relatedProd = await relatedProducts('Related Products', skus);
    relatedProductsDiv.append(relatedProd);
    descriptionDiv.append(relatedProductsDiv);

    const tabs = tabSections.map((tabSection) => {
      const tabName = tabSection.dataset.tabname;
      const tabId = tabSection.getAttribute('aria-labelledby');
      const tabIconPath = tabSection.dataset.tabicon;
      const iconName = extractIconName(tabIconPath || '');
      return { name: tabName, id: tabId, icon: iconName };
    });

    const filteredTabs = tabs.filter((tab) => {
      switch (tab.id) {
        case 'specifications':
          return hasSpecifications(productResponse);
        case 'resources':
          return hasResources(productResponse);
        case 'products':
          return hasProducts(productResponse);
        case 'product-details':
          return hasParts(productResponse);
        case 'overview':
          return hasOverview(productResponse);
        default:
          return true;
      }
    });

    filteredTabs.push({ name: 'Related Products', id: 'related-products', icon: 'Chart-bar' });

    const navList = createTabList(filteredTabs, currentTab);
    navList.style.borderRight = '1px solid #d1d5db';

    // Apply active styles to currentTab
    const activeTabLi = navList.querySelector(`li[data-tabid="${currentTab}"]`);
    if (activeTabLi) {
      activeTabLi.classList.add(
        'text-violet-600',
        'text-base',
        'font-bold',
        'border-l',
        'text-danaherpurple-500',
        'border-danaherpurple-500',
        'border-gray-500',
      );
      console.log('Active tab set:', currentTab);
    } else {
      console.warn('No tab found for currentTab:', currentTab);
    }

    navList.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (target) {
        e.preventDefault();
        const href = target.getAttribute('href').replace('#', '');
        if (href) {
          window.location.hash = href;
          openTab(target, main);
        }
      }
    });

    const dropdownList = createDropdownList(filteredTabs, currentTab);
    const menuElement = document.querySelector('mobilemenu');
    if (menuElement) {
      menuElement.appendChild(dropdownList);
    }
    tabsWrapper1.append(navList);
  }

  window.addEventListener('hashchange', () => {
    const currentTab = window.location.hash?.replace('#', '') || tabSections[0]?.getAttribute('aria-labelledby');
    if (!currentTab) return;
    console.log('hashchange: currentTab=', currentTab);
    const targetTab = block.querySelector(`a[href="#${currentTab}"]`);
    if (targetTab) {
      openTab(targetTab, main);
    } else {
      console.warn('No tab found for hash:', currentTab);
    }
  });

  scrollPageTabFixed1(pageTabsContainer);
  window.addEventListener('scroll', () => {
    scrollPageTabFixed1(pageTabsContainer);
  });

  const sku = ['5062192-sciex', '10450271-leica', '13613384-leica', '00B-4462-A0-OE-phenomenex', 'ab18184-abcam', 'ab133053-abcam', '00A-4462-Y0-phenomenex', '11521252-leica', '00B-4723-E0-phenomenex', '5062192-sciex'];
  const sku1 = ['11526240-leica', '11521252-leica', '00G-4627-V0-AX-phenomenex', '5069160-sciex', '5077299-sciex', 'ab105134-abcam', 'ab172730-abcam', 'A66527-sciex', '10450043-leica', '12730524-leica'];
  const productCTA = productCta();
  const youMayAlsoNeed = await topSellingProducts('You may also need', sku);
  const frequentlyUsed = await topSellingProducts('Frequently Viewed/Purchased together', sku1);
  block.append(productCTA);
  block.append(youMayAlsoNeed);
  block.append(frequentlyUsed);
  return block;
}
