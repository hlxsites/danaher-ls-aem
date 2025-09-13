import { resourcePager, resourceResultList } from '../../scripts/coveo/controller/controllers.js';
import { resourceEngine } from '../../scripts/coveo/engine.js';
import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// Performance enhancement wrapper for resources
(function enhanceResourcesPerformance() {
  // Enhanced async version for resources
  window.pdpResourcesDecorateAsync = async function (block) {
    // Show loading state immediately
    block.innerHTML = '<div class="resources-loading">Loading resources...</div>';

    // Add performance CSS for resources
    if (!document.querySelector('#resources-perf-enhance')) {
      const style = document.createElement('style');
      style.id = 'resources-perf-enhance';
      style.textContent = `
        .pdp-resources{contain:layout style paint;transform:translateZ(0)}
        .resources-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));contain:layout}
        .resource-item{contain:layout style;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:transform 0.2s ease,box-shadow 0.2s ease;transform:translateZ(0)}
        .resource-item:hover{transform:translateY(-4px);box-shadow:0 4px 16px rgba(0,0,0,0.15)}
        .pdp-resources img{width:100%;height:200px;object-fit:cover;contain:layout;background:#f5f5f5;loading:lazy;decoding:async}
        .resource-content{padding:1.5rem;contain:layout}
        .resource-title{font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;contain:layout}
        .resource-description{color:#666;line-height:1.5;contain:layout}
        .resources-loading{min-height:300px;display:flex;align-items:center;justify-content:center;color:#666;font-size:1.1rem;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:resourcesShimmer 1.5s infinite;border-radius:4px}
        @keyframes resourcesShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @media (max-width:767px){.resources-grid{grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem}.pdp-resources img{height:150px}}
      `;
      document.head.appendChild(style);
    }

    const startTime = performance.now();

    try {
      // Process resources asynchronously
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          const resources = [...block.querySelectorAll(':scope > *:not(.resources-loading)')];

          if (resources.length === 0) {
            block.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No resources available</div>';
            resolve();
            return;
          }

          const resourcesGrid = document.createElement('div');
          resourcesGrid.className = 'resources-grid';

          // Process resources in batches for better performance
          const batchSize = 4;
          const fragment = document.createDocumentFragment();

          for (let i = 0; i < resources.length; i += batchSize) {
            const batch = resources.slice(i, i + batchSize);

            batch.forEach((resource, batchIndex) => {
              const resourceItem = document.createElement('div');
              resourceItem.className = 'resource-item';

              // Optimize images in resources
              const img = resource.querySelector('img');
              if (img) {
                const absoluteIndex = i + batchIndex;
                img.loading = absoluteIndex < 4 ? 'eager' : 'lazy';
                img.decoding = 'async';
                img.style.aspectRatio = '16/9';
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.objectFit = 'cover';

                if (absoluteIndex < 4) {
                  img.fetchPriority = 'high';
                }
              }

              // Create structured content
              const content = document.createElement('div');
              content.className = 'resource-content';

              // Move content efficiently
              while (resource.firstChild) {
                content.appendChild(resource.firstChild);
              }

              resourceItem.appendChild(content);
              fragment.appendChild(resourceItem);
            });
          }

          resourcesGrid.appendChild(fragment);

          // Smooth transition
          block.style.transition = 'opacity 0.4s ease';
          block.style.opacity = '0';
          block.innerHTML = '';
          block.appendChild(resourcesGrid);

          requestAnimationFrame(() => {
            block.style.opacity = '1';
          });

          resolve();
        });
      });

      console.log(`Enhanced Resources: ${(performance.now() - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('Resources enhancement error:', error);
      block.innerHTML = '<div style="padding:2rem;text-align:center;color:#e74c3c;">Resources unavailable</div>';
    }
  };
}());

export default async function decorate(block) {
  block.id = 'resources-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.replaceChildren();
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));

  let selectedContentType = 'All'; // Track the currently selected content type
  let selectedSortType = 'Newest'; // Track the currently selected sort type

  resourceResultList.subscribe(() => {
    window.nextResults = () => {
      if (resourcePager.state.hasNextPage) {
        resourcePager.nextPage();
      }
    };

    const response = resourceResultList.state.results || [];

    block.replaceChildren();

    const itemsPerPage = 6;
    let resCountElement;
    let paginationContainer;

    const pdpResourceWrapperBlockContainer = div({
      class: 'pdpResourceWrapperBlock flex flex-col gap-y-[14px]',
    });

    const getContentTypes = () => {
      const contentTypes = response.map((item) => item?.raw?.contenttype
      || item.raw?.documenttype).filter(Boolean);
      return [...new Set(contentTypes)]; // Remove duplicates
    };

    const getFilteredResponse = () => {
      let filteredData = response;

      if (selectedContentType !== 'All') {
        filteredData = filteredData.filter(
          (item) => (item.raw?.contenttype || item.raw?.documenttype) === selectedContentType,
        );
      }

      if (selectedSortType === 'Newest') {
        filteredData = [...filteredData].sort((a, b) => {
          const dateA = new Date(a.raw?.date || 0);
          const dateB = new Date(b.raw?.date || 0);
          return dateB - dateA; // Newest first
        });
      } else if (selectedSortType === 'Oldest') {
        filteredData = [...filteredData].sort((a, b) => {
          const dateA = new Date(a.raw?.date || 0);
          const dateB = new Date(b.raw?.date || 0);
          return dateA - dateB; // Oldest first
        });
      }

      return filteredData;
    };

    const updateResourceCount = () => {
      resCountElement.textContent = `${resourceEngine?.state?.search?.response?.totalCount} Resources`;
    };

    const renderPagination = () => {
      const totalCountForPagination = resourceEngine?.state?.search?.response?.totalCount;
      const totalPages = Math.ceil(totalCountForPagination / itemsPerPage);
      const { currentPage } = resourcePager.state;

      paginationContainer.innerHTML = '';

      if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
      }

      paginationContainer.style.display = 'flex';

      const localPaginationContainer = div({
        class: 'self-stretch h-9 relative w-full mt-6',
      });

      const grayLine = div({
        class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0',
      });

      const contentWrapper = div({
        class: 'w-full left-0 top-0 absolute flex justify-between items-center px-4',
      });

      const prevEnabled = currentPage > 1;
      const prevButton = div({
        class: 'inline-flex flex-col justify-start items-start',
      });

      prevButton.append(
        div({ class: 'self-stretch h-0.5 bg-transparent' }),
        div(
          {
            class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${prevEnabled ? 'pointer' : 'not-allowed'} z-10`,
          },
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'} [&_svg>use]:stroke-current`,
            }),
          ),
          div(
            {
              class: `justify-start ${prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'} text-sm font-medium leading-5`,
            },
            'Previous',
          ),
        ),
      );

      prevButton.addEventListener('click', () => {
        if (resourcePager.state.hasPreviousPage) {
          resourcePager.previousPage();
        }
      });

      const pageNumbersContainer = div({
        class: 'flex justify-center items-start gap-2 z-10',
      });

      const createPageNumber = (page) => {
        const pageNumber = div({
          class: 'inline-flex flex-col justify-start items-start',
        });

        pageNumber.append(
          div({ class: `self-stretch h-0.5 ${currentPage === page ? 'bg-danaherpurple-500' : 'bg-transparent'}` }),
          div(
            { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer' },
            div(
              {
                class: `text-center justify-start text-${currentPage === page ? 'danaherpurple-500' : 'gray-700'} text-sm font-medium leading-tight`,
              },
              page.toString(),
            ),
          ),
        );

        pageNumber.addEventListener('click', () => {
          resourcePager.selectPage(page);
        });

        return pageNumber;
      };

      for (let i = 1; i <= totalPages; i += 1) {
        pageNumbersContainer.append(createPageNumber(i));
      }

      const nextEnabled = currentPage < totalPages;
      const nextButton = div({
        class: 'inline-flex flex-col justify-start items-start',
      });

      nextButton.append(
        div({ class: 'self-stretch h-0.5 bg-transparent' }),
        div(
          {
            class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${nextEnabled ? 'pointer' : 'not-allowed'} z-10`,
          },
          div({ class: `justify-start text-sm font-medium leading-5 ${nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'}` }, 'Next'),
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'} [&_svg>use]:stroke-current`,
            }),
          ),
        ),
      );

      nextButton.addEventListener('click', () => {
        if (resourcePager.state.hasNextPage) {
          resourcePager.nextPage();
        }
      });

      contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
      localPaginationContainer.append(grayLine, contentWrapper);
      paginationContainer.append(localPaginationContainer);
      decorateIcons(paginationContainer);
    };

    const renderResourceCards = () => {
      const filteredData = getFilteredResponse();

      const existingCards = pdpResourceWrapperBlockContainer.querySelectorAll('.self-stretch.p-4.bg-white');
      existingCards.forEach((card) => card.remove());

      const resourceCards = filteredData.map((item, index) => {
        const card = div(
          {
            class:
              'self-stretch p-4 bg-white border border-1 border-offset-[-1px] border-gray-300 inline-flex flex-col justify-start items-start gap-2',
            style: index < filteredData.length - 1 ? 'margin-bottom: 14px;' : '',
          },
          div(
            {
              class: 'self-stretch inline-flex justify-start items-center gap-2',
            },
            div(
              {
                class: 'px-4 py-1 bg-danaherpurple-50 flex justify-center items-center gap-2.5',
              },
              div(
                {
                  class: 'text-center justify-start text-danaherpurple-500 text-sm font-medium leading-5',
                  style: 'font-size:14px',
                },
                item?.raw?.filetype ? item?.raw?.filetype : '',
              ),
            ),
          ),
          div(
            {
              class: 'self-stretch flex flex-col justify-start items-start gap-2',
            },
            div(
              {
                class: 'flex-1 justify-start text-black text-lg font-medium leading-6',
              },
              item?.title || '',
            ),
          ),
          div(
            {
              class: 'self-stretch justify-start text-black text-base font-extralight leading-snug',
            },
            item?.raw?.description || '',
          ),
          div(
            {
              class: 'self-stretch pt-2 inline-flex justify-start items-start gap-2',
            },
            div(
              { class: 'w-4 h-4 relative' },
              span({
                class: 'icon icon-lock [&_svg>use]:stroke-danaherpurple-500',
              }),
            ),
            div(
              {
                class: 'justify-start text-danaherpurple-500 font-semibold text-base leading-snug',
              },
              div(
                {
                  class: 'cursor-pointer',
                  onclick: () => {
                    window.location.href = item.clickUri;
                  },
                },
                item?.raw?.filetype === 'pdf'
                  ? div(
                    {
                      class: 'flex items-center',
                    },
                    'View Document',
                    span({
                      class:
                        'icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
                    }),
                  )
                  : 'Read Article',
              ),
            ),
          ),
        );
        return card;
      });

      resourceCards.forEach((card) => pdpResourceWrapperBlockContainer.append(card));
      decorateIcons(pdpResourceWrapperBlockContainer);

      renderPagination();
    };

    const createContentTypeDropdown = () => {
      const contentTypes = getContentTypes();
      const dropdownItems = [];

      if (contentTypes.length > 0) {
        dropdownItems.push(
          div(
            {
              class: 'flex items-center cursor-pointer',
              onclick: (e) => {
                e.stopPropagation();
                selectedContentType = 'All';
                resourcePager.selectPage(1);

                const allItems = e.currentTarget.parentElement.querySelectorAll('.content-type-item');
                allItems.forEach((item) => {
                  item.classList.remove('text-danaherpurple-500');
                  item.classList.add('text-blac');
                });
                e.currentTarget.querySelector('.content-type-item').classList.remove('text-black');
                e.currentTarget.querySelector('.content-type-item').classList.add('text-danaherpurple-500');

                const contentTypeButton = document.querySelector('.content-type-text');
                if (contentTypeButton) {
                  contentTypeButton.textContent = 'All';
                }

                renderResourceCards();
                updateResourceCount();

                const dropdown = e.currentTarget.closest('.content-type-dropdown');
                if (dropdown) {
                  dropdown.classList.add('hidden');
                }
              },
            },
            div(
              {
                class: `text-${selectedContentType === 'All' ? 'danaherpurple-500' : 'gray-700'} text-[14px] font-medium leading-5 cursor-pointer content-type-item`,
                style: 'padding-left: 10px',
              },
              'All',
            ),
          ),
        );
      }

      dropdownItems.push(
        ...contentTypes.map((type) => div(
          {
            class: 'flex items-center cursor-pointer',
            onclick: (e) => {
              e.stopPropagation();
              selectedContentType = type;
              resourcePager.selectPage(1);

              const allItems = e.currentTarget.parentElement.querySelectorAll('.content-type-item');
              allItems.forEach((item) => {
                item.classList.remove('text-danaherpurple-500');
                item.classList.add('text-black');
              });
              e.currentTarget.querySelector('.content-type-item').classList.remove('text-black');
              e.currentTarget.querySelector('.content-type-item').classList.add('text-danaherpurple-500');

              const contentTypeButton = document.querySelector('.content-type-text');
              if (contentTypeButton) {
                contentTypeButton.textContent = type;
              }

              renderResourceCards();
              updateResourceCount();

              const dropdown = e.currentTarget.closest('.content-type-dropdown');
              if (dropdown) {
                dropdown.classList.add('hidden');
              }
            },
          },
          div(
            {
              class: `text-${selectedContentType === type ? 'danaherpurple-500' : 'gray-700'} text-[14px] font-medium leading-5 cursor-pointer content-type-item`,
              style: 'padding-left: 10px',
            },
            type,
          ),
        )),
      );

      const dropdown = div(
        {
          class:
            'absolute min-w-[225px] p-3 bg-white border border-gray-300 shadow-lg flex flex-col gap-y-[14px] hidden content-type-dropdown',
          style: 'margin-top: 150px; margin-left: -17px; min-width: 225px; z-index: 10;',
        },
        ...dropdownItems,
      );
      decorateIcons(dropdown);
      return dropdown;
    };

    const createDateDropdown = () => {
      const sortOptions = [
        { value: 'Newest', label: 'Newest (First)' },
        { value: 'Oldest', label: 'Oldest (First)' },
      ];

      const dropdownItems = sortOptions.map((option) => div(
        {
          class: 'flex items-center cursor-pointer',
          onclick: (e) => {
            e.stopPropagation();
            selectedSortType = option.value;
            resourcePager.selectPage(1);

            const allItems = e.currentTarget.parentElement.querySelectorAll('.sort-type-item');
            allItems.forEach((item) => {
              item.classList.remove('text-danaherpurple-500');
              item.classList.add('text-black');
            });
            e.currentTarget.querySelector('.sort-type-item').classList.remove('text-black');
            e.currentTarget.querySelector('.sort-type-item').classList.add('text-danaherpurple-500');

            const sortButton = document.querySelector('.sorting-button-text');
            if (sortButton) {
              sortButton.textContent = option.value;
            }

            renderResourceCards();
            updateResourceCount();

            const dropdown = e.currentTarget.closest('.sorting-dropdown');
            if (dropdown) {
              dropdown.classList.add('hidden');
            }
          },
        },
        div(
          {
            class: `text-${option.value === selectedSortType ? 'danaherpurple-500' : 'gray-700'} text-[14px] font-medium leading-5 cursor-pointer sort-type-item`,
            style: 'padding-left: 10px',
          },
          option.label,
        ),
      ));

      const dropdown = div(
        {
          class:
            'absolute min-w-[135px] p-3 bg-white border border-[0.5px] border-gray-300 shadow-lg flex flex-col gap-y-[14px] hidden sorting-dropdown',
          style: 'margin-top: 170px; margin-left: -43px; min-width: 135px; z-index: 10;',
        },
        ...dropdownItems,
      );
      decorateIcons(dropdown);
      return dropdown;
    };

    const head = div({ class: 'block-pdp-resources text-2xl leading-8 font-medium' }, 'Resources');

    const infoBox = div(
      {
        class: 'flex justify-between items-center w-full',
      },
      div(
        {
          class:
            'bg-gray-100 border border-[0.5px] border-gray-300 inline-flex justify-start items-center gap-1.5 relative overflow-visible',
          style: 'width: max-content; min-height: 2rem;',
          onclick: (e) => {
            e.stopPropagation();
            const dropdown = e.currentTarget.querySelector('.absolute');
            dropdown.classList.toggle('hidden');
          },
        },
        div(
          {
            class: 'inline-flex items-center gap-1.5 px-4 py-1.5',
          },
          div(
            {
              class: 'text-gray-500 text-[14px] font-medium leading-5 content-type-text cursor-pointer',
              style: 'padding-right:8px; font-size:14px;',
              onclick: (e) => {
                e.stopPropagation();
                const dropdown = e.currentTarget.parentElement.parentElement.querySelector('.absolute');
                dropdown.classList.toggle('hidden');
              },
            },
            selectedContentType === 'All' ? 'All' : selectedContentType,
          ),
          span({
            class: 'icon icon-chevron-down w-4 h-4 [&_svg>use]:stroke-danaherblack-500',
          }),
          createContentTypeDropdown(),
        ),
      ),
      div(
        { class: 'flex items-center gap-4' },
        div(
          {
            class: 'text-[14px] font-medium leading-5',
            style: 'font-size:14px',
          },
          'Sorting',
        ),
        div(
          {
            class:
              '!px-3 !py-1.5 bg-gray-100 border border-[0.5px] border-gray-300 inline-flex justify-start items-center gap-1.5 relative sorting-text min-width-[110px]',
            style: 'min-width: 110px;',
            onclick: (e) => {
              e.stopPropagation();
              const dropdown = e.currentTarget.querySelector('.absolute');
              dropdown.classList.toggle('hidden');
            },
          },
          div(
            {
              class: 'text-gray-500 text-[14px] font-medium leading-5 sorting-button-text cursor-pointer',
              style: 'font-size:14px;padding-right:8px;',
            },
            selectedSortType,
          ),
          span({
            class: 'icon icon-chevron-down w-4 h-4 [&_svg>use]:stroke-danaherblack-500',
          }),
          createDateDropdown(),
        ),
      ),
    );

    document.addEventListener('click', (e) => {
      const contentTypeDropdown = block.querySelector('.content-type-dropdown');
      const sortingDropdown = block.querySelector('.sorting-dropdown');

      if (!e.target.closest('.content-type-text') && !e.target.closest('.content-type-dropdown')) {
        contentTypeDropdown?.classList.add('hidden');
      }

      if (!e.target.closest('.sorting-text') && !e.target.closest('.sorting-dropdown')) {
        sortingDropdown?.classList.add('hidden');
      }
    });

    resCountElement = div(
      { class: 'text-base leading-snug font-semibold' },
      `${resourceEngine?.state?.search?.response?.totalCount} Resources`,
    );

    paginationContainer = div({
      class: 'pagination-container w-full',
    });

    pdpResourceWrapperBlockContainer.append(head, infoBox, resCountElement);

    renderResourceCards();

    block.append(pdpResourceWrapperBlockContainer, paginationContainer);
    decorateIcons(pdpResourceWrapperBlockContainer);
  });

  resourceEngine.executeFirstSearch();
}
