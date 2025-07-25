import {
  div,
  p,
  span,
  input,
  button,
} from '../../scripts/dom-builder.js';
import {
  getAuthorization,
  getCommerceBase,
  getProductDetails,
} from '../../scripts/commerce.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import {
  createOptimizedS7Picture,
  decorateModals,
} from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';


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
  // const h1Value = getMetadata('h1');
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();

  /* currency formatter */
  function formatMoney(number) {
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
  const result = JSON.parse(localStorage.getItem('eds-product-details'));

  console.log('result:', result);
  const productInfo = await getProductDetails(result?.raw?.sku);
  console.log('product Info', productInfo);
  const allImages = result?.raw.images;
  const verticalImageGallery = imageSlider(allImages, result?.Title);
  const defaultContent = div({
    class:
        'self-stretch inline-flex flex-col justify-start items-start gap-9 ',
  });
  const headingDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-2',
    },
  );
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

        ),
      ),
    ),
  );

  headingDiv.append(skudiv);
  console.log('headingDiv', headingDiv);
  const itemInfoDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class: 'self-stretch justify-start text-danaherpurple-800 text-[18px] font-medium leading-normal',
      },
      result?.raw.opco,
    ),
    div(
      {
        class: 'self-stretch justify-start text-black text-4xl font-medium leading-10',
      },
      result?.raw.titlelsig,
    ),
    div(
      {
        class: 'md:w-[692px] h-5 flex flex-col justify-start items-start',
      },
      div(
        {
          class: 'justify-start text-gray-700 text-base font-extralight leading-snug',
        },
        productInfo?.data?.sku,
      ),
    ),
    div(
      { class: 'self-stretch flex flex-col justify-start items-start' },
      div(
        {
          class:
              'self-stretch justify-start text-black text-base font-extralight leading-snug',
        },
        result?.raw?.richdescription.replace(/<[^>]*>/g, ''),
      ),
    ),
  );
  headingDiv.append(itemInfoDiv);
  defaultContent.append(headingDiv);

  const infoTab = div(
    {
      class: 'self-stretch inline-flex justify-start items-start md:items-center gap-9 flex-col md:flex-row',
    },
    div(
      {
        class: 'justify-start text-black text-4xl font-normal',
      },
      `$${productInfo?.data?.salePrice?.value}`,
    ),
    div(
      {
        class: 'flex-1 py-3 flex justify-start items-start gap-4 flex-col md:flex-row',
      },

      div({
        class:
          'w-12 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300 opacity-0 md:opacity-100',
      }),
      div(
        {
          class: 'w-24 inline-flex flex-col justify-center gap-2 items-start',
        },
        div(
          {
            class: 'justify-start text-black text-base font-extralight',
          },
          'Availability',
        ),
        div(
          {
            class: 'text-right justify-start text-black text-base font-bold ',
          },
          productInfo?.data?.availability ? 'EA' : 'EA',
        ),
      ),

      div({
        class:
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
          },
          'Unit of Measure',
        ),
        div(
          {
            class: 'text-right justify-start text-black text-base font-bold ',
          },
          productInfo?.data?.packingUnit === ''
            ? 'EA'
            : productInfo?.data?.packingUnit,
        ),
      ),

      div({
        class:
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
          },
          'Min. Order Qty',
        ),
        div(
          {
            class: 'text-right justify-start text-black text-base font-bold ',
          },
          productInfo?.data?.minOrderQuantity,
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
          class: 'w-20 justify-start text-black text-base font-extralight',
        },
        'Ship From',
      ),
      div(
        {
          class: 'text-right justify-start text-black text-base font-bold',
        },
        productInfo?.data?.manufacturer,
      ),
    ),
    div(
      {
        class: 'inline-flex justify-start items-center gap-2',
      },
      div(
        {
          class: 'w-20 justify-start text-black text-base font-extralight',
        },
        'Sold By',
      ),
      div(
        {
          class: 'text-right justify-start text-black text-base font-bold',
        },
        productInfo?.data?.manufacturer,
      ),
    ),
  );

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
      result?.raw?.objecttype === 'Product'
        || result?.raw?.objecttype === 'Bundle'
    ) {
      rfqParent = p({ class: 'lg:w-55 cursor-pointer' }, rfqEl);
      rfqParent.addEventListener('click', () => {
        addToQuote(result);
      });
    } else {
      rfqParent = p(
        { class: 'show-modal-btn lg:w-55 cursor-pointer' },
        rfqEl,
      );
    }

    const modalInput = input({
      id: productInfo?.data?.lineItemId,
      class:
          'w-14 h-12 px-4 py-1.5 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden',
      type: 'number',
      min: productInfo?.data?.minOrderQuantity,
      max:
          productInfo?.data?.maxOrderQuantity == 0
            ? 99
            : productInfo?.data?.maxOrderQuantity,
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
          sku: productInfo?.data?.sku,
          productName: productInfo?.data?.productName,
          minOrderQuantity: productInfo?.data?.minOrderQuantity,
          manufacturer: productInfo?.data?.manufacturer,
          maxOrderQuantity: productInfo?.data?.maxOrderQuantity,
          price: productInfo?.data?.salePrice?.value,
          quantity: 0,
        },
        'Buy Now',
      ),
    );
    let enteredValue = 0;
    modalInput.addEventListener('change', (event) => {
      // const selectedDiv = document.getElementById
      // (productInfo.data.lineItemId); // or any div reference
      const inputElement = document.getElementById(productInfo?.data?.lineItemId);
      const productItem = inputElement.parentElement;
      console.log('productItem', inputElement);
      enteredValue = event.target.value;
      console.log('enteredValue', enteredValue);
      if (enteredValue < Number(inputElement.min)) {
        console.log('minnn');
        productItem.style.border = '2px solid red';
        alert(
          `Please enter a valid order quantity which should be greater then ${inputElement.min} and less then ${inputElement.max}`,
        );
      } else if (enteredValue > Number(input.max)) {
        console.log('max');
        productItem.style.border = '2px solid red';
        alert(
          `Please enter a valid order quantity which should be greater then ${inputElement.min} and less then ${inputElement.max}`,
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
      console.log('item  id', item);
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
      productInfo?.data?.salePrice?.value != 0
          && result?.raw?.objecttype === 'Product'
        ? addToCart
        : '',
      rfqParent,
    );

    const priceInfoDiv = div({
      class: 'self-stretch flex flex-col justify-start items-start gap-5',
    });
    if (
      result?.raw?.objecttype === 'Product'
      || result?.raw?.objecttype === 'Bundle'
    ) {
      priceInfoDiv.append(infoTab);
      priceInfoDiv.append(shipInfo);
    }

    priceInfoDiv.append(buttonTab);
    defaultContent.append(priceInfoDiv);
    /* brandname checking and displaying buy now btn */

    const brandName = result?.raw?.opco || null;
    const showskupricelistusd = result?.raw.listpriceusd;

    const currncyFormat = Number(showskupricelistusd);

    const brandButton = document.createElement('button');
    brandButton.textContent = 'Buy Now on abcam.com';
    brandButton.classList.add(
      ...'btn-outline-trending-brand text-lg rounded-full w-full px-4 py-2'.split(
        ' ',
      ),
    );

    const brandURL = result?.raw?.externallink
      ? `${result.raw.externallink}?utm_source=dhls_website`
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

  const infoDiv = div({
    clas: '',
  });
  const globeImg = div(
    {
      class: 'w-9 h-9 relative overflow-hidden',
    },
    span({
      class:
          'icon icon-Globe-alt w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const externalLink = div(
    {
      class: 'w-9 h-9 relative overflow-hidden',
    },
    span({
      class:
          'icon icon-External-link w-9 h-9 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const externalButton = div(
    { class: 'flex cursor-pointer justify-center items-center text-base font-extralight leading-snug' },
    `To learn more visit ${result?.raw.opco} `,
    externalLink,
  );
  const clickableLink = result.raw.externallink
    ? result.raw.externallink
    : result.raw.clickableuri;
  const externalURL = `${clickableLink}?utm_source=dhls_website`;
  externalButton.addEventListener('click', () => {
    window.open(externalURL, '_blank');
  });
  const info = div(
    {
      class:
          'self-stretch inline-flex justify-start items-center gap-3 py-3 cursor-pointer',
    },
    globeImg,
    externalButton,
  );
  decorateIcons(info);
  infoDiv.prepend(info);

  const collectionButton = div(
    {
      class: 'w-9 h-9 overflow-hidden',
    },
    span({
      class:
          'icon icon-Collection w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
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
          'icon icon-chevron-down w-9 h-9 fill-current [&_svg>use]:stroke-violet-400 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const clipBoard = div(
    {
      class: 'w-9 h-9 relative overflow-hidden',
    },
    span({
      class:
          'icon icon-ClipboardList w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
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
            class: 'justify-start text-black text-base font-extralight leading-snug',
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
            'icon icon-chevron-down w-9 h-9 fill-current [&_svg>use]:stroke-violet-400 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(categoryLink);

  categoryLink.addEventListener('click', () => {
    const main = block.closest('main');
    const sections = main.querySelectorAll('.section.page-tab');
    const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));
    if (tabSections) {
      console.log('tabSections', tabSections);
      const currentTab = window.location.hash?.replace('#', '')
      || tabSections[0].getAttribute('aria-labelledby');
      console.log('current tab: ', tabSections[0].getAttribute('aria-labelledby'));
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
          class: 'w-9 h-9 relative overflow-hidden',
        },
        span({
          class:
              'icon icon-Collection w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
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
  console.log('bundle tab', bundleTab);
  decorateIcons(bundleTab);
  bundleLink.addEventListener('click', () => {
    const main = block.closest('main');
    const sections = main.querySelectorAll('.section.page-tab');
    const tabSections = [...sections].filter((section) => section.hasAttribute('data-tabname'));
    if (tabSections) {
      console.log('tabSections', tabSections);
      const currentTab = window.location.hash?.replace('#', '')
      || tabSections[0].getAttribute('aria-labelledby');
      console.log('current tab: ', tabSections[0].getAttribute('aria-labelledby'));
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
  console.log('bundle tab after', bundleTab);
  // categoryLink.addEventListener("click", () => {
  //   window.open(externalURL, "_blank");
  // });

  if (result?.raw?.objecttype === 'Family') {
    defaultContent.append(
      div(
        {
          class:
          'md:w-[692px] inline-flex justify-start items-center gap-6 flex-col',
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
          'w-full md:w-[692px] border-t border-b border-gray-300 inline-flex justify-start items-center gap-6',
        },
        infoDiv,
      ),
    );
  } else if (result?.raw?.objecttype === 'Bundle') {
    defaultContent.append(
      div(
        {
          class:
          'md:w-[692px] inline-flex justify-start items-center gap-6 flex-col',
        },
        bundleTab,
      ),
    );
    defaultContent.append(
      div(
        {
          class:
          'w-full md:w-[692px] border-t border-b border-gray-300 flex justify-start items-center gap-6',
        },
        infoDiv, // Full-width border for Bundle
      ),
    );
  } else {
    defaultContent.append(
      div(
        {
          class:
          'md:w-[692px] border-t border-b border-gray-300 inline-flex justify-start items-center',
        },
        div(
          {
            class: 'w-full inline-flex gap-6 flex-col md:flex-row',
          },
          categoryLinkSku,
          infoDiv,
        ),
      ),
    );
  }
  const categoryDiv = (category) => {
    const list = div(
      {
        class:
            'px-4 py-1 bg-violet-50 flex justify-center items-center gap-2.5 cursor-pointer',
      },
      div(
        {
          class:
              'text-center justify-start text-violet-600 text-lg leading-normal font-medium',
        },
        category,
      ),
    );
    return list;
  };

  const categoriesDiv = div({
    class: 'md:w-[692px] flex-wrap md:px-4 py-4 inline-flex justify-start items-start gap-2',
  });
  result?.raw?.categories?.forEach((category) => {
    categoriesDiv.append(categoryDiv(category));
  });

  defaultContent.append(categoriesDiv);
  block.parentElement.classList.add(...'stretch'.split(' '));
  block.innerHTML = '';
  block.append(
    div(
      { class: 'pdp-hero-content' },
      div({ class: 'hero-default-content w-full' }, defaultContent),
      verticalImageGallery,
    ),
  );
  decorateModals(block);
}
