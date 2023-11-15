import {
  a, div, h2, hr,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

async function fetchTopicsForCategory() {
  const category = getMetadata('fullcategory');
  if (!category) return [];
  const topics = await ffetch('/us/en/products-index.json')
    .filter(({ fullCategory, type }) => fullCategory === category && type === 'Topic')
    .all();
  return topics.sort((item1, item2) => item2.lastModified - item1.lastModified);
}

export default async function decorate(block) {
  const topics = await fetchTopicsForCategory();
  block.classList.add('pt-10', 'pb-10');
  block.append(hr({ class: 'h-1 bg-black' }));
  const topicCards = div({ class: 'flex flex-col items-start' });

  topics.forEach((topic) => {
    topicCards.append(div(
      {
        class: 'w-full',
      },
      div(
        {
          class: 'flex gap-3 py-9',
        },
        h2({ class: 'text-xl' }, topic.title),
        a({
          class: 'rounded-full px-6 py-3 ml-auto btn-outline-trending-brand text-base',
          href: topic.path,
        }, 'Read Topic'),
      ),
      hr(),
    ));
  });
  block.append(topicCards);
}
