import {
  a, div, p, span, hr, h1, input,
  a, div, p, span, hr, h1, input,
} from '../../scripts/dom-builder.js';
import {
  getAuthorization, getCommerceBase,
  getProductResponse, getProductPriceDetails,
  getProductResponse, getProductPriceDetails,
} from '../../scripts/commerce.js';
import { createOptimizedS7Picture, decorateModals } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import addtoCartSlideout from '../../scripts/slideout.js';
import { initializeLoader } from '../../scripts/loader.js';

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
        img.className = 'w-16 h-16 rounded-md shadow-lg';
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

function extractLineItems(obj) {
  const { lineItems } = obj;
  const result = [];
  // Fetch product details from localStorage
  const localStorageData = JSON.parse(localStorage.getItem('product-details')) || [];
  Object.entries(lineItems).forEach(([key, item]) => {
    // Find the corresponding product details from localStorage
    // eslint-disable-next-line max-len
    const productDetails = localStorageData.find((detail) => detail.raw && detail.raw.sku === item.product);
    let img;
    let description;
    let title;
    if (productDetails) {
      if (productDetails.raw.images) {
        // eslint-disable-next-line prefer-destructuring
        img = productDetails.raw.images[0];
      }
      description = productDetails.raw.richdescription;
      title = productDetails.title;
    }
    result.push({
      skuID: item.product,
      position: item.position,
      id: item.id,
      quantity: item.quantity.value,
      unitprice: item.pricing.price.net.value,
      img,
      description,
      title,
    });
  });

  const main = document.querySelector('.product-hero-wrapper');
  addtoCartSlideout(main, result);
}

let basketId;
async function addToCart(product) {
  initializeLoader('#7523FF');
  const baseURL = getCommerceBase();
  const authHeader = getAuthorization();
  const qty = document.querySelector('[name="qty"]').value;
  const productQty = parseInt(qty, 10);

  let basket;
  if (authHeader && (authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
    // Basket API
    if (!basketId) {
      const response = await fetch(`${baseURL}/baskets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...Object.fromEntries(authHeader) },
        body: JSON.stringify({}),
      });
      basket = await response.json();
      basketId = basket.title;
    }
    // Items API
    if (basketId) {
      const response = await fetch(`${baseURL}/baskets/${basketId}/items?include=product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/vnd.intershop.basket.v1+json', ...Object.fromEntries(authHeader) },
        body: JSON.stringify([{
          product: product?.raw?.sku,
          quantity: {
            value: productQty,
          },
        }]),
      });
      // Current API
      let currentResponse;
      if (response.status === 201) {
        const Response = await fetch(`${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Accept: 'application/vnd.intershop.basket.v1+json', ...Object.fromEntries(authHeader) },
        });
        currentResponse = await Response.json();
      }
      extractLineItems(currentResponse.included);
    }
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
    const allImages = response[0]?.raw.images;
    const verticalImageGallery = imageSlider(allImages, response[0]?.Title);
    const defaultContent = div();
    defaultContent.innerHTML = response[0]?.raw.richdescription;
    defaultContent.prepend(span({ class: 'sku hidden' }, response[0]?.raw.productid));
    defaultContent.prepend(h1({ class: 'title' }, h1Value || response[0]?.raw.titlelsig));
    defaultContent.prepend(span({ class: 'categories hidden' }, response[0]?.raw.categories));
    defaultContent.prepend(span({ class: 'category-name' }, response[0]?.raw?.defaultcategoryname ? response[0]?.raw?.defaultcategoryname : ''));
    const rfqEl = block.querySelector(':scope > div:nth-child(1)');

    if (rfqEl && rfqEl.textContent.includes('Request for Quote')) {
      let rfqParent;
      rfqEl.classList.add(...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
      if (response[0]?.raw?.objecttype === 'Product' || response[0]?.raw?.objecttype === 'Bundle') {
        rfqParent = p({ class: 'lg:w-55 pt-6 cursor-pointer' }, rfqEl);
        rfqParent.addEventListener('click', () => { addToQuote(response[0]); });
      } else {
        rfqParent = p({ class: 'show-modal-btn lg:w-55 pt-6 cursor-pointer' }, rfqEl);
      }
      defaultContent.append(rfqParent);
      const cartResponse = await getProductPriceDetails();
      const cartButton = document.createElement('button');
      cartButton.textContent = 'Add to Cart';
      cartButton.classList.add(...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
      if (cartResponse.listPrice.value > cartResponse.salePrice.value) {
        const showListPrice = div(
          { class: 'strike-price mt-4' },
          p({ class: 'line-through text-red-500' }, 'List Price: ', `${formatMoney(cartResponse?.listPrice.value)}`),
        );
        defaultContent.append(showListPrice);
      }
      if ('listPrice' in cartResponse && cartResponse?.listPrice.value !== 0) {
        /* qty input box */
        const qtyInput = input({
          type: 'text',
          name: 'qty',
        });
        /* show price */
        const priceSale = div(
          { class: 'show-price flex divide-x divide-gray-300 gap-2' },
          div(
            p({ class: '!text-4xl font-extrabold leading-10' }, `${formatMoney(cartResponse?.salePrice.value)}`),
            p({ class: 'currencystyle text-end' }, '(USD)'),
          ),
          div(
            { class: 'pl-4 mx-auto' },
            p({ class: 'text-base font-bold leading-6' }, 'Unit of Measure'),
            p(`${cartResponse?.minOrderQuantity}`),
          ),
          div(
            { class: 'pl-4 mx-auto' },
            p({ class: 'text-base font-bold leading-6' }, 'Min.Order Qty'),
            p(`${cartResponse?.minOrderQuantity}`),
          ),
        );
        defaultContent.append(
          priceSale,
          div(
            { class: 'add-to-cart-cta' },
            div(
              { class: 'addQty' },
              qtyInput,
            ),
            div(
              { class: 'add-cart-btn' },
              cartButton,
            ),
            rfqParent,
          ),
        );
      }
      cartButton.addEventListener('click', () => {
        addToCart(response[0]);
      });
    }

    const infoDiv = div();
    if (response[0]?.raw.externallink !== undefined) {
      infoDiv.prepend(
        p('For additional information'),
        a(
          { href: `${response[0]?.raw.externallink}?utm_source=dhls_website`, target: '_blank' },
          span({ class: 'ext-link' }),
        ),
      );
      infoDiv.querySelector('a .ext-link').innerHTML = `Visit ${response[0]?.raw.opco}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5 pb-1"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>`;
    }

    try {
      if (response[0].raw?.bundlepreviewjson) {
        const bundleDetails = JSON.parse(response[0].raw?.bundlepreviewjson);
        if (bundleDetails?.length > 0) {
          defaultContent.append(addBundleDetails(response[0]?.Title, bundleDetails));
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }

    defaultContent.append(
      div(
        { class: 'basic-info' },
        div(p('Brand'), p({ class: 'brand' }, response[0]?.raw.opco)),
        infoDiv,
      ),
    );
    block.parentElement.classList.add(...'stretch'.split(' '));
    block.innerHTML = '';
    block.append(div({ class: 'product-hero-content' }, div({ class: 'hero-default-content w-full' }, defaultContent), verticalImageGallery));
    decorateModals(block);
  }
}
