import {
  a, div, h2, hr,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { makePublicUrl } from '../../scripts/scripts.js';

export async function fetchTopicsForCategory(category) {
  if (!category) return [];
  const topics = await ffetch('/us/en/products-index.json')
    .filter(({ fullCategory, type }) => fullCategory === category && type === 'Topic')
    .all();
  return topics.sort((item1, item2) => item1.title.localeCompare(item2.title));
}

export default async function decorate(block) {
  const category = getMetadata('fullcategory');
  const topics = await fetchTopicsForCategory(category);
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
          class: 'flex items-center gap-3 py-9',
        },
        h2({ class: 'text-xl' }, topic.title),
        div(
          {
            class: 'flex min-w-[40%] md:min-w-[20%] ml-auto',
          },
          a({
            class: 'rounded-full px-6 py-3 ml-auto btn-outline-trending-brand text-base',
            href: makePublicUrl(topic.path),
          }, 'Read Topic'),
        ),
      ),
      hr(),
    ));
  });
  block.append(topicCards);
}
