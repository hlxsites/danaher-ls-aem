import { div, p } from '../../scripts/dom-builder.js';
import tabsOrder from '../../scripts/tabs-order.js';

// Global tracking for scroll behavior
let lastScrollY = window.scrollY;
let isManualScroll = false;

// This will be set dynamically inside decorate()
let dynamicTabMap = {};

function highlightActiveTab(forcedLabel = null) {
  if (isManualScroll && !forcedLabel) return;

  const offset = 100;
  const { scrollY } = window;
  const goingDown = scrollY > lastScrollY;
  lastScrollY = scrollY;

  const allTabs = document.querySelectorAll('.p-tab');

  const tabEntries = Object.entries(dynamicTabMap)
    .map(([label, selector]) => {
      const section = document.querySelector(`#${selector}`);
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

  if (!activeLabel && tabEntries.length > 0) {
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

    // Keep first tab active when above first section
    if (!matched && scrollY < tabEntries[0].top) {
      activeLabel = tabEntries[0].label;
      matched = true;
    }

    // No active tab when below the last section
    if (!matched) {
      activeLabel = null;
    }
  }

  // Update tab styles
  allTabs.forEach((tab, index) => {
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

    // Only scroll into view if:
    // 1. Mobile view
    // 2. Active tab is NOT the first tab when above the section
    if (
      isActive
      && window.innerWidth < 768
      && !(index === 0 && scrollY < tabEntries[0].top)
    ) {
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
  const targetId = dynamicTabMap[label];
  const targetEl = document.querySelector(`#${targetId}`);

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
  block.parentElement.parentElement.style.padding = '0px';

  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  const tabsList = [];
  const authoredBlocks = document.querySelectorAll('.tab-authored');

  // Collect authored labels indexed by type
  const authoredTabMap = {};
  authoredBlocks.forEach((authoredBlock) => {
    const type = authoredBlock.querySelector('.authored-tab-type')?.textContent?.trim();
    const titleEl = authoredBlock.querySelector('.authored-tab-title');
    const authoredLabel = titleEl?.textContent.trim();
    if (type && authoredLabel) {
      authoredTabMap[type] = authoredLabel;
      // titleEl.remove(); // Don't show inside section
    }
  });

  // Full map of static label to section ID/type
  const fullTabConfig = {
    overview: { label: 'Description', available: !!response?.raw?.richlongdescription?.trim() },
    specifications: { label: 'Specifications', available: !!response?.raw?.attributejson?.trim() },
    products: { label: 'Products', available: response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0 },
    resources: { label: 'Resources', available: !!response?.raw?.numresources },
    parts: { label: 'Product Parts List', available: !!response?.raw?.bundlepreviewjson?.trim() },
    citations: { label: 'Citations', available: true },
  };

  // Build tabsList → pick authored label if present, static fallback otherwise
  // Object.entries(fullTabConfig).forEach(([type, cfg]) => {
  //   if (cfg.available) {
  //     const label = authoredTabMap[type] || cfg.label;
  //     tabsList.push({ label, selector: `${type}-tab` });
  //   }
  // });

  // -------------- Generate tabsList in JSON order --------------
  const opco = response?.raw?.opco?.toLowerCase() || 'sciex';
  const opcoTabs = tabsOrder()[opco] || tabsOrder().sciex;
  opcoTabs.forEach(({ tabName }) => {
    const config = fullTabConfig[tabName];
    if (config?.available) {
      const label = authoredTabMap[tabName] || config.label || tabName;
      tabsList.push({ label, selector: `${tabName}-tab` });
    }
  });

  // Build dynamic map for scrolling logic
  dynamicTabMap = Object.fromEntries(tabsList.map((t) => [t.label, t.selector]));

  // ---------------- UI build ----------------
  const tabsDiv = div({
    class:
      'tabs-parent flex flex-row md:flex-col overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  });

  tabsList.forEach((tab, index) => {
    tabsDiv.append(
      div(
        {
          class:
            'shrink-0 px-6 py-4 md:relative flex flex-col-reverse md:flex-row justify-start items-center gap-3',
        },
        div({
          class: `${
            index === 0 ? 'bg-danaherpurple-500 rounded-[5px]' : ''
          } w-12 h-1 md:w-1 md:h-12 md:left-0 md:top-[2px] md:absolute`,
        }),
        p(
          {
            class: `p-tab ${
              index === 0
                ? 'text-danaherpurple-500 font-bold'
                : 'text-black font-medium'
            } text-base cursor-pointer`,
            onclick: updatePageTabs,
          },
          tab.label,
        ),
      ),
    );
  });

  const pageTabsSuperParent = div(
    { class: 'super-parent md:w-48 overflow-x-auto' },
    tabsDiv,
  );
  block.append(pageTabsSuperParent);

  // Activate scroll-based highlight
  window.addEventListener('scroll', () => highlightActiveTab());
}
