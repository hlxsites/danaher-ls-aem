import { resourceResultList } from '../../scripts/coveo/controller/controllers.js';
import { resourceEngine } from '../../scripts/coveo/engine.js';
import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.id = 'resources-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.replaceChildren();
  block.classList.add(
    ...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '),
  );

  resourceResultList.subscribe(() => {
    console.log(
      'Resource results updated:',
      resourceResultList?.state?.results,
    );
    console.table(resourceResultList.state.results, [
      'title',
      'clickUri',
      'raw.opco',
      'raw.documenttype',
    ]);

    const response = resourceResultList.state.results || [];

    block.replaceChildren();

    let selectedContentType = 'All'; 
    let selectedSortType = 'Newest'; 

    let currentPage = 1;
    const itemsPerPage = 6;
    let pdpResourceWrapperBlock;
    let resCountElement;
    let paginationContainer;

    const pdpResourceWrapperBlockContainer = div({
      class: 'pdpResourceWrapperBlock flex flex-col gap-y-[14px]', // Added 14px gap between records
    });

    // Function to get unique content types from response
    const getContentTypes = () => {
      const contentTypes = response
        .map((item) => item?.raw?.contenttype || item.raw?.documenttype)
        .filter(Boolean);
      return [...new Set(contentTypes)]; // Remove duplicates
    };

    const getFilteredResponse = () => {
      let filteredData = response;

      // Apply content type filter
      if (selectedContentType !== 'All') {
        filteredData = filteredData.filter(
          (item) => (item.raw?.contenttype || item.raw?.documenttype)
            === selectedContentType,
        );
      }

      // Apply date sorting
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

    // <CHANGE> Added pagination helper function
    const getPaginatedData = () => {
      const filteredData = getFilteredResponse();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredData.slice(startIndex, endIndex);
    };

    const updateResourceCount = () => {
      const filteredData = getFilteredResponse();
      resCountElement.textContent = `${filteredData.length} Resources`;
    };

    // <CHANGE> Added pagination rendering function
    const renderPagination = () => {
      const filteredData = getFilteredResponse();
      const totalPages = Math.ceil(resourceEngine?.state?.search?.response?.totalCount / itemsPerPage);
      
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

      // Previous Button
      const prevEnabled = currentPage > 1;
      const prevButton = div({
        class: 'inline-flex flex-col justify-start items-start',
      });
      
      prevButton.append(
        div({ class: 'self-stretch h-0.5 bg-transparent' }),
        div(
          {
            class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
              prevEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
          },
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${
                prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
              } [&_svg>use]:stroke-current`,
            }),
          ),
          div(
            {
              class: `justify-start text-${
                prevEnabled ? 'danaherpurple-500' : 'gray-400'
              } text-sm font-medium leading-5`,
            },
            'Previous',
          ),
        ),
      );
      
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          renderResourceCards();
          renderPagination();
        }
      });

      // Page Numbers
      const pageNumbersContainer = div({
        class: 'flex justify-center items-start gap-2 z-10',
      });

      const createPageNumber = (page) => {
        const pageNumber = div({
          class: 'inline-flex flex-col justify-start items-start',
        });
        
        pageNumber.append(
          div({
            class: `self-stretch h-0.5 ${
              currentPage === page ? 'bg-danaherpurple-500' : 'bg-transparent'
            }`,
          }),
          div(
            {
              class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer',
            },
            div(
              {
                class: `text-center justify-start text-${
                  currentPage === page ? 'danaherpurple-500' : 'gray-700'
                } text-sm font-medium leading-tight`,
              },
              page.toString(),
            ),
          ),
        );
        
        pageNumber.addEventListener('click', () => {
          currentPage = page;
          renderResourceCards();
          renderPagination();
        });
        
        return pageNumber;
      };

      for (let i = 1; i <= totalPages; i += 1) {
        pageNumbersContainer.append(createPageNumber(i));
      }

      // Next Button
      const nextEnabled = currentPage < totalPages;
      const nextButton = div({
        class: 'inline-flex flex-col justify-start items-start',
      });
      
      nextButton.append(
        div({ class: 'self-stretch h-0.5 bg-transparent' }),
        div(
          {
            class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
              nextEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
          },
          div(
            {
              class: `justify-start text-${
                nextEnabled ? 'danaherpurple-500' : 'gray-400'
              } text-sm font-medium leading-5`,
            },
            'Next',
          ),
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${
                nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
              } [&_svg>use]:stroke-current`,
            }),
          ),
        ),
      );
      
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage += 1;
          renderResourceCards();
          renderPagination();
        }
      });

      contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
      localPaginationContainer.append(grayLine, contentWrapper);
      paginationContainer.append(localPaginationContainer);
      decorateIcons(paginationContainer);
    };

    const renderResourceCards = () => {
      // <CHANGE> Use paginated data instead of all filtered data
      const paginatedData = getPaginatedData();

      // Remove existing cards
      const existingCards = pdpResourceWrapperBlockContainer.querySelectorAll(
        '.self-stretch.p-4.bg-white',
      );
      existingCards.forEach((card) => card.remove());

      // Create new cards based on paginated data
      const resourceCards = paginatedData.map((item, index) => {
        const card = div(
          {
            class:
              'self-stretch p-4 bg-white border border-1 border-offset-[-1px] border-gray-300 inline-flex flex-col justify-start items-start gap-2',
            style:
              index < paginatedData.length - 1 ? 'margin-bottom: 14px;' : '',
          },
          div(
            {
              class:
                'self-stretch inline-flex justify-start items-center gap-2',
            },
            div(
              {
                class:
                  'px-4 py-1 bg-danaherpurple-50 flex justify-center items-center gap-2.5',
              },
              div(
                {
                  class:
                    'text-center justify-start text-danaherpurple-500 text-sm font-medium leading-5',
                  style: 'font-size:14px',
                },
                item?.raw?.filetype ? item?.raw?.filetype : '',
              ),
            ),
          ),
          div(
            {
              class:
                'self-stretch flex flex-col justify-start items-start gap-2',
            },
            div(
              {
                class:
                  'flex-1 justify-start text-black text-lg font-medium leading-6',
              },
              item?.title || '',
            ),
          ),
          div(
            {
              class:
                'self-stretch justify-start text-black text-base font-extralight leading-snug',
            },
            item?.raw?.description || '',
          ),
          div(
            {
              class:
                'self-stretch pt-2 inline-flex justify-start items-start gap-2',
            },
            div(
              { class: 'w-4 h-4 relative' },
              span({
                class: 'icon icon-lock [&_svg>use]:stroke-danaherpurple-500',
              }),
            ),
            div(
              {
                class:
                  'justify-start text-danaherpurple-500 font-semibold text-base leading-snug',
              },
              div(
                {
                  class: 'cursor-pointer',
                  onclick: () => {
                    window.location.href = item.clickUri;
                  },
                },
                'View Document →',
              ),
            ),
          ),
        );
        return card;
      });

      // Append new cards
      resourceCards.forEach((card) => pdpResourceWrapperBlockContainer.append(card));
      decorateIcons(pdpResourceWrapperBlockContainer);
      
      // <CHANGE> Render pagination after cards
      renderPagination();
    };

    // Function to create and toggle dropdown
    const createContentTypeDropdown = () => {
      const contentTypes = getContentTypes();
      const dropdownItems = [];

      // Add "All" option if contentTypes.length > 0
      if (contentTypes.length > 0) {
        dropdownItems.push(
          div(
            {
              class: 'flex items-center cursor-pointer',
              onclick: (e) => {
                e.stopPropagation();
                selectedContentType = 'All';
                // <CHANGE> Reset to page 1 when filtering
                currentPage = 1;
                const icon = e.currentTarget.querySelector('.icon');
                const allIcons = e.currentTarget.parentElement.querySelectorAll('.icon');
                allIcons.forEach((i) => {
                  i.classList.remove('icon-radio-button');
                  i.classList.add('icon-radio-input-unchecked');
                });
                icon.classList.remove('icon-radio-input-unchecked');
                icon.classList.add('icon-radio-button');

                // <CHANGE> Update the content type button text
                const contentTypeButton = document.querySelector('.content-type-text');
                if (contentTypeButton) {
                  contentTypeButton.textContent = 'All';
                }

                renderResourceCards();
                updateResourceCount();

                const dropdown = e.currentTarget.parentElement;
                dropdown.classList.add('hidden');
              },
            },
            span({
              class:
                'icon icon-radio-button absolute w-4 h-4 cursor-pointer p-[2px]',
            }),
            div(
              {
                class:
                  'text-gray-700 text-[14px] font-medium leading-5 cursor-pointer',
                style: 'padding-left: 20px',
              },
              'All',
            ),
          ),
        );
      }

      // Add other content types
      dropdownItems.push(
        ...contentTypes.map((type) => div(
          {
            class: 'flex items-center cursor-pointer',
            onclick: (e) => {
              e.stopPropagation();
              selectedContentType = type;
              // <CHANGE> Reset to page 1 when filtering
              currentPage = 1;
              const icon = e.currentTarget.querySelector('.icon');
              const allIcons = e.currentTarget.parentElement.querySelectorAll('.icon');
              allIcons.forEach((i) => {
                i.classList.remove('icon-radio-button');
                i.classList.add('icon-radio-input-unchecked');
              });
              icon.classList.remove('icon-radio-input-unchecked');
              icon.classList.add('icon-radio-button');

              // <CHANGE> Update the content type button text
              const contentTypeButton = document.querySelector('.content-type-text');
              if (contentTypeButton) {
                contentTypeButton.textContent = type;
              }

              renderResourceCards();
              updateResourceCount();

              const dropdown = e.currentTarget.parentElement;
              dropdown.classList.add('hidden');
            },
          },
          span({
            class:
                'icon icon-radio-input-unchecked absolute w-4 h-4 cursor-pointer p-[2px]',
          }),
          div(
            {
              class:
                  'text-gray-700 text-[14px] font-medium leading-5 cursor-pointer',
              style: 'padding-left: 20px',
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
            // <CHANGE> Reset to page 1 when sorting
            currentPage = 1;
            const icon = e.currentTarget.querySelector('.icon');
            const allIcons = e.currentTarget.parentElement.querySelectorAll('.icon');
            allIcons.forEach((i) => {
              i.classList.remove('icon-radio-button');
              i.classList.add('icon-radio-input-unchecked');
            });
            icon.classList.remove('icon-radio-input-unchecked');
            icon.classList.add('icon-radio-button');

            // Update the dropdown button text
            const sortButton = document.querySelector('.sorting-button-text');
            if (sortButton) {
              sortButton.textContent = option.value;
            }

            renderResourceCards();
            updateResourceCount();

            const dropdown = e.currentTarget.parentElement;
            dropdown.classList.add('hidden');
          },
        },
        span({
          class:
              option.value === 'Newest'
                ? 'icon icon-radio-button absolute w-4 h-4 cursor-pointer p-[2px]'
                : 'icon icon-radio-input-unchecked absolute w-4 h-4 cursor-pointer p-[2px]',
        }),
        div(
          {
            class:
                'text-gray-700 text-[14px] font-medium leading-5 cursor-pointer',
            style: 'padding-left: 20px',
          },
          option.label,
        ),
      ));

      const dropdown = div(
        {
          class:
            'absolute min-w-[135px] p-3 bg-white border border-gray-300 shadow-lg flex flex-col gap-y-[14px] hidden sorting-dropdown',
          style:
            'margin-top: 170px; margin-left: -43px; min-width: 135px; z-index: 10;',
        },
        ...dropdownItems,
      );
      decorateIcons(dropdown);
      return dropdown;
    };

    // ... existing code ...

    const head = div(
      { class: 'block-pdp-resources text-2xl leading-8 font-medium' },
      'Resources',
    );

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
              class:
                'text-gray-500 text-[14px] font-medium leading-5 content-type-text cursor-pointer',
              style: 'padding-right:8px; font-size:14px;',
              onclick: (e) => {
                e.stopPropagation();
                const dropdown = e.currentTarget.parentElement.parentElement.querySelector(
                  '.absolute',
                );
                dropdown.classList.toggle('hidden');
              },
            },
            'Content Type',
          ),
          span({
            class:
              'icon icon-chevron-down w-4 h-4 [&_svg>use]:stroke-danaherblack-500',
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
              class:
                'text-gray-500 text-[14px] font-medium leading-5 sorting-button-text cursor-pointer',
              style: 'font-size:14px;padding-right:8px;',
            },
            'Newest',
          ),
          span({
            class:
              'icon icon-chevron-down w-4 h-4 [&_svg>use]:stroke-danaherblack-500',
          }),
          createDateDropdown(),
        ),
      ),
    );

    // Click listener to handle dropdowns
    document.addEventListener("click", (e) => {
      const contentTypeDropdown = block.querySelector(".content-type-dropdown");
      const sortingDropdown = block.querySelector(".sorting-dropdown");
      
      // Close content type dropdown if clicking outside of it
      if (!e.target.closest(".content-type-text") && !e.target.closest(".content-type-dropdown")) {
        contentTypeDropdown?.classList.add("hidden");
      }
      
      // Close sorting dropdown if clicking outside of it
      if (!e.target.closest(".sorting-text") && !e.target.closest(".sorting-dropdown")) {
        sortingDropdown?.classList.add("hidden");
      }
    });

    resCountElement = div(
      { class: 'text-base leading-snug font-semibold' },
      `${resourceEngine?.state?.search?.response?.totalCount} Resources`,
    );

    // <CHANGE> Added pagination container
    paginationContainer = div({
      class: 'pagination-container w-full',
    });

    pdpResourceWrapperBlockContainer.append(head, infoBox, resCountElement);

    renderResourceCards();

    // <CHANGE> Append pagination container after cards
    block.append(pdpResourceWrapperBlockContainer, paginationContainer);
    pdpResourceWrapperBlock = pdpResourceWrapperBlockContainer;

    decorateIcons(pdpResourceWrapperBlockContainer);
  });

  resourceEngine.executeFirstSearch();
}
