import {
  a, div, h1, img, p, span,
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
  const showMore = div({ class: 'view-more' }, 'View More ->');
  showMore.addEventListener('click', loadMore);
  verticalSlides.append(showMore);
  return div({ class: 'vertical-gallery-container' }, div(slideContent, verticalSlides));
}

export default async function decorate(block) {
  const response = getProductResponse();
  if (response?.length > 0) {
    document.title =  response[0]?.Title;
    const allImages = response[0]?.raw.images;
    const verticalImageGallery = imageSlider(allImages);
    const defaultContent = div();
    defaultContent.innerHTML = response[0]?.raw.richdescription;
    defaultContent.prepend(h1({ class: 'title' }, response[0]?.Title));
    defaultContent.prepend(span({ class: 'category-name' }, response[0]?.raw.defaultcategoryname));
    const rfqEl = block.querySelector('div')?.firstElementChild;
    if (rfqEl && rfqEl.textContent && rfqEl.textContent === 'Request for Quote') {
      rfqEl.classList.add(...'btn-outline-trending-brand text-lg rounded-full px-4 py-2 !no-underline'.split(' '));
      const rfqParent = p({ class: 'show-modal-btn w-[36%] pt-6 cursor-pointer' }, rfqEl);
      defaultContent.append(rfqParent);
    }
    defaultContent.append(
      div(
        { class: 'basic-info' },
        div(p('Brand'), p(response[0]?.raw.opco)),
        div(p('For additional information'), a({ href: `${response[0]?.raw.externallink}?utm_source=dhls_website`, target: '_blank' }, `Visit ${response[0]?.raw.opco}`)),
      ),
    );
    block.parentElement.classList.add(...'stretch'.split(' '));
    block.innerHTML = '';
    block.append(div({ class: 'product-hero-content' }, div({ class: 'hero-default-content' }, defaultContent), verticalImageGallery));
    decorateModals(block);
  }
}
