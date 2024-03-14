import {
  a, div, hr, p, span,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { createFilters } from '../card-list/card-list.js';

export default async function decorate(block) {
  const mainWrapper = document.querySelector('main');
  const tagsListEl = mainWrapper.querySelector('.tags-list');
  tagsListEl.removeChild(tagsListEl.querySelector('div'));

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
  const divEl = div({ class: 'flex justify-between pt-0' });
  const socialLinksDiv = div({ class: 'ml-12' });
  socialLinksDiv.prepend(
    p({ class: 'text-base font-bold ml-4' }, 'Share'),
    div(
      { class: 'flex flex-row' },
      p({ class: 'ml-3' }, a({ href: 'javascript:void(0)' }, span({ class: 'icon icon-facebook-circle' }))),
      p({ class: 'ml-3' }, a({ href: 'javascript:window.open(\'//twitter.com/intent/tweet?\' + location.href + \'&title=\' + encodeURI(document.title))' }, span({ class: 'icon icon-twitter-circle' }))),
      p({ class: 'ml-3' }, a({ href: 'javascript:window.open("//www.linkedin.com/shareArticle?mini=true&url=" + location.href + "&title=" + document.title)' }, span({ class: 'icon icon-linkedin-circle' }))),
      p({ class: 'ml-3' }, a({ href: 'javascript:void(0)' }, span({ class: 'icon icon-email-circle' }))),
      p({ class: 'ml-3' }, a({ href: 'javascript:void(0)' }, span({ class: 'icon icon-clipboard-circle' }))),
    ),
  );
  divEl.append(
    div(
      { class: 'mr-28' },
      p({ class: 'text-base font-bold' }, 'Tags'),
      p({ class: 'text-base font-bold' }, filteredTags),
    ),
    socialLinksDiv,
  );

  block.prepend(divEl);
  block.prepend(hr({ class: 'mt-10 border-gray-300' }));
  block.append(hr({ class: 'mb-10 border-gray-300' }));
  decorateIcons(block);
}
