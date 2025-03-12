/* eslint-disable no-script-url */
import {
  a, div, li, p, span, ul,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { createFilters } from '../card-list/card-list.js';
import { getEdgeDeliveryPath } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  const articleTopics = getMetadata('topics')?.toLowerCase();
  const url = new URL(getMetadata('og:url'), window.location.origin);
  const path = getEdgeDeliveryPath(url.pathname);
  let articles = await ffetch('/us/en/article-index.json')
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter(({ topics }) => topics.toLowerCase() === articleTopics)
    .filter((article) => path === article.path)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 1);
  const filteredTags = createFilters(articles);
  const divEl = block.querySelector('div');
  divEl.classList.add(...'flex flex-col md:flex-row md:justify-between pt-0'.split(' '));
  divEl.innerHTML = '';
  const socialLinksDiv = div({ class: 'space-y-2' });
  socialLinksDiv.prepend(
    p({ class: 'text-base font-bold' }, 'Share'),
    ul(
      { class: 'flex gap-x-2' },
      li(a({ onclick: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(document.title)}`) }, span({ class: 'icon icon-linkedin-circle' }))),
      li(a({ onclick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(document.title)}`) }, span({ class: 'icon icon-twitter-circle' }))),
      li(a({ onclick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`) }, span({ class: 'icon icon-facebook-circle' }))),
      li(a({ onclick: () => window.open(`mailto:?subject=&body=${encodeURIComponent(window.location)}`) }, span({ class: 'icon icon-email-circle' }))),
      li(a({ onclick: () => navigator.clipboard.writeText(window.location.href) }, span({ class: 'icon icon-clipboard-share-circle' }))),
    ),
  );

  divEl.append(
    div(
      { class: 'space-y-2' },
      p({ class: 'text-base font-bold' }, 'Tags'),
      p({ class: 'text-base font-bold' }, filteredTags),
    ),
    socialLinksDiv,
  );

  block.prepend(divEl);
  decorateIcons(block);
}
