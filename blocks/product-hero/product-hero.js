import {
<<<<<<< HEAD
  a, div, p, span, hr, h1, input,
=======
  div, p, span, input, button,
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
} from '../../scripts/dom-builder.js';
import {
  getAuthorization,
  getCommerceBase,
  getProductResponse,
  getProductDetails,
} from '../../scripts/commerce.js';
<<<<<<< HEAD
import { getProductDetails } from '../../scripts/common-utils.js';
import { createOptimizedS7Picture, decorateModals } from '../../scripts/scripts.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
=======
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import { addItemToCart } from '../../utils/utils.js';
import {
  createOptimizedS7Picture,
  decorateModals,
} from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914

function showImage(e) {
  const selectedImage = document.querySelector('.image-content picture');
  if (e.target) {
    const currentPicture = e.target.parentElement;
    const currentActive = currentPicture.parentElement.querySelector('.active');
    if (currentActive && currentActive.className.includes('active')) currentActive.classList.toggle('active');
    currentPicture.classList.toggle('active');
    selectedImage.replaceWith(currentPicture.cloneNode(true));
  }
}

function loadMore() {
  const allImageContainer = document.querySelector(
    '.vertical-gallery-container > div > div:not(:nth-child(1)) picture.active',
  ).parentElement;
  const shownImage = allImageContainer.querySelectorAll('picture:not(.hidden)');
  const notShownImage = allImageContainer.querySelectorAll('picture.hidden');
  if (shownImage.length > 0) {
    if (
      shownImage[shownImage.length - 1].nextElementSibling
      && !shownImage[shownImage.length - 1].nextElementSibling.className.includes(
        'view-more',
      )
    ) {
      shownImage[0].classList.add('hidden');
      shownImage[shownImage.length - 1].nextElementSibling.classList.remove(
        'hidden',
      );
    } else {
      // REMOVE THE LASTS FIRST-INDEXED NON-HIDDEN VALUE
      const firstNonActive = allImageContainer.querySelector('.hidden');
      if (firstNonActive) firstNonActive.classList.remove('hidden');
      // HIDE THE LAST-HIDDEN-ELEMENT'S NEXT-SIBLING
      notShownImage[notShownImage.length - 1].nextElementSibling.classList.add(
        'hidden',
      );
    }
  }
}

function imageSlider(allImages, productName = 'product') {
  const slideContent = div(
    { class: 'image-content' },
    createOptimizedS7Picture(allImages[0], `${productName} - image`, true),
  );
  const verticalSlides = div();
  allImages.map((image, index) => {
    const imageElement = createOptimizedS7Picture(
      image,
      `${productName} - image ${index + 1}`,
      false,
    );
    let imageClass = index === 0 ? 'active' : '';
    if (index > 2) imageClass += ' hidden';
    if (imageClass !== '') imageElement.className = imageClass.trim();
    imageElement.addEventListener('click', showImage);
    verticalSlides.append(imageElement);
    return image;
  });
  if (allImages.length > 3) {
    const showMore = div({ class: 'view-more' }, 'View More');
    showMore.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4" viewBox="0 0 12 12">
      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
    </svg>`;
    showMore.addEventListener('click', loadMore);
    verticalSlides.append(showMore);
  }
  return div(
    { class: 'vertical-gallery-container' },
    div(slideContent, verticalSlides),
  );
}

async function addToQuote(product) {
  try {
    const baseURL = getCommerceBase();
    const authHeader = getAuthorization();
    if (
      authHeader
      && (authHeader.has('authentication-token')
        || authHeader.has('Authorization'))
    ) {
      const quote = await fetch(`${baseURL}/rfqcart/-`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(authHeader),
        },
        body: JSON.stringify({
          quantity: {
            type: 'Quantity',
            value: 1,
            unit: 'N/A',
          },
          productSKU: product?.raw?.sku,
          image: product?.raw?.images?.[0],
          brand: product?.raw?.opco,
          referrer: window.location.href,
          referrerTitle: document.title
            .replace('| Danaher Lifesciences', '')
            .replace('| Danaher Life Sciences', '')
            .trim(),
        }),
      });
      const { default: getToast } = await import('../../scripts/toast.js');
      if (quote.status === 200) {
        const responseJson = await quote.json();
        const addedProduct = responseJson?.items?.slice(-1)?.at(0);
        await getToast('quote-toast', addedProduct);
      } else {
        await getToast('quote-toast', null);
      }
    }
  } catch (error) {
    const { default: getToast } = await import('../../scripts/toast.js');
    await getToast('quote-toast', null);
  }
}

export default async function decorate(block) {
  const titleEl = block.querySelector('h1');
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();

  /* currency formatter */
  function formatMoney(number) {
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  const response = await getProductResponse();

  if (response?.length > 0) {
<<<<<<< HEAD
    // console.log('respnseee', response);
    const productInfo = await getProductDetails(response[0]?.raw?.sku);
    // console.log('product Info', productInfo);
    const allImages = response[0]?.raw.images;
    const verticalImageGallery = imageSlider(allImages, response[0]?.Title);
    const defaultContent = div();
    defaultContent.innerHTML = response[0]?.raw.richdescription;
    // defaultContent.innerHTML = productInfo.data.longDescription;
    const sku = div({
      class:
        'w-64 justify-start text-gray-700 text-base font-extralight',
    }, productInfo.data.sku);
    defaultContent.prepend(sku);
    const infoTab = div(
      {
        class: 'self-stretch inline-flex justify-start items-center gap-9',
      },
      div(
        {
          class:
            'justify-start text-black text-4xl font-normal',
=======
    const productInfo = await getProductDetails(response[0]?.raw?.sku);
    const allImages = response[0]?.raw.images;
    const verticalImageGallery = imageSlider(allImages, response[0]?.Title);
    const defaultContent = div({
      class:
        'self-stretch inline-flex flex-col justify-start items-start gap-9 ',
    });
    const headingDiv = div({
      class: 'self-stretch flex flex-col justify-start items-start gap-2',
    });
    const skudiv = div(
      {
        class: 'self-stretch inline-flex justify-start items-start gap-2',
      },
      div(
        {
          class: 'w-[19rem] flex justify-start items-center gap-1',
        },
        div(
          {
            class: 'pr-1 py-1 flex justify-center items-center gap-2.5',
          },
          div(
            {
              class:
                'text-center justify-start text-violet-900 text-lg font-normal',
            },
            response[0]?.raw.opco,
          ),
        ),
      ),
    );

    headingDiv.append(skudiv);
    const itemInfoDiv = div(
      {
        class: 'self-stretch flex flex-col justify-start items-start gap-4',
      },
      div(
        {
          class: 'self-stretch justify-start text-black text-4xl font-normal',
        },
        response[0]?.raw.titlelsig,
      ),
      div(
        {
          class: 'w-[692px] h-5 flex flex-col justify-start items-start',
        },
        div(
          {
            class: 'w-64 justify-start text-gray-700 text-base font-extralight',
          },
          productInfo.data.sku,
        ),
      ),
      div(
        { class: 'self-stretch flex flex-col justify-start items-start' },
        div(
          {
            class:
              'self-stretch justify-start text-black text-base font-extralight',
          },
          response[0]?.raw.richdescription,
        ),
      ),
    );
    headingDiv.append(itemInfoDiv);
    defaultContent.append(headingDiv);

    const infoTab = div(
      {
        class:
          'self-stretch inline-flex justify-start items-start md:items-center gap-9 flex-col md:flex-row',
      },
      div(
        {
          class: 'justify-start text-black text-4xl font-normal',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
        },
        `$${productInfo.data.salePrice.value}`,
      ),
      div(
        {
          class:
<<<<<<< HEAD
            'flex-1 py-3 flex justify-start items-start gap-4',
=======
            'flex-1 py-3 flex justify-start items-start gap-4 flex-col md:flex-row',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
        },

        div({
          class:
<<<<<<< HEAD
            'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
        }),
        div(
          {
            class: 'w-24 inline-flex flex-col justify-center items-start gap-2',
          },
          div(
            {
              class:
                'justify-start text-black text-base font-extralight',
=======
            'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300 opacity-0 md:opacity-100',
        }),
        div(
          {
            class: 'w-24 inline-flex flex-col justify-center gap-2 items-start',
          },
          div(
            {
              class: 'justify-start text-black text-base font-extralight',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
            },
            'Availability',
          ),
          div(
            {
<<<<<<< HEAD
              class:
                'text-right justify-start text-black text-base font-bold',
=======
              class: 'text-right justify-start text-black text-base font-bold ',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
            },
            productInfo.data.availability ? 'EA' : 'EA',
          ),
        ),

        div({
          class:
<<<<<<< HEAD
            'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
        }),
        div(
          {
            class: 'w-[7rem] inline-flex flex-col justify-center items-start gap-2',
          },
          div(
            {
              class:
                'justify-start text-black text-base font-extralight ',
=======
            'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300 opacity-0 md:opacity-100',
        }),
        div(
          {
            class:
              'w-[7rem] inline-flex flex-col justify-center items-start gap-2',
          },
          div(
            {
              class: 'justify-start text-black text-base font-extralight ',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
            },
            'Unit of Measure',
          ),
          div(
            {
<<<<<<< HEAD
              class:
                'text-right justify-start text-black text-base font-bold ',
            },
            productInfo.data.packingUnit === '' ? 'EA' : productInfo.data.packingUnit,
=======
              class: 'text-right justify-start text-black text-base font-bold ',
            },
            productInfo.data.packingUnit === ''
              ? 'EA'
              : productInfo.data.packingUnit,
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
          ),
        ),

        div({
          class:
<<<<<<< HEAD
            'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
        }),
        div(
          {
            class: 'w-[7rem] inline-flex flex-col justify-center items-start gap-2',
          },
          div(
            {
              class:
                'justify-start text-black text-base font-extralight',
=======
            'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300 opacity-0 md:opacity-100',
        }),
        div(
          {
            class:
              'w-[7rem] inline-flex flex-col justify-center items-start gap-2',
          },
          div(
            {
              class: 'justify-start text-black text-base font-extralight',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
            },
            'Min. Order Qty',
          ),
          div(
            {
<<<<<<< HEAD
              class:
                'text-right justify-start text-black text-base font-bold ',
=======
              class: 'text-right justify-start text-black text-base font-bold ',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
            },
            productInfo.data.minOrderQuantity,
          ),
        ),
      ),
    );
<<<<<<< HEAD
=======

>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
    const shipInfo = div(
      {
        class:
          'w-full self-stretch inline-flex flex-col justify-start items-start gap-2',
      },
      div(
        {
          class: 'inline-flex justify-start items-center gap-2',
        },
        div(
          {
<<<<<<< HEAD
            class:
              'w-20 justify-start text-black text-base font-extralight',
=======
            class: 'w-20 justify-start text-black text-base font-extralight',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
          },
          'Ship From',
        ),
        div(
          {
<<<<<<< HEAD
            class:
              'text-right justify-start text-black text-base font-bold',
=======
            class: 'text-right justify-start text-black text-base font-bold',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
          },
          productInfo.data.manufacturer,
        ),
      ),
      div(
        {
          class: 'inline-flex justify-start items-center gap-2',
        },
        div(
          {
<<<<<<< HEAD
            class:
              'w-20 justify-start text-black text-base font-extralight',
=======
            class: 'w-20 justify-start text-black text-base font-extralight',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
          },
          'Sold By',
        ),
        div(
          {
<<<<<<< HEAD
            class:
              'text-right justify-start text-black text-base font-bold',
=======
            class: 'text-right justify-start text-black text-base font-bold',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
          },
          productInfo.data.manufacturer,
        ),
      ),
    );
<<<<<<< HEAD
    defaultContent.append(infoTab);
    defaultContent.append(shipInfo);
    defaultContent.prepend(span({ class: 'sku hidden' }, response[0]?.raw.productid));
    defaultContent.prepend(h1({ class: 'title' }, h1Value || response[0]?.raw.titlelsig));
    defaultContent.prepend(span({ class: 'categories hidden' }, response[0]?.raw.categories));
    defaultContent.prepend(span({ class: 'category-name' }, productInfo.data.manufacturer));
=======

    // defaultContent.prepend(
    //   span({ class: "sku hidden" }, response[0]?.raw.productid)
    // );
    // defaultContent.prepend(
    //   h1({ class: "title" }, h1Value || response[0]?.raw.titlelsig)
    // );
    // defaultContent.prepend(
    //   span({ class: "categories hidden" }, response[0]?.raw.categories)
    // );
    // defaultContent.prepend(
    //   span({ class: "category-name" }, productInfo.data.manufacturer)
    // );
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
    const rfqEl = block.querySelector(':scope > div:nth-child(1)');
    const addCartBtnEl = block.querySelector(':scope > div:nth-child(1)');
    addCartBtnEl.classList.add(
      ...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(
        ' ',
      ),
    );
    if (rfqEl && rfqEl.textContent.includes('Request for Quote')) {
      let rfqParent;
      rfqEl.classList.add(
        ...'btn-outline-trending-brand text-lg rounded-full px-6 py-3 !no-underline'.split(
          ' ',
        ),
      );
      if (
        response[0]?.raw?.objecttype === 'Product'
        || response[0]?.raw?.objecttype === 'Bundle'
      ) {
        rfqParent = p({ class: 'lg:w-55 cursor-pointer' }, rfqEl);
        rfqParent.addEventListener('click', () => {
          addToQuote(response[0]);
        });
      } else {
        rfqParent = p(
          { class: 'show-modal-btn lg:w-55 cursor-pointer' },
          rfqEl,
        );
      }

      const modalInput = input({
<<<<<<< HEAD
        // id: cartItemValue.lineItemId,
        class:
            'w-14 h-12 px-4 py-1.5 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden',
        type: 'number',
        // min: cartItemValue.minOrderQuantity,
        // max:
        //   cartItemValue.maxOrderQuantity == 0 ? 99 : cartItemValue.maxOrderQuantity,
        name: 'item-quantity',
        value: 1,
      });
      
      const addToCart = div({
        class: ""
      },
      modalInput,
      div(
          {
            class: 'flex justify-start items-start gap-3',
          },
          div(
            {
              class:
                'px-6 py-3 bg-violet-600 rounded-[30px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center overflow-hidden',
            },
            div(
              {
                class:
                  "text-right justify-start text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              'Buy Now',
            ),
          ),
        ),
    );
    decorateIcons(addToCart);
      // defaultContent.append(rfqParent);
      const buttonTab = div(
        {
          class: 'self-stretch inline-flex justify-start items-end gap-3',
        },
        productInfo.data.salePrice?.value != 0 ?  addToCart : "",
        rfqParent,
      );
      
      defaultContent.append(buttonTab);
=======
        id: productInfo.data.lineItemId,
        class:
          'w-14 h-12 px-4 py-1.5 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden',
        type: 'number',
        min: productInfo.data.minOrderQuantity,
        max:
          productInfo.data.maxOrderQuantity == 0
            ? 99
            : productInfo.data.maxOrderQuantity,
        name: 'item-quantity',
        value: 1,
      });

      const buyButton = div(
        {
          class: 'flex justify-start items-start gap-3',
        },
        button(
          {
            class:
              'px-6 py-3 bg-violet-600 rounded-[30px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center overflow-hidden',
            sku: productInfo.data.sku,
            productName: productInfo.data.productName,
            minOrderQuantity: productInfo.data.minOrderQuantity,
            manufacturer: productInfo.data.manufacturer,
            maxOrderQuantity: productInfo.data.maxOrderQuantity,
            price: productInfo.data.salePrice.value,
            quantity: 0,
          },
          'Buy Now',
        ),
      );
      let enteredValue = 0;
      modalInput.addEventListener('change', (event) => {
        // const selectedDiv = document.getElementById(productInfo.data.lineItemId);
        // // or any div reference
        const einput = document.getElementById(productInfo.data.lineItemId);
        const productItem = einput.parentElement;
        enteredValue = event.target.value;
        if (enteredValue < Number(einput.min)) {
          productItem.style.border = '2px solid red';
          alert(
            `Please enter a valid order quantity 
            which should be greater then 
            ${einput.min} and less then 
            ${einput.max}`,
          );
        } else if (enteredValue > Number(einput.max)) {
          productItem.style.border = '2px solid red';
          alert(
            `Please enter a valid order quantity which should be greater then ${einput.min} and less then ${einput.max}`,
          );
        } else {
          productItem.style.border = '';
          // modifyCart("quantity-added", input, event.target.value);
        }
        // modifyCart("quantity-added", event.target.value);
      });
      buyButton.addEventListener('click', async (event) => {
        showPreLoader();
        const item = event.target.attributes;
        if (enteredValue == 0) enteredValue = 1;
        item.enteredValue = Number(enteredValue);
        const res = await addItemToCart(item, 'product-sku');

        if (res) {
          if (res.status == 'success') {
            removePreLoader();
          }
        }
      });
      const addToCart = div(
        {
          class: 'self-stretch inline-flex justify-start items-end gap-3',
        },
        modalInput,
        buyButton,
      );
      decorateIcons(addToCart);
      // defaultContent.append(rfqParent);
      const buttonTab = div(
        {
          class:
            'w-full self-stretch inline-flex justify-start items-end gap-3',
        },
        productInfo.data.salePrice?.value != 0
          && response[0]?.raw?.objecttype === 'Product'
          ? addToCart
          : '',
        rfqParent,
      );

      const priceInfoDiv = div({
        class: 'self-stretch flex flex-col justify-start items-start gap-5',
      });
      if (
        response[0]?.raw?.objecttype === 'Product'
        || response[0]?.raw?.objecttype === 'Bundle'
      ) {
        priceInfoDiv.append(infoTab);
        priceInfoDiv.append(shipInfo);
      }

      priceInfoDiv.append(buttonTab);
      defaultContent.append(priceInfoDiv);
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
      /* brandname checking and displaying buy now btn */

      const brandName = response[0]?.raw?.opco || null;
      const showskupricelistusd = response[0]?.raw.listpriceusd;

      const currncyFormat = Number(showskupricelistusd);

      const brandButton = document.createElement('button');
      brandButton.textContent = 'Buy Now on abcam.com';
      brandButton.classList.add(
        ...'btn-outline-trending-brand text-lg rounded-full w-full px-4 py-2'.split(
          ' ',
        ),
      );

      const brandURL = response[0]?.raw?.externallink
        ? `${response[0].raw.externallink}?utm_source=dhls_website`
        : null;
      brandButton.addEventListener('click', () => {
        window.open(brandURL, '_blank');
      });

      /* eslint eqeqeq: "off" */
      if (
        showskupricelistusd
        && brandName === 'Abcam'
        && showskupricelistusd != ''
      ) {
        const brandStartPrice = div(
          { class: 'brand-price mt-4 flex divide-x gap-4' },
          div(
            p({ class: 'text-base font-bold leading-none' }, 'Starts at'),
            p(
              { class: 'start-price leading-none' },
              `${formatMoney(currncyFormat)}`,
            ),
          ),
          div(
            {
              class:
                'add-buynow-btn flex flex-wrap gap-4 md:flex-row sm:flex sm:justify-center md:justify-start',
            },
            brandButton,
          ),
        );
        defaultContent.append(brandStartPrice);
        rfqParent.remove();
      }
    }

<<<<<<< HEAD
    const infoDiv = div();
    const globeImg = div(
      {
        class: '',
      },
      span({
        class:
          'icon icon-Globe-alt w-8 h-8 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
=======
    const infoDiv = div({
      clas: '',
    });
    const globeImg = div(
      {
        class: 'w-[3rem] h-[3rem] relative overflow-hidden',
      },
      span({
        class:
          'icon icon-Globe-alt w-[3rem] h-[3rem] fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
      }),
    );
    const externalLink = div(
      {
<<<<<<< HEAD
        class: '',
      },
      span({
        class:
          'icon icon-External-link w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const externalButton = div(
      { class: 'inline-flex gap-2 cursor-pointer' },
      `Visit ${response[0]?.raw.opco}`,
      externalLink,
    );

    const externalURL = `${response[0].raw.externallink}?utm_source=dhls_website`;
=======
        class: 'w-[3rem] h-[3rem] relative overflow-hidden',
      },
      span({
        class:
          'icon icon-External-link w-[3rem] h-[3rem] fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const externalButton = div(
      { class: 'inline-flex cursor-pointer justify-center items-center' },
      `To learn more visit ${response[0]?.raw.opco} `,
      externalLink,
    );
    const clickableLink = response[0].raw.externallink
      ? response[0].raw.externallink
      : response[0].raw.clickableuri;
    const externalURL = `${clickableLink}?utm_source=dhls_website`;
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
    externalButton.addEventListener('click', () => {
      window.open(externalURL, '_blank');
    });
    const info = div(
      {
<<<<<<< HEAD
        class: 'inline-flex items-center justify-center gap-2',
=======
        class:
          'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
      },
      globeImg,
      externalButton,
    );
    decorateIcons(info);
<<<<<<< HEAD
    if (response[0]?.raw.externallink !== undefined) {
      infoDiv.prepend(
        info,
      );
    }

    try {
      if (response[0].raw?.bundlepreviewjson) {
        const bundleDetails = JSON.parse(response[0].raw?.bundlepreviewjson);
        if (bundleDetails?.length > 0) {
          defaultContent.append(addBundleDetails(response[0]?.Title, bundleDetails));
        }
      }
    } catch (e) {
      // console.error(e);
    }
    const collectionButton = div(
      {
        class: '',
      },
      span({
        class: 'icon icon-Collection w-8 h-8 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );

    const categoryLink = div(
      {
        class: 'inline-flex items-center justify-center gap-2 cursor-pointer',
      },
      collectionButton,
      response[0]?.raw.opco,
    );
    decorateIcons(categoryLink);
    categoryLink.addEventListener('click', () => {
      window.open(externalURL, '_blank');
    });
    defaultContent.append(
      div(
        { class: 'py-3 border-t border-b border-gray-300 basic-info' },
        categoryLink,
        infoDiv,
      ),
    );

=======
    infoDiv.prepend(info);

    const collectionButton = div(
      {
        class: 'w-[4rem] h-[3rem] relative overflow-hidden',
      },
      span({
        class:
          'icon icon-Collection w-[3rem] h-[3rem] fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const rectangleButton = div(
      {
        class: 'w-56 h-[1rem]',
      },
      span({
        class:
          'icon icon-Rectangle w-full h-[1rem] fill-current [&_svg>use]:stroke-violet-4600 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const chevronButton = div(
      {
        class: 'w-full inline-flex justify-center items-center',
      },
      span({
        class:
          'icon icon-chevron-down w-8 h-8 fill-current [&_svg>use]:stroke-violet-400 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const clipBoard = div(
      {
        class: 'w-[4rem] h-[3rem] relative overflow-hidden',
      },
      span({
        class:
          'icon icon-ClipboardList w-[3rem] h-[3rem] fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const categoryLink = div(
      {
        class: 'w-full inline-flex flex-col ',
      },
      // div({
      //     class: "w-full inline-flex flex-col"
      //   },
      div(
        {
          class:
            'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
        },
        collectionButton,
        div(
          {
            class: 'w-full inline-flex flex-col ',
          },
          div(
            {
              class: 'justify-start text-black text-base',
            },
            'See all products in this family',
          ),
          div(
            {
              class: 'w-56 h-[1rem]',
            },
            span({
              class:
                'icon icon-Rectangle w-full h-[1rem] fill-current [&_svg>use]:stroke-violet-4600 [&_svg>use]:hover:stroke-danaherpurple-800',
            }),
          ),
        ),
      ),
      div(
        {
          class: 'inline-flex justify-center items-center',
        },
        span({
          class:
            'icon icon-chevron-down w-8 h-8 fill-current [&_svg>use]:stroke-violet-400 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
    );

    decorateIcons(categoryLink);

    categoryLink.addEventListener('click', () => {
      const main = block.closest('main');
      const sections = main.querySelectorAll('.section.page-tab');
      const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));
      if (tabSections) {
        const currentTab = window.location.hash?.replace('#', '')
          || tabSections[0].getAttribute('aria-labelledby');
        sections.forEach((section) => {
          section.style.paddingTop = '0px';
          if (currentTab === section.getAttribute('aria-labelledby')) {
            section.style.paddingTop = '110px';
            section.scrollIntoView({
              behavior: 'smooth',
            });
          }
        });
      }
    });

    const categoryLinkSku = div(
      {
        class: 'inline-flex flex-col justify-start',
      },
      // div({
      //     class: "w-full inline-flex flex-col"
      //   },
      div(
        {
          class:
            'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
        },
        div(
          {
            class: 'w-[4rem] h-[3rem] relative overflow-hidden',
          },
          span({
            class:
              'icon icon-Collection w-[3rem] h-[3rem] fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
        ),
        div(
          {
            class: 'w-full inline-flex flex-col ',
          },
          div(
            {
              class: 'justify-start text-black text-base',
            },
            'See all products in this family',
          ),
        ),
      ),
    );
    decorateIcons(categoryLinkSku);
    categoryLinkSku.addEventListener('click', () => {
      window.open(externalURL, '_blank');
    });
    const bundleLink = div(
      {
        class: 'w-full inline-flex flex-col ',
      },
      div(
        {
          class:
            'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
        },
        clipBoard,
        div(
          {
            class: 'w-full inline-flex flex-col ',
          },
          div(
            {
              class: 'justify-start text-black text-base',
            },
            'See all items in this bundle',
          ),
          rectangleButton,
        ),
      ),
      chevronButton,
    );

    // decorateIcons(bundleLink);
    const bundleTab = div(
      {
        class: 'w-full inline-flex gap-6 flex-col md:flex-row',
      },
      bundleLink,
      categoryLink,
    );
    decorateIcons(bundleTab);
    bundleLink.addEventListener('click', () => {
      const main = block.closest('main');
      const sections = main.querySelectorAll('.section.page-tab');
      const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));
      if (tabSections) {
        const currentTab = window.location.hash?.replace('#', '')
          || tabSections[0].getAttribute('aria-labelledby');
        sections.forEach((section) => {
          section.style.paddingTop = '0px';
          if (currentTab === section.getAttribute('aria-labelledby')) {
            section.style.paddingTop = '110px';
            section.scrollIntoView({
              behavior: 'smooth',
            });
          }
        });
      }
    });
    // categoryLink.addEventListener("click", () => {
    //   window.open(externalURL, "_blank");
    // });

    if (response[0]?.raw?.objecttype === 'Family') {
      defaultContent.append(
        div(
          {
            class:
              'w-[692px] inline-flex justify-start items-center gap-6 flex-col',
          },
          div(
            {
              class: 'w-full inline-flex gap-6 ',
            },

            categoryLink,
            div({ class: 'w-full inline-flex flex-col h-[0px]' }),
          ),
        ),
      );
      defaultContent.append(
        div(
          {
            class:
              'w-[692px] border-t border-b border-gray-300 inline-flex justify-start items-center gap-6 ',
          },
          infoDiv,
        ),
      );
    } else if (response[0]?.raw?.objecttype === 'Bundle') {
      defaultContent.append(
        div(
          {
            class:
              'w-[692px] inline-flex justify-start items-center gap-6 flex-col',
          },
          bundleTab,
        ),
      );
      defaultContent.append(
        div(
          {
            class:
              'w-[692px] border-t border-b border-gray-300 inline-flex justify-start items-center gap-6 ',
          },
          infoDiv,
        ),
      );
    } else {
      defaultContent.append(
        div(
          {
            class:
              'w-[692px] border-t border-b border-gray-300 inline-flex justify-start items-center  ',
          },
          div(
            {
              class: 'w-full inline-flex gap-6 flex-col md:flex-row ',
            },

            categoryLinkSku,
            infoDiv,
          ),
        ),
      );
    }

>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
    const categoryDiv = (category) => {
      const list = div(
        {
          class:
<<<<<<< HEAD
          'px-4 py-1 bg-violet-50 flex justify-center items-center gap-2.5 cursor-pointer',
        },
        div({ class: 'text-center justify-start text-violet-600 text-lg font-normal ' }, category),
=======
            'px-4 py-1 bg-violet-50 flex justify-center items-center gap-2.5 cursor-pointer',
        },
        div(
          {
            class:
              'text-center justify-start text-violet-600 text-lg font-normal ',
          },
          category,
        ),
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
      );
      return list;
    };

    const categoriesDiv = div({
      class: 'px-4 py-4 inline-flex justify-start items-start gap-2',
    });
<<<<<<< HEAD
    response[0]?.raw.categories.forEach((category) => {
=======
    response[0]?.raw?.categories?.forEach((category) => {
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
      categoriesDiv.append(categoryDiv(category));
    });

    defaultContent.append(categoriesDiv);
    block.parentElement.classList.add(...'stretch'.split(' '));
    block.innerHTML = '';
    block.append(
      div(
        { class: 'product-hero-content' },
        div({ class: 'hero-default-content w-full' }, defaultContent),
        verticalImageGallery,
      ),
    );
    decorateModals(block);
  }
}
