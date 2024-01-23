import {
  a, div, h1, img, p, span, hr,
} from '../../scripts/dom-builder.js';
import { decorateModals, getProductResponse } from '../../scripts/scripts.js';

function showImage(e) {
  const selectedImage = document.querySelector('.image-content');
  if (e.target) {
    const currentActive = e.target.parentElement.querySelector('.active');
    if (currentActive) currentActive.classList.toggle('active');
    if (e.target.src !== selectedImage.src) {
      selectedImage.src = e.target.src;
      e.target.classList.toggle('active');
    }
  }
}

function loadMore() {
  const allImageContainer = document.querySelector('.vertical-gallery-container div div img.active').parentElement;
  const shownImage = allImageContainer.querySelectorAll('img:not(.hidden)');
  const notShownImage = allImageContainer.querySelectorAll('img.hidden');
  if (shownImage.length > 0) {
    if (shownImage[shownImage.length - 1].nextElementSibling && !shownImage[shownImage.length - 1].nextElementSibling.className.includes('view-more')) {
      shownImage[0].classList.add('hidden');
      shownImage[shownImage.length - 1].nextElementSibling.classList.remove('hidden');
    } else {
      // REMOVE THE LASTS FIRST-INDEXED NON-HIDDEN VALUE
      const firstNonActive = allImageContainer.querySelector('.hidden');
      firstNonActive.classList.remove('hidden');
      // HIDE THE LAST-HIDDEN-ELEMENT'S NEXT-SIBLING
      notShownImage[notShownImage.length - 1].nextElementSibling.classList.add('hidden');
    }
  }
}

function imageSlider(allImages) {
  const slideContent = div(img({ src: allImages[0], class: 'image-content', alt: 'product image' }));
  const verticalSlides = div();
  allImages.map((image, index) => {
    const imageElement = img({ src: image, alt: `product image ${index + 1}` });
    let imageClass = (index === 0) ? 'active' : '';
    if (index > 2) imageClass += ' hidden';
    if (imageClass !== '') imageElement.className = imageClass;
    imageElement.addEventListener('click', showImage);
    verticalSlides.append(imageElement);
    return image;
  });
  if (allImages.length > 1) {
    const showMore = div({ class: 'view-more' }, 'View More ->');
    showMore.addEventListener('click', loadMore);
    verticalSlides.append(showMore);
    return div({ class: 'vertical-gallery-container' }, div(slideContent, verticalSlides));
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
          img({ src: `${product.image}`, alt: `${product.title}`, class: 'w-16 h-16 rounded-md shadow-lg' }),
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

export default async function decorate(block) {
  const response = getProductResponse();
  if (response?.length > 0) {
    document.title = response[0].Title ? response[0].Title : 'Danaher Product';
    const allImages = response[0]?.raw.images;
    const verticalImageGallery = imageSlider(allImages);
    const defaultContent = div();
    defaultContent.innerHTML = response[0]?.raw.richdescription;
    defaultContent.prepend(h1({ class: 'title' }, response[0]?.Title));
    defaultContent.prepend(span({ class: 'category-name' }, response[0]?.raw?.defaultcategoryname ? response[0]?.raw?.defaultcategoryname : ''));
    const rfqEl = block.querySelector('div')?.firstElementChild;
    if (rfqEl && rfqEl.textContent && rfqEl.textContent === 'Request for Quote') {
      rfqEl.classList.add(...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
      const rfqParent = p({ class: 'show-modal-btn lg:w-55 pt-6 cursor-pointer' }, rfqEl);
      defaultContent.append(rfqParent);
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
      const bundleDetails = JSON.parse(response[0].raw?.bundlepreviewjson);
      if (bundleDetails?.length > 0) {
        defaultContent.append(addBundleDetails(response[0]?.Title, bundleDetails));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }

    defaultContent.append(
      div(
        { class: 'basic-info' },
        div(p('Brand'), p(response[0]?.raw.opco)),
        infoDiv,
      ),
    );
    block.parentElement.classList.add(...'stretch'.split(' '));
    block.innerHTML = '';
    block.append(div({ class: 'product-hero-content' }, div({ class: 'hero-default-content' }, defaultContent), verticalImageGallery));
    decorateModals(block);
  }
}
