import {
  a, div, h1, img, p, span,
} from '../../scripts/dom-builder.js';

function getCoveoApiPayload(qParam) {
  let sku = window.location.pathname.split('/')?.slice(-1);
  sku = sku.at(0).split('.').at(0);
  const payload = {
    context: {
      host: 'stage.lifesciences.danaher.com',
      internal: false,
    },
    q: `@${qParam}==${sku}`,
    pipeline: 'Product Details',
  };
  return payload;
}

async function makeCoveoApiRequest(path, accessParam, payload = {}) {
  const accessToken = window.DanaherConfig !== undefined
    ? window.DanaherConfig[accessParam]
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
  const organizationId = window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
  const resp = await fetch(`https://${organizationId}.org.coveo.com${path}?organizationId=${organizationId}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const jsonData = await resp.json();
  return jsonData;
}

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
  const allImageContainer = document.querySelector('.vertical-gallery-container div div:has(img.active)');
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
  const slideContent = div(img({ src: allImages[0], class: 'image-content' }));
  const verticalSlides = div();
  allImages.map((image, index) => {
    const imageElement = img({ src: image });
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

export default async function buildAutoBlocks() {
  makeCoveoApiRequest('/rest/search/v2', 'productKey', getCoveoApiPayload('productid')).then((productData) => {
    const allImages = productData.results[0]?.raw.images;
    const main = document.querySelector('main');
    const detailedProduct = main.querySelector('.product-details');
    const verticalImageGallery = imageSlider(allImages);
    const defaultContent = div();
    defaultContent.innerHTML = productData.results[0]?.raw.richdescription;
    defaultContent.prepend(h1({ class: 'title' }, productData.results[0]?.Title));
    defaultContent.prepend(span({ class: 'category-name' }, productData.results[0]?.raw.defaultcategoryname));
    defaultContent.append(
      div(
        { class: 'basic-info' },
        div(p('Brand'), p(productData.results[0]?.raw.opco)),
        div(p('For additional information'), a({ href: `${productData.results[0]?.raw.externallink}?utm_source=dhls_website`, target: '_blank' }, `Visit ${productData.results[0]?.raw.opco}`)),
      ),
    );
    detailedProduct.parentElement.parentElement.classList.add(...'stretch'.split(' '));
    detailedProduct.innerHTML = '';
    detailedProduct.append(div({ class: 'product-hero-content' }, div({ class: 'hero-default-content' }, defaultContent), verticalImageGallery));
  });
}
