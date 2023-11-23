import ffetch from '../../scripts/ffetch.js';
import {
  div, ul, li, a, p, span,
} from '../../scripts/dom-builder.js';
import { formatDateUTCSeconds, makePublicUrl } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  if (block.parentElement.parentElement.className.includes('recent-articles-container')) block.parentElement.parentElement.classList.add(...'hidden lg:block bg-danaherpurple-25 space-y-4 !py-28'.split(' '));
  if (block.className.includes('recent-articles')) block.classList.add(...'md:w-80 lg:w-80 flex-shrink-0 bg-danaherpurple-25'.split(' '));
  const articleType = getMetadata('template').toLowerCase();
  const url = new URL(getMetadata('og:url'));
  let articles = await ffetch('/us/en/article-index.json')
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter((article) => url.pathname !== article.path)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 6);
  block.innerHTML = '';
  const divEl = div(
    { class: 'article-summary-heading flex justify-between items-center px-4 pt-0 pb-4' },
    div({ class: 'text-xl leading-7 font-bold text-gray-900' }, 'Recent Articles'),
    a({ class: 'text-sm leading-5 !font-normal text-danaherpurple-500', href: makePublicUrl(`/us/en/${articleType}`) }, 'View All'),
  );
  block.append(divEl);

  const ulEl = ul({ class: 'article-summary-body px-2 divide-y' });
  articles.forEach((article) => {
    const liEl = li(
      { class: 'recent-articles-item py-2' },
      a(
        { class: 'block text-xs p-1.5 text-danaherblue-600 rounded transition-transform hover:bg-danaherpurple-50 hover:scale-[.99] hover:font-bold', href: makePublicUrl(article.path) },
        p({ class: 'text-sm font-medium text-danahergray-500 pb-2 my-0' }, article.title),
        p(
          { class: 'flex justify-between items-cente my-0' },
          span({ class: 'text-sm text-gray-700 font-normal' }, (articleType !== 'library' && articleType !== 'info') ? formatDateUTCSeconds(article.publishDate) : ''),
          span({ class: 'flex items-right text-xs font-semibold text-danaherblue-600', id: 'read-article' }),
        ),
      ),
    );
    liEl.querySelector('#read-article').innerHTML = `<span class='text-sm font-medium text-danaherpurple-500'>Read Article</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-4 h-4 ml-0.5" data-di-res-id="e64c7d67-741d6760" data-di-rand="1697538734744">
        <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd"></path>
        </svg>`;
    ulEl.append(liEl);
  });
  block.append(ulEl);
}
