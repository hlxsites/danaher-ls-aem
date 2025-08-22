import { div, p } from '../../scripts/dom-builder.js';

// Global tracking for scroll behavior
let lastScrollY = window.scrollY;
let isManualScroll = false;

// This will be set dynamically inside decorate()
let dynamicTabMap = {};

async function designPdp() {
  const main = document.querySelector('main');

  const allSections = Array.from(main.querySelectorAll('.section'));
  const meaningfulSections = allSections.filter((section) => Array.from(section.classList).some((cls) => cls.startsWith('pdp-')));

  const heroSection = meaningfulSections.find((sec) => sec.classList.contains('pdp-hero-container'));

  const flexWrapper = div({
    class: 'tabs-super-parent flex flex-col md:flex-row md:justify-center lg:max-w-screen-xl mx-auto pt-12',
  });

  const tabsWrapper = div({
    class: 'tabs-left-parent sticky top-16 md:top-32 h-fit z-10',
  });

  const restWrapper = div({
    class: 'tabs-right-parent border-l border-gray-200 flex-1',
  });

  // Define tabbed content section classes
  const tabContentClasses = new Set([
    'pdp-page-tabs-container',
    'pdp-description-container',
    'pdp-specifications-container',
    'pdp-related-products-container',
    'pdp-bundle-list-container',
    'pdp-citations-container',
    'pdp-products-container',
    'pdp-resources-container',
    'pdp-faqs-container',
    // Add more as needed
  ]);

  const afterFlexSections = [];

  meaningfulSections.forEach((section) => {
    if (section === heroSection) return;

    const hasTabbedClass = Array.from(section.classList).some((cls) => tabContentClasses.has(cls));

    if (section.classList.contains('pdp-page-tabs-container')) {
      tabsWrapper.appendChild(section);
    } else if (hasTabbedClass) {
      restWrapper.appendChild(section);
    } else {
      afterFlexSections.push(section);
    }
  });

  flexWrapper.appendChild(tabsWrapper);
  flexWrapper.appendChild(restWrapper);

  // Insert flex wrapper after hero section
  heroSection?.after(flexWrapper);

  // Insert other sections (e.g., pdp-faqs, pdp-carousel) after flexWrapper
  afterFlexSections.forEach((section) => {
    flexWrapper.after(section);
  });
}

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

  // Pick authored tab blocks (e.g., tab-item-description, tab-item-specifications)
  const authoredBlocks = document.querySelectorAll('.tab-authored');

  if (authoredBlocks.length > 0) {
    authoredBlocks.forEach((authoredBlock) => {
      const titleEl = authoredBlock.querySelector('.authored-tab-title');
      if (titleEl) {
        const label = titleEl.textContent.trim();
        if (label) {
          tabsList.push({
            label,
            selector: `${authoredBlock.querySelector('.authored-tab-type').textContent}-tab`, // use block’s class as selector
          });
        }
        // Remove title <p> so it won’t show in content area
        titleEl.remove();
      }
    });

    // Build dynamic tab map {label: selector}
    dynamicTabMap = Object.fromEntries(
      tabsList.map((t) => [t.label, t.selector]),
    );
  } else {
    // Decide tabs based on available data
    if (response?.raw?.richlongdescription?.trim()) tabsList.push('Description');
    if (response?.raw?.attributejson?.trim()) tabsList.push('Specifications');
    if (response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0) tabsList.push('Products');
    if (response?.raw?.numresources) tabsList.push('Resources');
    if (response?.raw?.bundlepreviewjson?.trim()) tabsList.push('Product Parts List');
    tabsList.push('Citations');
    tabsList.push('FAQs');
    tabsList.push('Related Products');

    // Full map of label to section ID
    const fullTabMap = {
      Description: 'overview-tab',
      Specifications: 'specifications-tab',
      'Product Parts List': 'parts-tab',
      Products: 'products-tab',
      Resources: 'resources-tab',
      Citations: 'citations-tab',
      FAQs: 'faqs-tab',
      'Related Products': 'related-products-tab',
    };

    // Dynamically build tab map based on actual tabs available
    dynamicTabMap = Object.fromEntries(
      tabsList.map((label) => [label, fullTabMap[label]]),
    );
  }

  // Build UI
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
          `${authoredBlocks.length > 0 ? tab.label : tab}`,
        ),
      ),
    );
  });

  const pageTabsSuperParent = div(
    { class: 'super-parent md:w-48 overflow-x-auto' },
    tabsDiv,
  );

  // block.replaceChildren();
  block.append(pageTabsSuperParent);

  window.addEventListener('scroll', () => {
    highlightActiveTab();
  });
  // designPdp();
}
