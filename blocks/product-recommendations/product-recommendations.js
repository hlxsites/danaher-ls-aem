import { getProductRecommendationsResponse, onClickProductRecomnsResponse } from '../../scripts/commerce.js';
import {
  ul, div, span, button,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import Carousel from '../../scripts/carousel.js';
import { createCard } from '../product-card/product-card.js';

function createProdRecommendsCard(product, idx, firstCard = false) {
  const card = createCard(product, idx, firstCard);
  card?.classList.remove('hover:scale-105');
  card?.classList.add('carousel-slider');
  return card;
}

export default async function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  try {
    const response = await getProductRecommendationsResponse();
    if (response?.results.length > 0) {
      const cardList = ul({ class: 'carousel grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 rounded-md scroll-smooth auto-cols-[calc(100%)] md:auto-cols-[calc(100%/2)] lg:auto-cols-[calc((100%/3)-20px)] xl:auto-cols-[calc((100%/4)-20px)] pb-2' });
      response.results.forEach((product, productIndex) => {
        product.path = product.clickUri;
        product.image = product?.raw?.images[0];
        product.description = product?.raw?.description;
        const categoriesName = [];
        product?.raw?.categoriesname?.forEach((element) => {
          if (!element.includes('|')) {
            categoriesName.push(element);
          }
        });
        product.categoriesName = categoriesName;
        cardList.append(createProdRecommendsCard(product, productIndex, productIndex === 0));
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
      cardList.style = 'overflow: hidden;';
      block.append(navigateActions, cardList);
      block.setAttribute('id', uuid);
      block.classList.add('space-y-3');
      const ulEl = block.querySelector('ul');
      ulEl.querySelectorAll('li').forEach((item) => {
        item.querySelector('a').addEventListener('click', (e) => {
          e.preventDefault();
          const clickUri = item.querySelector('a').href;
          const idx = item.querySelector('a').getAttribute('index');
          onClickProductRecomnsResponse(idx);
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
