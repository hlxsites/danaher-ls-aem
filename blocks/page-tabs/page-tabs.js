import {
  div, span,
} from '../../scripts/dom-builder.js';
import { getProductResponse } from '../../scripts/commerce.js';

const extractIconName = (path) => path.split('/').pop().split('.')[0];

function hasProducts(productResponse) {
  return productResponse?.raw?.objecttype === 'Family' && productResponse?.raw?.numproducts > 0;
}

function hasParts(productResponse) {
  return productResponse?.raw?.objecttype === 'Bundle' && productResponse?.raw?.numproducts > 0;
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
  const response = await getProductResponse();
  let productResponse = response?.[0];

  const main = block.closest('main');
  const tabSections = [...main.querySelectorAll('.section.page-tab')].filter((section) =>
    section.hasAttribute('data-tabname'),
  );

  if (!tabSections.length) return;

  let currentTab = window.location.hash?.replace('#', '') || tabSections[0].getAttribute('aria-labelledby');

  const tabs = tabSections.map((tabSection) => {
    const tabName = tabSection.dataset.tabname;
    const tabId = tabSection.getAttribute('aria-labelledby');
    const tabIconPath = tabSection.dataset.tabicon;
    const iconName = extractIconName(tabIconPath);
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

  if (!filteredTabs.find((tab) => tab.id === currentTab)) {
    currentTab = filteredTabs[0]?.id;
    window.location.hash = `#${currentTab}`;
  }

  // Render sidebar vertical tab list
  const sidebarWrapper = div(
    { class: 'w-48 bg-yellow' },
    div(
      { class: 'w-48 border-r border-gray-200 flex flex-col justify-start items-start gap-1' },
      ...filteredTabs.map((tab) => {
        const isActive = tab.id === currentTab;
        return div(
          {
            class: `self-stretch px-6 py-4 relative inline-flex justify-start items-center gap-3 cursor-pointer ${isActive ? 'text-violet-600 font-bold' : 'text-black font-normal'}`,
            style: '',
            'data-tab-id': tab.id,
          },
          div(
            {
              class: `${isActive ? 'w-1 h-12 left-0 top-[2px] absolute bg-violet-600 rounded-[5px]' : ''}`,
            },
          ),
          div({ class: 'text-base leading-snug' }, tab.name),
        );
      }),
    ),
  );

  block.innerHTML = '';
  block.appendChild(sidebarWrapper);

  // Activate section on click
  block.querySelectorAll('[data-tab-id]').forEach((tabEl) => {
    tabEl.addEventListener('click', () => {
      const targetId = tabEl.getAttribute('data-tab-id');
      if (!targetId) return;
      window.location.hash = `#${targetId}`;
    });
  });

  // Show the current section
  tabSections.forEach((section) => {
    if (section.getAttribute('aria-labelledby') === currentTab) {
      section.setAttribute('aria-hidden', false);
      section.classList.remove('hidden');
    } else {
      section.setAttribute('aria-hidden', true);
      section.classList.add('hidden');
    }
  });

  // Re-render on hash change
  window.addEventListener('hashchange', () => {
    const newTabId = window.location.hash?.replace('#', '') || filteredTabs[0]?.id;
    const allTabEls = block.querySelectorAll('[data-tab-id]');
    allTabEls.forEach((el) => {
      const isActive = el.getAttribute('data-tab-id') === newTabId;
      el.classList.toggle('text-violet-600', isActive);
      el.classList.toggle('font-bold', isActive);
      el.classList.toggle('text-black', !isActive);
      el.classList.toggle('font-normal', !isActive);
      const indicator = el.querySelector('div');
      if (indicator) {
        indicator.className = isActive
          ? 'w-1 h-12 left-0 top-[2px] absolute bg-violet-600 rounded-[5px]'
          : '';
      }
    });

    tabSections.forEach((section) => {
      if (section.getAttribute('aria-labelledby') === newTabId) {
        section.setAttribute('aria-hidden', false);
        section.classList.remove('hidden');
      } else {
        section.setAttribute('aria-hidden', true);
        section.classList.add('hidden');
      }
    });
  });
}
