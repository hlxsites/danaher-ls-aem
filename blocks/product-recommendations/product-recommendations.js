import { getProductRecommendationsResponse, onClickProductRecomnsResponse } from '../../scripts/commerce.js';
import {
  ul, a, p, div, span, h4, li, h3, button,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import Carousel from '../../scripts/carousel.js';

function createCard(product, idx, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title, index: idx + 1 },
    imageHelper(product.image, product.title, firstCard),
    h3(
      { class: '!px-7 !text-sm !font-normal !leading-5 !text-danaherpurple-500' },
      product.categoriesName,
    ),
    h4(
      { class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14' },
      product.title,
    ),
    p({ class: '!px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20' }, product.description),
    div(
      { class: 'inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100' },
      span({ class: 'btn-primary-purple border-8 px-2 !rounded-full' }, 'View'),
    ),
  );
  return li({ class: 'carousel-slider w-full flex flex-col relative mx-auto justify-center transform transition duration-500 border shadow-lg rounded-lg overflow-hidden bg-white max-w-xl' }, cardWrapper);
}

export default async function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  try {
    const response = await getProductRecommendationsResponse();
    if (response?.results.length > 0) {
      const cardList = ul({ class: 'carousel auto-cols-[calc(100%)] md:auto-cols-[calc(100%/2)] lg:auto-cols-[calc((100%/3)-20px)] xl:auto-cols-[calc((100%/4)-20px)] pb-2' });
      response.results.forEach((product, productIndex) => {
        product.path = product.clickUri;
        product.image = product?.raw?.images[0];
        product.description = product?.raw?.description;
        const categoriesName = [];
        product?.raw?.categoriesname.forEach((element) => {
          if (!element.includes('|')) {
            categoriesName.push(element);
          }
        });
        product.categoriesName = categoriesName;
        cardList.append(createCard(product, productIndex, productIndex === 0));
      });
      const previousAction = button({ type: 'button', class: 'text-danaherpurple-500', id: `previous-${uuid}-workflow` }, span({ class: 'icon icon-round-arrow-left' }));
      const nextAction = button({ type: 'button', class: 'text-danaherpurple-500', id: `next-${uuid}-workflow` }, span({ class: 'icon icon-round-arrow-right' }));
      const navigateActions = div(
        { class: 'flex justify-between items-center mt-12' },
        div(
          { class: 'inline-flex gap-x-4 text-base font-bold' },
          'Frequently Viewed Together',
        ),
        div(
          { class: 'inline-flex gap-x-4' },
          previousAction,
          nextAction,
        ),
      );
      decorateIcons(navigateActions);
      block.innerHTML = '';
      block.append(navigateActions, cardList);
      block.setAttribute('id', uuid);
      block.classList.add('space-y-3');
      const ulEl = block.querySelector('ul');
      ulEl.querySelectorAll('li').forEach((item) => {
        item.querySelector('a').addEventListener('click', (e) => {
          e.preventDefault();
          const clickUri = item.querySelector('a').href;
          const idx = item.querySelector('a').getAttribute('index');
          onClickProductRecomnsResponse(clickUri.split('/').pop(), idx);
          setTimeout(() => {
            window.location = clickUri;
          }, 1000);
        });
      });
      setTimeout(() => {
        /* eslint-disable no-new */
        new Carousel({
          wrapperEl: uuid,
          mainEl: '.carousel',
          delay: 2000,
          isAutoPlay: false,
          previousElAction: `button#previous-${uuid}-workflow`,
          nextElAction: `button#next-${uuid}-workflow`,
        });
      }, 3000);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
