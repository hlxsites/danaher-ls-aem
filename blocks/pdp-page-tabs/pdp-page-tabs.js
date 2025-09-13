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

// Performance enhancement wrapper for tabs - advanced optimization
(function enhanceTabsPerformance() {
  // Enhanced async version with better tab handling
  window.pdpTabsDecorateAsync = async function (block) {
    // Show enhanced loading state immediately
    block.innerHTML = '<div class="tabs-loading-enhanced">Loading tabs...</div>';

    // Add enhanced performance CSS
    if (!document.querySelector('#tabs-perf-enhance')) {
      const style = document.createElement('style');
      style.id = 'tabs-perf-enhance';
      style.textContent = `
        .pdp-page-tabs{contain:layout style paint;transform:translateZ(0);will-change:auto}
        .tab-nav{display:flex;border-bottom:2px solid #e5e7eb;contain:layout;background:#fff;position:sticky;top:0;z-index:10;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
        .tab-button{flex:1;padding:12px 16px;border:none;background:none;cursor:pointer;font-weight:500;color:#6b7280;transition:all 0.2s ease;border-bottom:2px solid transparent;contain:layout;backface-visibility:hidden}
        .tab-button.active{color:#3b82f6;border-bottom-color:#3b82f6;background:#f8faff}
        .tab-button:hover:not(.active){color:#374151;background:#f9fafb;transform:translateY(-1px)}
        .tab-content{display:none;padding:1.5rem 0;contain:layout style;content-visibility:auto;contain-intrinsic-size:0 300px}
        .tab-content.active{display:block;content-visibility:visible}
        .tab-content img{loading:lazy;decoding:async;max-width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:4px}
        .tabs-loading-enhanced{min-height:250px;display:flex;align-items:center;justify-content:center;color:#666;font-size:1.1rem;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:tabsShimmer 1.5s infinite;border-radius:4px}
        @keyframes tabsShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @media (max-width:767px){.tab-button{padding:10px 12px;font-size:14px}.tab-content{padding:1rem 0}}
      `;
      document.head.appendChild(style);
    }

    const startTime = performance.now();

    try {
      // Process tabs asynchronously with enhanced performance
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          const tabItems = [...block.querySelectorAll(':scope > *:not(.tabs-loading-enhanced)')];

          if (tabItems.length === 0) {
            block.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No tab content available</div>';
            resolve();
            return;
          }

          // Create optimized tab structure
          const tabNav = document.createElement('div');
          tabNav.className = 'tab-nav';

          const tabContents = document.createElement('div');
          tabContents.className = 'tab-contents';

          // Process tabs with enhanced optimization
         // const fragment = document.createDocumentFragment();

          tabItems.forEach((item, index) => {
            // Create enhanced tab button
            const tabButton = document.createElement('button');
            tabButton.className = `tab-button ${index === 0 ? 'active' : ''}`;
            tabButton.textContent = item.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || `Tab ${index + 1}`;
            tabButton.setAttribute('data-tab', index);
            tabButton.setAttribute('aria-controls', `tab-content-${index}`);
            tabButton.setAttribute('role', 'tab');

            // Create enhanced tab content
            const tabContent = document.createElement('div');
            tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
            tabContent.id = `tab-content-${index}`;
            tabContent.setAttribute('role', 'tabpanel');

            // Enhanced image optimization
            const images = item.querySelectorAll('img');
            images.forEach((img) => {
              img.loading = index === 0 ? 'eager' : 'lazy';
              img.decoding = 'async';
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.aspectRatio = '16/9';
              img.style.objectFit = 'cover';
              img.style.borderRadius = '4px';

              if (index === 0) {
                img.fetchPriority = 'high';
              }
            });

            // Optimize content elements
            const textElements = item.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, ul, ol');
            textElements.forEach((el) => {
              if (el.textContent.trim().length > 30) {
                el.style.contain = 'layout';
              }
            });

            // Move content efficiently
            while (item.firstChild) {
              tabContent.appendChild(item.firstChild);
            }

            tabNav.appendChild(tabButton);
            tabContents.appendChild(tabContent);
          });

          // Enhanced event delegation with performance optimization
          let isTabSwitching = false;
          tabNav.addEventListener('click', (e) => {
            const button = e.target.closest('.tab-button');
            if (!button || isTabSwitching) return;

            isTabSwitching = true;
            const targetIndex = parseInt(button.dataset.tab);

            // Performance: Batch DOM updates with animation
            requestAnimationFrame(() => {
              tabNav.querySelectorAll('.tab-button').forEach((btn, idx) => {
                btn.classList.toggle('active', idx === targetIndex);
                btn.setAttribute('aria-selected', idx === targetIndex);
              });

              tabContents.querySelectorAll('.tab-content').forEach((content, idx) => {
                const isActive = idx === targetIndex;
                content.classList.toggle('active', isActive);
                content.style.display = isActive ? 'block' : 'none';
                content.style.contentVisibility = isActive ? 'visible' : 'auto';

                // Optimize images in newly active tab
                if (isActive) {
                  const tabImages = content.querySelectorAll('img[loading="lazy"]');
                  tabImages.forEach((img) => {
                    img.loading = 'eager';
                  });
                }
              });

              setTimeout(() => { isTabSwitching = false; }, 200);
            });
          }, { passive: true });

          // Smooth container creation
          const container = document.createElement('div');
          container.appendChild(tabNav);
          container.appendChild(tabContents);

          // Enhanced transition effect
          block.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          block.style.transform = 'translateY(20px)';
          block.style.opacity = '0';
          block.innerHTML = '';
          block.appendChild(container);

          requestAnimationFrame(() => {
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
          });

          resolve();
        });
      });

      console.log(`Enhanced Tabs: ${(performance.now() - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('Tabs enhancement error:', error);
      block.innerHTML = '<div style="padding:2rem;text-align:center;color:#e74c3c;">Tabs unavailable</div>';
    }
  };
}());

export default async function decorate(block) {
  block.classList.add('bg-white');
  block.parentElement.parentElement.style.padding = '0px';

  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  const tabsList = [];
  const authoredBlocks = document.querySelectorAll('.tab-authored');

  // Collect authored labels indexed by type
  const authoredTabMap = {};
  authoredBlocks.forEach((authoredBlock) => {
    const type = authoredBlock?.querySelector('.authored-tab-type')?.textContent?.trim();
    const titleEl = authoredBlock?.querySelector('.authored-tab-title');
    const authoredLabel = titleEl?.textContent.trim();
    if (type) {
      authoredTabMap[type] = authoredLabel;
    }
  });

  // Full map of static label to section ID/type
  const fullTabConfig = {
    overview: { label: 'Description', available: !!response?.raw?.richlongdescription?.trim() || authoredTabMap.overview?.length > 0 },
    specifications: { label: 'Specifications', available: !!response?.raw?.attributejson?.trim() || authoredTabMap.specifications?.length > 0 },
    products: { label: 'Products', available: response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0 },
    resources: { label: 'Resources', available: !!response?.raw?.numresources },
    parts: { label: 'Product Parts List', available: !!response?.raw?.bundlepreviewjson?.trim() || authoredTabMap.parts?.length > 0 },
    // eslint-disable-next-line no-prototype-builtins
    citations: { label: 'Citations', available: !!response?.raw?.citations?.trim() || authoredTabMap.hasOwnProperty('citations') },
  };

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

  tabsList?.forEach((tab, index) => {
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
