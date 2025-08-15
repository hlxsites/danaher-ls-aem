import {
  div, button, input, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  submitSearchQuery,
} from '../header/header.js';
import relatedProducts from './related-products.js';
import { noProducts } from './noProduct.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
// import { buildSearchWithIcon } from "../../scripts/common-utils.js";

export const addProducts = async () => {
  // const productContainer = div(
  //   {
  //     class: "",
  //   },
  //   div(
  //     {
  //       class:
  //         "w-[683px] mt-12 justify-start text-black text-3xl font-normal  leading-10",
  //     },
  //     "Want to add more products?"
  //   ),
  //   div(
  //     {
  //       class:
  //         "self-stretch justify-start text-black text-base font-extralight",
  //     },
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vestibulum semper mollis. Integer pharetra dui sed urna cursus, eu pretium tortor sodales. "
  //   ),
  //   div({
  //     class: "w-24 h-10 left-[63px] top-[57px]  bg-white",
  //   }),
  //   div(
  //     {
  //       class:
  //         "w-80 justify-start text-gray-700 text-base font-bold  leading-snug",
  //     },
  //     "Search for a product"
  //   ),
  //   div({
  //     class: "w-10 h-4 left-[63px] top-[57px]  bg-white",
  //   }),
  //   div(
  //     {
  //       class: "inline-flex gap-2 bg-white",
  //     },
  //     div(
  //       {
  //         class:
  //           "w-[75px] h-10 px-6 border-solid border-2 rounded-md inline-flex justify-between items-center",
  //       },
  //       div(
  //         {
  //           class: "",
  //         },
  //         "🔍"
  //       ),
  //       div({
  //         class: "flex-1 justify-start text-gray-500 font-extralight text-base ",

  //       }, "Search by name or SKU ID")
  //     ),
  //     button(
  //       {
  //         class: "h-10 btn btn-lg font-medium btn-primary-purple rounded-full m-0",
  //       },
  //       "Get started"
  //     )
  //   ),

  //   div({
  //     class: "w-24 h-10 left-[63px] top-[57px]  bg-white",
  //   })
  // );
  let skuarray = [];
  const buildSearchWithIcon = (
    lable,
    field,
    inputType,
    inputName,
    autoCmplte,
    required,
    dtName,
    placeholder,
  ) => {
    const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
    const searchElement = div(
      {
        class: 'space-y-2 field-wrapper relative',
        id: 'searchWithIcon',
      },
      div(
        {
          class: 'search-with-icon inline-flex justify-between relative pt-[5px] pb-[3px] ',
        },
        span({
          class: ' icon icon-search fill-gray-400 absolute mt-2 ml-2',
        }),
        input({
          type: inputType,
          name: inputName,
          id: inputName,
          placeholder,
          'data-required': required,
          class:
            'searchbox lg:min-w-[415px] w-[300px] h-10 rounded-md pl-9 text-base w-full block px-8 py-5 text-gray-600 font-extralight border border-solid border-gray-300 ',
          'aria-label': dtName,
        }),
        div({
          class: 'absolute mr-[8px] right-0',
        }, span({
          class: 'hidden searchbox-clear icon icon-close fill-gray-400 ',
        })),

      ),
      // span({
      //   id: "msg",
      //   "data-name": dtName,
      //   class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
      // })
    );
    decorateIcons(searchElement);

    searchElement.addEventListener('input', handleSearchInput);
    return searchElement;
  };

  async function handleSearchInput(e) {
    const clearIcon = document.querySelector('span.searchbox-clear');
    const inputValue = document.getElementById('searchInput');
    if (inputValue.value) {
      clearIcon.classList.add('cursor-pointer');
      clearIcon.classList.remove('hidden');
    } else {
      clearIcon.classList.add('hidden');
    }
    clearIcon.addEventListener('click', () => {
      inputValue.value = '';
      clearIcon.classList.add('hidden');
    });
  }

  const productSearchcontainer = div({
    class: 'w-full',
    id: 'productSearchcontainer',
  });
  const searchBlock = div(
    {
      class: 'md:w-full py-12 px-0 lg:flex-row flex-col inline-flex justify-start gap-5',
    },
    div(
      {
        class: 'md:w-[640px]  w-[280px] inline-flex flex-col justify-start items-start gap-4',
      },
      div(
        {
          class: 'justify-start text-black text-3xl font-bold',
        },
        'Want to add more products?',
      ),
      div(
        {
          class: 'self-stretch justify-start text-black text-base font-extralight',
        },
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vestibulum semper mollis. Integer pharetra dui sed urna cursus, eu pretium tortor sodales. ',
      ),
    ),
    div(
      {
        class: 'lg:w-[600px] inline-flex flex-col justify-start items-start',
      },
      div(
        {
          class: 'inline-flex flex-col justify-end items-start gap-4',
        },
        div(
          {
            class:
              'w-80 h[25px] justify-start text-gray-700 text-base font-bold',
          },
          'Search for a product',
        ),
        div(
          {
            class: 'inline-flex lg:flex-row flex-col justify-center items-right lg:items-center  gap-4',
          },
          //  span({
          //     class: ' icon icon-search absolute mt-2 ml-2',
          // }),
          // input({
          //   type: "text",
          //   placeholder: "Search by name and SKU ID",
          //   class:
          //     "w-[350px] h-[35px] bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 px-6 py-3 text-lg",
          //   id: "searchInput",
          // }),
          buildSearchWithIcon(
            '',
            '',
            'text',
            'searchInput',
            false,
            true,
            'cart-search',
            'Search by name and SKU ID',
          ),
          div(
            {
              class: '',
            },
            button(
              {
                class: 'w-[200px] btn btn-lg btn-primary-purple m-0  rounded-full',
              },
              'Search',
            ),
          ),
        ),
      ),
    ),
  );

  const onClickCoveoResponse = async () => {
    showPreLoader();
    const inputValue = document.getElementById('searchInput').value;
    const searchValue = {
      value: inputValue,
    };
    const searchResponse = await submitSearchQuery(
      searchValue,
      'searchboxSubmit',
      'cartlanding',
    );
    skuarray = [];
    const skuids = searchResponse.results?.map((item) => {
      skuarray.push(item.raw.sku);
    });
    if (skuarray.length > 0) {
      const productSearched = await relatedProducts(
        `${searchResponse.totalCount} Products Available`,
        skuarray,
      );
      const re = document.getElementById('productSearchcontainer');

      if (re) {
        re.append(productSearched);
        const div = document.querySelectorAll('.top-selling-rendered'); // Select the first element with class 'my-div'
        if (div.length > 1) {
          div[0].remove();
        }
        const noProductFoundDiv = document.querySelector('.no-product-found');
        if (noProductFoundDiv) noProductFoundDiv.remove();
        removePreLoader();
      }
    } else {
      const re = document.getElementById('productSearchcontainer');
      re.append(noProducts(inputValue));
      const div = document.querySelectorAll('.top-selling-rendered'); // Select the first element with class 'my-div'
      if (div.length === 1) div[0].remove();
      removePreLoader();
    }
  };
  searchBlock?.querySelector('button')?.addEventListener('click', async () => {
    onClickCoveoResponse();
  });
  decorateIcons(searchBlock);
  productSearchcontainer.append(searchBlock);

  return productSearchcontainer;
};
