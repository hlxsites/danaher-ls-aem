import {
  a, div, p, span, hr, h1, input,
} from '../../scripts/dom-builder.js';
import {
  getAuthorization, getCommerceBase,
  getProductResponse,
} from '../../scripts/commerce.js';
import { getProductDetails } from '../../scripts/common-utils.js';
import { createOptimizedS7Picture, decorateModals } from '../../scripts/scripts.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

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
  const allImageContainer = document.querySelector('.vertical-gallery-container > div > div:not(:nth-child(1)) picture.active').parentElement;
  const shownImage = allImageContainer.querySelectorAll('picture:not(.hidden)');
  const notShownImage = allImageContainer.querySelectorAll('picture.hidden');
  if (shownImage.length > 0) {
    if (shownImage[shownImage.length - 1].nextElementSibling && !shownImage[shownImage.length - 1].nextElementSibling.className.includes('view-more')) {
      shownImage[0].classList.add('hidden');
      shownImage[shownImage.length - 1].nextElementSibling.classList.remove('hidden');
    } else {
      // REMOVE THE LASTS FIRST-INDEXED NON-HIDDEN VALUE
      const firstNonActive = allImageContainer.querySelector('.hidden');
      if (firstNonActive) firstNonActive.classList.remove('hidden');
      // HIDE THE LAST-HIDDEN-ELEMENT'S NEXT-SIBLING
      notShownImage[notShownImage.length - 1].nextElementSibling.classList.add('hidden');
    }
  }
}

function imageSlider(allImages, productName = 'product') {
  const slideContent = div({ class: 'image-content' }, createOptimizedS7Picture(allImages[0], `${productName} - image`, true));
  const verticalSlides = div();
  allImages.map((image, index) => {
    const imageElement = createOptimizedS7Picture(image, `${productName} - image ${index + 1}`, false);
    let imageClass = (index === 0) ? 'active' : '';
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
  return div({ class: 'vertical-gallery-container' }, div(slideContent, verticalSlides));
}

function addBundleDetails(title, bundleDetails) {
  const bundleProducts = div();
  const bundleHeading = div(
    { class: 'flex justify-between mt-5 mb-2' },
    div(
      { class: 'flex col-span-10' },
      p({ class: 'text-base font-bold leading-6' }, `${title} includes:`),
    ),
    div(
      { class: 'flex col-span-2 justify-center' },
      p({ class: 'text-base font-bold leading-6' }, 'QTY'),
    ),
  );
  bundleProducts.append(bundleHeading);

  bundleDetails.forEach((product, index) => {
    if (index < 3) {
      bundleProducts.append(div(
        { class: 'flex justify-between py-2 border-b w-[98%]' },
        div(
          { class: 'flex col-span-10 gap-x-4' },
          createOptimizedS7Picture(product.image, product.title, false),
          div(
            { class: 'flex flex-col items-start' },
            p(`${product.title}`),
            p(`${product.sku}`),
          ),
        ),
        div(
          { class: 'flex col-span-2 justify-center' },
          p(`${product.quantity ? product.quantity : 1}`),
        ),
      ));

      bundleProducts.querySelectorAll('img').forEach((img) => {
        img.className = 'rounded-md shadow-lg w-16 h-16';
        img.height = '64';
        img.width = '64';
      });
    }
    if (index === 3) bundleProducts.append(div({ class: 'block relative w-full mt-[-256px] h-[17rem]', style: 'background: linear-gradient(180deg, rgba(243, 244, 246, 0) 0%, #F3F4F6 92.07%);' }));
  });

  if (bundleDetails.length > 3) {
    bundleProducts.append(div(
      { class: 'flex w-full flex-wrap justify-center relative' },
      hr({ class: 'w-full border-gray-300' }),
      a(
        {
          href: '#',
          class: 'flex py-3 px-4 rounded-full bg-white items-center text-gray-700 leading-4 font-medium relative shadow-sm -mt-[21px] text-sm',
          onclick: (e) => {
            e.preventDefault();
            const productsTab = document.querySelector('[data-tabid="product-details"]');
            if (productsTab) productsTab.scrollIntoView({ behavior: 'smooth' });
            window.location.hash = 'product-details';
          },
        },
        span({ class: 'w-4 h-4 text-gray-400' }, '+'),
        'View Full Product Details',
      ),
    ));
  }

  return bundleProducts;
}

async function addToQuote(product) {
  try {
    const baseURL = getCommerceBase();
    const authHeader = getAuthorization();
    if (authHeader && (authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
      const quote = await fetch(`${baseURL}/rfqcart/-`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...Object.fromEntries(authHeader) },
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
          referrerTitle: document.title.replace('| Danaher Lifesciences', '').replace('| Danaher Life Sciences', '').trim(),
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
  const h1Value = getMetadata('h1');
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();

  /* currency formatter */
  function formatMoney(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  const response = await getProductResponse();

  if (response?.length > 0) {
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
        },
        `$${productInfo.data.salePrice.value}`,
      ),
      div(
        {
          class:
            'flex-1 py-3 flex justify-start items-start gap-4',
        },

        div({
          class:
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
            },
            'Availability',
          ),
          div(
            {
              class:
                'text-right justify-start text-black text-base font-bold',
            },
            productInfo.data.availability ? 'EA' : 'EA',
          ),
        ),

        div({
          class:
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
            },
            'Unit of Measure',
          ),
          div(
            {
              class:
                'text-right justify-start text-black text-base font-bold ',
            },
            productInfo.data.packingUnit === '' ? 'EA' : productInfo.data.packingUnit,
          ),
        ),

        div({
          class:
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
            },
            'Min. Order Qty',
          ),
          div(
            {
              class:
                'text-right justify-start text-black text-base font-bold ',
            },
            productInfo.data.minOrderQuantity,
          ),
        ),
      ),
    );
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
            class:
              'w-20 justify-start text-black text-base font-extralight',
          },
          'Ship From',
        ),
        div(
          {
            class:
              'text-right justify-start text-black text-base font-bold',
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
            class:
              'w-20 justify-start text-black text-base font-extralight',
          },
          'Sold By',
        ),
        div(
          {
            class:
              'text-right justify-start text-black text-base font-bold',
          },
          productInfo.data.manufacturer,
        ),
      ),
    );
    defaultContent.append(infoTab);
    defaultContent.append(shipInfo);
    defaultContent.prepend(span({ class: 'sku hidden' }, response[0]?.raw.productid));
    defaultContent.prepend(h1({ class: 'title' }, h1Value || response[0]?.raw.titlelsig));
    defaultContent.prepend(span({ class: 'categories hidden' }, response[0]?.raw.categories));
    defaultContent.prepend(span({ class: 'category-name' }, productInfo.data.manufacturer));
    const rfqEl = block.querySelector(':scope > div:nth-child(1)');
    const addCartBtnEl = block.querySelector(':scope > div:nth-child(1)');
    addCartBtnEl.classList.add(...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
    if (rfqEl && rfqEl.textContent.includes('Request for Quote')) {
      let rfqParent;
      rfqEl.classList.add(...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
      if (response[0]?.raw?.objecttype === 'Product' || response[0]?.raw?.objecttype === 'Bundle') {
        rfqParent = p({ class: 'lg:w-55 pt-6 cursor-pointer' }, rfqEl);
        rfqParent.addEventListener('click', () => { addToQuote(response[0]); });
      } else {
        rfqParent = p({ class: 'show-modal-btn lg:w-55 pt-6 cursor-pointer' }, rfqEl);
      }

      const modalInput = input({
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
      /* brandname checking and displaying buy now btn */

      const brandName = response[0]?.raw?.opco || null;
      const showskupricelistusd = response[0]?.raw.listpriceusd;

      const currncyFormat = Number(showskupricelistusd);

      const brandButton = document.createElement('button');
      brandButton.textContent = 'Buy Now on abcam.com';
      brandButton.classList.add(...'btn-outline-trending-brand text-lg rounded-full w-full px-4 py-2'.split(' '));

      const brandURL = response[0]?.raw?.externallink
        ? `${response[0].raw.externallink}?utm_source=dhls_website` : null;
      brandButton.addEventListener('click', () => {
        window.open(brandURL, '_blank');
      });

      /* eslint eqeqeq: "off" */
      if (showskupricelistusd && brandName === 'Abcam' && showskupricelistusd != '') {
        const brandStartPrice = div(
          { class: 'brand-price mt-4 flex divide-x gap-4' },
          div(
            p({ class: 'text-base font-bold leading-none' }, 'Starts at'),
            p({ class: 'start-price leading-none' }, `${formatMoney(currncyFormat)}`),
          ),
          div(
            { class: 'add-buynow-btn flex flex-wrap gap-4 md:flex-row sm:flex sm:justify-center md:justify-start' },
            brandButton,
          ),
        );
        defaultContent.append(
          brandStartPrice,
        );
        rfqParent.remove();
      }
    }

    const infoDiv = div();
    const globeImg = div(
      {
        class: '',
      },
      span({
        class:
          'icon icon-Globe-alt w-8 h-8 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    );
    const externalLink = div(
      {
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
    externalButton.addEventListener('click', () => {
      window.open(externalURL, '_blank');
    });
    const info = div(
      {
        class: 'inline-flex items-center justify-center gap-2',
      },
      globeImg,
      externalButton,
    );
    decorateIcons(info);
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

    const categoryDiv = (category) => {
      const list = div(
        {
          class:
          'px-4 py-1 bg-violet-50 flex justify-center items-center gap-2.5 cursor-pointer',
        },
        div({ class: 'text-center justify-start text-violet-600 text-lg font-normal ' }, category),
      );
      return list;
    };

    const categoriesDiv = div({
      class: 'px-4 py-4 inline-flex justify-start items-start gap-2',
    });
    response[0]?.raw.categories.forEach((category) => {
      categoriesDiv.append(categoryDiv(category));
    });

    defaultContent.append(categoriesDiv);
    block.parentElement.classList.add(...'stretch'.split(' '));
    block.innerHTML = '';
    block.append(div({ class: 'product-hero-content' }, div({ class: 'hero-default-content w-full' }, defaultContent), verticalImageGallery));
    decorateModals(block);
  }
}
