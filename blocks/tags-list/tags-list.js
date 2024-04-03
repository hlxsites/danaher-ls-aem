/* eslint-disable no-script-url */
import {
  a, div, hr, li, p, span, ul,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { createFilters } from '../card-list/card-list.js';

export default async function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  const articleTopics = getMetadata('topics')?.toLowerCase();
  const url = new URL(getMetadata('og:url'));
  let articles = await ffetch('/us/en/article-index.json')
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter(({ topics }) => topics.toLowerCase() === articleTopics)
    .filter((article) => url.pathname === article.path)
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
      li(a({ href: 'javascript:window.open("//www.linkedin.com/shareArticle?mini=true&url=" + location.href + "&title=" + document.title)' }, span({ class: 'icon icon-linkedin-circle' }))),
      li(a({ href: 'javascript:window.open(\'//twitter.com/intent/tweet?\' + location.href + \'&title=\' + encodeURI(document.title))' }, span({ class: 'icon icon-twitter-circle' }))),
      li(a({ href: 'javascript:window.open(\'//www.facebook.com/sharer/sharer.php?\' + location.href + \'&title=\' + encodeURI(document.title))' }, span({ class: 'icon icon-facebook-circle' }))),
      li(a({ href: 'javascript:window.open(\'mailto:?subject=&body=\' + encodeURIComponent(window.location))' }, span({ class: 'icon icon-email-circle' }))),
      li(a({ href: 'javascript:navigator.clipboard.writeText(window.location.href);' }, span({ class: 'icon icon-clipboard-share-circle' }))),
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
  block.prepend(hr({ class: 'mt-10 border-gray-300' }));
  block.append(hr({ class: 'my-10 border-gray-300' }));
  decorateIcons(block);
}
