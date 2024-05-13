import {
  a, div, p, span, hr, h1,
} from '../../scripts/dom-builder.js';
import {
  getAuthorization, getCommerceBase,
  getProductResponse,
} from '../../scripts/commerce.js';
import { createOptimizedS7Picture, decorateModals } from '../../scripts/scripts.js';

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
  const slideImage = createOptimizedS7Picture(allImages[0], `${productName} - image`, true);
  slideImage.classList.add(...'w-[400px] h-[400px] max-w-[400px] mx-auto shadow-none md:shadow-lg object-contain transition duration-700'.split(' '));
  const slideContent = div({ class: 'image-content relative bg-white shadow-lg md:shadow-none' }, slideImage);
  const verticalSlides = div({ class: 'w-full lg:w-20 flex flex-row lg:flex-col lg:order-first gap-2 overflow-auto bg-transparent scroll-pl-6 snap-x [&>picture]:w-max [&>*.view-more]:w-[75px] [&>*.view-more]:h-[75px] [&>*.view-more]:cursor-pointer [&>*>img]:w-[75px] [&>*>img]:h-[75px] [&>*>img]:cursor-pointer [&>*.active>img]:opacity-80 [&>*.active>img]:border-2 [&>*.active>img]:border-danaherpurple-500' });
  allImages.map((image, index) => {
    const imageElement = createOptimizedS7Picture(image, `${productName} - image ${index + 1}`, false);
    let imageClass = (index === 0) ? 'active' : '';
    if (index > 2) imageClass += ' hidden';
    if (imageClass !== '') imageElement.className = imageClass.trim();
    imageElement.addEventListener('click', showImage);
    imageElement.classList.add(...'object-cover transition duration-500 hover:border hover:border-danaherpurple-500'.split(' '));
    verticalSlides.append(imageElement);
    return image;
  });
  if (allImages.length > 3) {
    const showMore = div({ class: 'view-more flex flex-col leading-tight text-danaherpurple-500 text-sm font-semibold px-3 py-2 hover:border hover:border-danaherpurple-500 bg-white' }, 'View More');
    showMore.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4" viewBox="0 0 12 12">
      <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
    </svg>`;
    showMore.addEventListener('click', loadMore);
    verticalSlides.append(showMore);
  }
  return div(
    { class: 'vertical-gallery-container shrink-0 order-first' },
    div(
      { class: 'flex flex-col lg:flex-row gap-3 bg-transparent overflow-hidden' },
      slideContent,
      verticalSlides,
    ),
  );
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
  titleEl?.classList.add('title');
  titleEl?.parentElement.parentElement.remove();
  const response = await getProductResponse();
  if (response?.length > 0) {
    document.title = response[0].Title ? response[0].Title : 'Danaher Product';
    const allImages = response[0]?.raw.images;
    const verticalImageGallery = imageSlider(allImages, response[0]?.Title);
    const defaultContent = div({ class: 'w-full h-full text-left' });
    defaultContent.innerHTML = response[0]?.raw.richdescription;
    defaultContent.prepend(span({ class: 'sku hidden' }, response[0]?.raw.productid));
    defaultContent.prepend(titleEl || h1({ class: 'title mt-3 mb-3 text-gray-900 mb-3' }, response[0]?.Title));
    defaultContent.prepend(span({ class: 'categories hidden' }, response[0]?.raw.categories));
    defaultContent.prepend(span({ class: 'category-name text-sm font-normal leading-5 text-danaherpurple-500' }, response[0]?.raw?.defaultcategoryname ? response[0]?.raw?.defaultcategoryname : ''));
    const rfqEl = block.querySelector(':scope > div:nth-child(1)');
    if (rfqEl && rfqEl.textContent.includes('Request for Quote')) {
      let rfqParent;
      rfqEl.classList.add(...'btn-outline-trending-brand text-center text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
      if (response[0]?.raw?.objecttype === 'Product' || response[0]?.raw?.objecttype === 'Bundle') {
        rfqParent = p({ class: 'lg:w-55 pt-6 cursor-pointer' }, rfqEl);
        rfqParent.addEventListener('click', () => { addToQuote(response[0]); });
      } else {
        rfqParent = p({ class: 'show-modal-btn lg:w-55 pt-6 cursor-pointer' }, rfqEl);
      }
      defaultContent.append(rfqParent);
    }

    const infoDiv = div();
    if (response[0]?.raw.externallink !== undefined) {
      infoDiv.prepend(
        p('For additional information'),
        a(
          { class: 'border-b-2 border-danaherpurple-500', href: `${response[0]?.raw.externallink}?utm_source=dhls_website`, target: '_blank' },
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
        { class: 'basic-info flex justify-between mt-8' },
        div(p({ class: 'text-base font-bold' }, 'Brand'), p({ class: 'brand' }, response[0]?.raw.opco)),
        infoDiv,
      ),
    );
    block.parentElement.classList.add(...'stretch'.split(' '));
    block.innerHTML = '';
    block.classList.add('p-4');
    block.append(
      div(
        { class: 'product-hero-content flex flex-col md:flex-row lg:gap-16 md:gap-12 gap-2' },
        div({ class: 'hero-default-content md:col-span-6 w-full' }, defaultContent),
        verticalImageGallery,
      ),
    );
    block.querySelectorAll('.hero-default-content > div h4').forEach((h4El) => {
      h4El.classList.add('font-bold');
    });
    block.querySelectorAll('.hero-default-content > div ul').forEach((ulEl) => {
      ulEl.classList.add(...'text-base list-disc ml-12 mt-3'.split(' '));
    });
    block.querySelectorAll('.hero-default-content > div p').forEach((pEl) => {
      pEl.classList.add('text-base');
    });
    block.querySelectorAll('.hero-default-content > div ul li').forEach((liEl) => {
      liEl.classList.add('mb-2.5');
    });
    decorateModals(block);
  }
}
