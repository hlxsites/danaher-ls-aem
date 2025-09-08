import {
  div, span, p,
} from './dom-builder.js';
import { getCommerceBase } from './commerce.js';
import { decorateIcons } from './lib-franklin.js';
import { getApiData } from './api-utils.js';

export const baseURL = getCommerceBase(); // base url for the intershop api calls

/*
 ::::::::::::::::::::::::
 Capitalize any string
 ::::::::::::::::::::::::::::::::::::
*/
export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*
 ::::::::::::::::::::
 Show preloader (animation)
 :::::::::::::::::
 */
export function showPreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  mainPreLoader?.classList.remove('hidden');
}

/*
 ::::::::::::::::::::
 creates a preloader (animation)
 :::::::::::::::::
 */
export function preLoader() {
  return div(
    {
      class:
        ' flex w-full relative top-1/2 left-[46%] justify-start items-center',
      id: 'preLoader',
    },
  );
}

/*
::::::::::::::::::::::
function to remove preloader whenever required
:::::::::::::::::::::::
*/
export function removePreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  setTimeout(() => {
    mainPreLoader?.classList.add('hidden');
  });
}
const generatePreloader = div(
  {
    class: 'hidden',
    id: 'mainPreLoader',
  },
  preLoader(),
);
const getMainDiv = document.querySelector('body');
getMainDiv.insertAdjacentElement('afterbegin', generatePreloader);
/*
 ::::::::::::::::::::::::
 utility function to close the modal...
 can be imported and used globally
 for the modal created using utlility createModal function
 ::::::::::::::::::::::::::::::::::::
*/
export function closeUtilityModal() {
  const utilityModal = document.querySelector('#utilityModal');
  if (utilityModal) {
    utilityModal.remove();
  }
}
/*
  create modal function... Creates a popup/modal with the input content
  @param: content : html content to load into the modal
  @param hasCancelButton : boolean. Optional cancel button
  @param hasCloseButton : boolean. Optional close button
*/
export function createModal(content, hasCancelButton, hasCloseButton) {
  const modalWrapper = div({
    class:
      'inset-0 fixed w-full  bg-black z-50 bg-opacity-50 flex items-center justify-center',
    id: 'utilityModal',
  });
  const modalContainer = div({
    class: 'relative max-w-xl w-full items-center bg-white p-8',
    id: 'utilityModalWrapper',
  });

  let modalBody = div({});
  if (content) {
    modalBody = div(
      {
        class: 'modal-body py-6 pb-6',
      },
      content,
    );
  }
  let cancelButton = '';
  if (hasCancelButton) {
    cancelButton = span(
      {
        class: 'mt-6 text-danaherpurple-500 cursor-pointer',
        id: 'closeUtilityModal',
      },
      'Cancel',
    );
    if (content && modalBody) {
      const getModalButtonWrapper = modalBody.querySelector('.button-wrapper');
      if (getModalButtonWrapper) {
        getModalButtonWrapper.classList.add(
          'flex',
          'justify-between',
          'items-center',
        );
        getModalButtonWrapper.append(cancelButton);
      }
    }
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });
  }
  if (hasCloseButton) {
    const modalCloseButton = p(
      {
        class: 'close-button absolute right-10 top-6',
        name: 'close',
      },
      span({
        class: 'icon icon-close cursor-pointer',
      }),
    );
    modalCloseButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });

    decorateIcons(modalCloseButton);
    modalContainer.append(modalCloseButton);
  }
  modalContainer.append(modalBody);

  modalWrapper.append(modalContainer);
  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    mainContainer.append(modalWrapper);
  }
}

/**
 * Fetches product information from APIs based on product ID.
 * @param {string} id - Product ID to fetch data for.
 * @returns {Promise<Object|null>} - Product data or null if fetch fails.
 */
export async function getProductInfo(id, needInterShop = true) {
  const api = true;

  if (api) {
    try {
      const coveoResponse = await getApiData(
        `https://${window.DanaherConfig.host}/us/en/product-data/productInfo/?product=${id}`,
      );
      if (coveoResponse?.status === 'success') {
        let productData = {};
        const product = coveoResponse?.data?.results?.[0];
        if (!product) return {};
        const coveoData = {
          title: product?.title,
          url: product?.clickUri,
          images: product?.raw?.images,
          brand: product?.raw?.ec_brand[0],
          objecttype: product?.raw?.objecttype,
          description: product?.raw?.description,
          defaultcategoryname: product?.raw?.defaultcategoryname,
        };

        // if needs intershop data
        if (needInterShop) {
          const intershopProductId = id.slice(0, id.lastIndexOf('-'));
          const intershopData = await getApiData(
            `${baseURL}products/${intershopProductId}`,
          );

          if (intershopData?.status === 'success') {
            const shopData = intershopData.data;

            const showCart = shopData?.attributes?.some(
              (attr) => attr.name === 'show_add_to_cart' && attr.value === 'True',
            );

            productData = {
              title: coveoData?.title,
              url: coveoData?.url,
              images: coveoData?.images,
              brand: coveoData?.brand,
              objecttype: coveoData?.objecttype,
              description: coveoData?.description,
              defaultcategoryname: coveoData?.defaultcategoryname,
              availability: shopData?.availability?.inStockQuantity,
              uom:
                shopData.packingUnit > 0
                  ? `${shopData.packingUnit}/Bundle`
                  : '1/Bundle',
              minQty: shopData?.minOrderQuantity,
              maxQty: shopData?.maxOrderQuantity,
              showCart,
              price: shopData?.salePrice?.value,
            };
          } else {
            productData = {};
          }
        } else {
          productData = {
            title: coveoData?.title,
            url: coveoData?.url,
            images: coveoData?.images,
            brand: coveoData?.brand,
            objecttype: coveoData?.objecttype,
            description: coveoData?.description,
            defaultcategoryname: coveoData?.defaultcategoryname,
          };
        }
        return productData;
      }
      return {};
    } catch (e) {
      return { status: 'error', data: e };
    }
  } else {
    // Placeholder for future API implementation
    return {};
  }
}
