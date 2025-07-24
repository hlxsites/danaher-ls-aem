import { div, p } from '../../scripts/dom-builder.js';

// Highlight the tabs on selection and scroll to specific section
const tabMap = {
  Description: '#description-tab',
  Specifications: '#specifications-tab',
  'Product Part List': '#bundle-list-tab',
};

let lastScrollY = window.scrollY;
let isManualScroll = false;

function highlightActiveTab(forcedLabel = null) {
  if (isManualScroll && !forcedLabel) return;

  const offset = 100;
  const { scrollY } = window;
  const goingDown = scrollY > lastScrollY;
  lastScrollY = scrollY;

  const allTabs = document.querySelectorAll('.p-tab');

  const tabEntries = Object.entries(tabMap)
    .map(([label, selector]) => {
      const section = document.querySelector(selector);
      return section
        ? {
          label,
          top: section.offsetTop - offset,
          bottom: section.offsetTop + section.offsetHeight - offset,
        }
        : null;
    })
    .filter(Boolean);

  let activeLabel = forcedLabel;

  if (!activeLabel) {
    let matched = false;

    for (let i = 0; i < tabEntries.length; i += 1) {
      const { label, top, bottom } = tabEntries[i];

      if (scrollY >= top && scrollY < bottom) {
        activeLabel = label;
        matched = true;
        break;
      }

      const next = tabEntries[i + 1];
      if (!matched && next && scrollY >= bottom && scrollY < next.top) {
        activeLabel = goingDown ? next.label : label;
        matched = true;
        break;
      }
    }

    if (!matched && scrollY < tabEntries[0]?.top) {
      activeLabel = tabEntries[0]?.label;
    }

    if (!matched && scrollY >= tabEntries[tabEntries.length - 1]?.bottom) {
      activeLabel = tabEntries[tabEntries.length - 1]?.label;
    }
  }

  allTabs.forEach((tab) => {
    const label = tab.textContent.trim();
    const isActive = label === activeLabel;

    tab.classList.toggle('text-danaherpurple-500', isActive);
    tab.classList.toggle('font-bold', isActive);
    tab.classList.toggle('text-black', !isActive);
    tab.classList.toggle('font-medium', !isActive);

    const indicator = tab.previousElementSibling;
    if (indicator) {
      indicator.classList.toggle('bg-danaherpurple-500', isActive);
      indicator.classList.toggle('rounded-[5px]', isActive);
    }

    if (isActive && window.innerWidth < 768) {
      tab.parentElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  });
}

function updatePageTabs(event) {
  const label = event.target.textContent.trim();
  const targetId = tabMap[label];
  const targetEl = document.querySelector(targetId);

  if (targetEl) {
    const offset = 100;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

    isManualScroll = true;
    highlightActiveTab(label);

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isManualScroll = false;
    }, 600);
  }
}

export default async function decorate(block) {
  block.classList.add('bg-white');
  block.append(div({ class: 'block-pdp-page-tabs' }, 'Page Tabs'));
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  const tabsList = [];

  // Description
  if (response?.raw?.richlongdescription !== undefined && response?.raw?.richlongdescription?.trim() !== '') {
    tabsList.push('Description');
  }
  // Specification
  if (response?.raw?.attributejson !== undefined && response?.raw?.attributejson?.trim() !== '') {
    tabsList.push('Specifications');
  }
  // Bundle part list
  if (response?.raw?.bundlepreviewjson !== undefined && response?.raw?.bundlepreviewjson?.trim() !== '') {
    tabsList.push('Product Part List');
  }

  const tabsDiv = div({ class: 'tabs-parent flex flex-row md:flex-col overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' });
  tabsList.forEach((tab, index) => {
    tabsDiv.append(
      div(
        { class: 'shrink-0 px-6 py-4 md:relative flex flex-col-reverse md:flex-row justify-start items-center gap-3' },
        div({ class: `${index === 0 ? 'bg-danaherpurple-500 rounded-[5px]' : ''} w-12 h-1 md:w-1 md:h-12 md:left-0 md:top-[2px] md:absolute` }),
        p({
          class: `p-tab ${index === 0 ? 'text-danaherpurple-500 font-bold' : 'text-black font-medium'}  cursor-pointer`,
          onclick(event) {
            updatePageTabs(event);
          },
        }, tab),
      ),
    );
  });

  const pageTabsSuperParent = div(
    { class: 'super-parent md:w-48 overflow-x-auto' },
    tabsDiv,
  );
  block.replaceChildren();
  block.append(pageTabsSuperParent);
  window.addEventListener('scroll', () => {
    highlightActiveTab();
  });
}
