import { a, article, div, h1, img, li, p, span, ul } from "../../scripts/dom-builder.js";
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function getCoveoApiPayload() {
  const sku = window.location.pathname.split('/')?.slice(-1).at(0).split('.').at(0);
  const paylod = {
      context: {
          host: 'stage.lifesciences.danaher.com',
          internal: false
      },
      q: `@productid==${sku}`,
      pipeline: 'Product Details',
  }
  return paylod;
}

async function makeCoveoApiRequest(path, payload = {}) {
  const accessToken = window.DanaherConfig !== undefined
    ? window.DanaherConfig.productKey
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
  let selectedImage = document.querySelector('.image-content');
  if (e.target) {
    let currentActive = e.target.parentElement.querySelector('.active');
    if (currentActive) currentActive.classList.toggle('active');
    if (e.target.src !== selectedImage.src) {
      selectedImage.src = e.target.src;
      e.target.classList.toggle('active');
    }
  }
}

function imageSlider(allImages) {
  const slideContent = div(img({ src: allImages[0], class: 'image-content' }));
  const verticalSlides = div()
  allImages.map((image, index) => {
    const imageElement = img({ src: image });
    if (index === 0) imageElement.classList.add('active');
    imageElement.addEventListener('click', showImage);
    verticalSlides.append(imageElement);
    return image;
  });
  return div({ class: 'vertical-gallery-container' }, div(slideContent, verticalSlides));
}

export default async function buildAutoBlocks() {
  console.log('Product Detail.js');
  makeCoveoApiRequest('/rest/search/v2', getCoveoApiPayload()).then((data) => {
    const allImages = data.results[0]?.raw.images;
    console.log(data, allImages, data.results[0]?.raw.defaultcategoryname);
    const main = document.querySelector('main');
    const detailedProduct = main.querySelector('.product-details');
    const verticalImageGallery = imageSlider(allImages);
    const defaultContent = div();
    defaultContent.innerHTML = data.results[0]?.raw.richdescription;
    defaultContent.prepend(h1({ class: 'title' }, data.results[0]?.Title));
    defaultContent.prepend(span({ class: 'category-name' }, data.results[0]?.raw.defaultcategoryname));
    defaultContent.append(
      div(
        { class: 'basic-info' }, 
        div(p('Brand'), p(data.results[0]?.raw.opco)),
        div(p('For additional information'), a({ href: `${data.results[0]?.raw.externallink}?utm_source=dhls_website`, target: '_blank' }, `Visit ${data.results[0]?.raw.opco}`))
      )
    );
    detailedProduct.parentElement.classList.add(...'w-full bg-gray-100 p-4 pb-24'.split(' '));
    detailedProduct.innerHTML = '';
    detailedProduct.append(div({ class: 'product-hero-content' }, div({ class: 'hero-default-content' }, defaultContent), verticalImageGallery));
  });
}