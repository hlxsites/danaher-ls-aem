import {
  div,
  span,
  input,
  button,
  a,
} from '../../scripts/dom-builder.js';
import {
  getProductDetails,
} from '../../scripts/commerce.js';
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

export default async function decorate(block) {
  block.parentElement.parentElement.style.padding = '0';
  const titleEl = block.querySelector('h1');
  // const h1Value = getMetadata('h1');
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();
  const result = JSON.parse(localStorage.getItem('eds-product-details'));

  const productInfo = await getProductDetails(result?.raw?.sku);
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
        class: ' flex flex-col justify-start items-start',
      },
      div(
        {
          class: 'justify-start text-gray-700 text-base font-extralight leading-snug',
        },
        result?.raw?.objecttype === 'Product'
      || result?.raw?.objecttype === 'Bundle' ? productInfo?.data?.sku : '',
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

  const quoteButton = button(
    {
      class:
              'show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
    },
    div(
      {
        class: 'inherit text-base font-medium leading-snug',
      },
      'Request a Quote',
    ),
  );

  const infoTab = div(
    {
      class: 'self-stretch md:flex justify-start items-center gap-9',
    },
    div(
      {
        class: 'justify-start text-black text-4xl font-normal md:block',
      },
      `$${productInfo?.data?.salePrice?.value}`,
    ),
    div(
      {
        class: 'flex-1 py-3 flex justify-start items-start',
      },

      div({
        class: 'w-12 h-0 hidden md:block flex-grow-0 mt-[26px] rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
      }),
      div(
        {
          class: 'w-28 inline-flex flex-col justify-center items-start gap-2',
        },
        div(
          {
            class: 'w-28 justify-start text-black text-base font-extralight',
          },
          'Unit of Measure',
        ),
        div(
          {
            class: 'text-right justify-start text-black text-base font-bold',
          },
          productInfo?.data?.packingUnit ? `${productInfo.data.packingUnit} /Bundle` : '-',
        ),
      ),
      div({
        class: 'w-12 h-0 flex-grow-0 mt-[26px] rotate-90 outline outline-1 outline-offset-[-0.50px] outline-gray-300',
      }),
      div(
        {
          class: 'w-28 inline-flex flex-col justify-center items-start gap-2',
        },
        div(
          {
            class: 'w-28 justify-start text-black text-base font-extralight',
          },
          'Min. Order Qty',
        ),
        div(
          {
            class: 'text-right justify-start text-black text-base font-bold',
          },
          productInfo?.data?.minOrderQuantity || '',
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

  const pricingQuoteButton = div(
    {
      class:
              'inline-flex justify-start items-center gap-3',
    },
    input({
      type: 'number',
      value: '1',
      min: '1',
      class:
              'w-14 self-stretch py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-medium leading-normal text-center [&::-webkit-inner-spin-button]:mr-2',
    }),
    a(
      {
        class:
                'px-5 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 text-white rounded-[20px] flex justify-center items-center overflow-hidden',
      },
      span(
        {
          class: 'inherit text-base font-medium leading-snug',
        },
        'Buy Now',
      ),
    ),
    div(
      {
        class:
                'show-modal-btn cursor-pointer px-5 py-2 text-danaherpurple-500 hover:text-white bg-white hover:bg-danaherpurple-500 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
      },
      span(
        {
          class: 'inherit text-base font-medium leading-snug',
        },
        'Request a Quote',
      ),
    ),
  );

  const priceInfoDiv = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-5',
  });
  priceInfoDiv.append(infoTab, shipInfo);

  if (
    result?.raw?.objecttype === 'Product'
      || result?.raw?.objecttype === 'Bundle'
  ) {
    defaultContent.append(priceInfoDiv);
  }

  if (result?.raw?.objecttype === 'Bundle' || result?.raw?.objecttype === 'Family') {
    priceInfoDiv.append(quoteButton);
  }
  if (
    result?.raw?.objecttype === 'Family'
  ) {
    defaultContent.append(quoteButton);
  }

  if (result?.raw?.objecttype === 'Product') {
    priceInfoDiv.append(pricingQuoteButton);
  }

  // const brandButton = document.createElement('button');
  // brandButton.textContent = 'Buy Now on abcam.com';
  // brandButton.classList.add(
  //   ...'btn-outline-trending-brand text-lg rounded-full w-full px-4 py-2'.split(
  //     ' ',
  //   ),
  // );

  // const brandURL = result?.raw?.externallink
  //   ? `${result.raw.externallink}?utm_source=dhls_website`
  //   : null;
  // brandButton.addEventListener('click', () => {
  //   window.open(brandURL, '_blank');
  // });
  const infoDiv = div({
    class: '',
  });
  const globeImg = div(
    {
      class: 'w-9 h-9 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
          'icon icon-Globe-alt w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const externalLink = div(
    {
      class: 'w-9 h-9 relative flex items-center justify-center overflow-hidden cursor-pointer',
    },
    span({
      class:
          'icon icon-External-link w-9 h-9 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const externalButton = div(
    { class: 'flex justify-center items-center text-base font-extralight leading-snug gap-3 hover:text-danaherpurple-800' },
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
  globeImg.addEventListener('click', () => {
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

  decorateModals(quoteButton);

  const collectionButton = div(
    {
      class: 'w-9 h-9',
    },
    span({
      class:
          'icon icon-Collection w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const categoryLink = div(
    {
      class: 'w-full inline-flex flex-col group',
    },
    div(
      {
        class:
            'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
      },
      collectionButton,
      div(
        {
          class: 'w-full inline-flex flex-col',
        },
        div(
          {
            class: 'justify-start text-black text-base font-extralight leading-snug',
          },
          'See all product Family in this line',
        ),
        div(
          {
            class: 'w-56 h-[1rem] mt-[-10px]',
          },
          span({
            class:
            'icon icon-Rectangle w-full h-[1rem] fill-current [&_svg>use]:stroke-violet-4600 group-hover:[&_svg>use]:stroke-danaherpurple-800',
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
        'icon icon-chevron-down w-9 h-9 fill-current [&_svg>use]:stroke-violet-400 group-hover:[&_svg>use]:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(categoryLink);

  categoryLink.addEventListener('click', () => {
    const main = block.closest('main');
    const productTab = main.querySelector('#products-tab');
    if (productTab) {
      productTab.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const categoryLinkSku = div(
    {
      class: 'inline-flex flex-col justify-start py-3',
    },
    div(
      {
        class:
            'self-stretch inline-flex justify-start items-center gap-3 cursor-pointer',
      },
      div(
        {
          class: 'w-9 h-9 relative',
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

  const clipBoard = div(
    {
      class: 'w-9 h-9 relative',
    },
    span({
      class: 'icon icon-ClipboardList w-9 h-9 fill-current [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const bundleLink = div(
    {
      class: 'w-full inline-flex flex-col group',
    },
    div(
      {
        class:
        'self-stretch inline-flex justify-start gap-3 cursor-pointer',
      },
      clipBoard,
      div(
        {
          class: 'w-full inline-flex flex-col',
        },
        div(
          {
            class: 'justify-start text-black text-base',
          },
          'See all items in this bundle',
        ),
        div(
          {
            class: 'w-[190px] h-[1rem] mt-[-10px]',
          },
          span({
            class:
            'icon icon-Rectangle w-full h-[1rem] fill-current [&_svg>use]:stroke-violet-4600 group-hover:[&_svg>use]:stroke-danaherpurple-800',
          }),
        ),

        div(
          {
            class: 'w-[190px] inline-flex justify-center items-center',
          },
          span({
            class:
        'icon icon-chevron-down w-9 h-9 fill-current [&_svg>use]:stroke-violet-400 group-hover:[&_svg>use]:stroke-danaherpurple-800',
          }),
        ),
      ),
    ),
  );

  // decorateIcons(bundleLink);
  const bundleTab = div(
    {
      class: 'w-full inline-flex gap-6 flex-col md:flex-row',
    },
    result?.raw?.objecttype === 'Bundle' ? bundleLink : categoryLink,

  );
  decorateIcons(bundleTab);
  bundleLink.addEventListener('click', () => {
    const main = block.closest('main');
    const bundleTabList = main.querySelector('#bundle-list-tab');
    if (bundleTabList) {
      bundleTabList.scrollIntoView({ behavior: 'smooth' });
    }
  });

  if (result?.raw?.objecttype === 'Family') {
    defaultContent.append(
      div(
        {
          class:
          ' inline-flex justify-start items-center gap-6 flex-col',
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
          'w-full  border-t border-b border-gray-300 inline-flex justify-start items-center gap-6',
        },
        infoDiv,
      ),
    );
  } else if (result?.raw?.objecttype === 'Bundle') {
    defaultContent.append(
      div(
        {
          class:
          ' inline-flex justify-start items-center gap-6 flex-col',
        },
        bundleTab,
      ),
    );
    defaultContent.append(
      div(
        {
          class:
          'w-full  border-t border-b border-gray-300 flex justify-start items-center gap-6',
        },
        infoDiv, // Full-width border for Bundle
      ),
    );
  } else {
    defaultContent.append(
      div(
        {
          class:
          'w-full border-t border-b border-gray-300 inline-flex justify-start items-center',
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
    class: ' flex-wrap py-4 inline-flex justify-start items-start gap-2',
  });
  result?.raw?.categoriesname?.forEach((category) => {
    // If category contains '|', split and use the last part
    const lastLevel = category.includes('|') ? category.split('|').pop().trim() : category;
    categoriesDiv.append(categoryDiv(lastLevel));
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
