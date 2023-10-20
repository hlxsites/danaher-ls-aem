import ffetch from '../../scripts/ffetch.js';
import {
  div, ul, li, a, p, span,
} from '../../scripts/dom-builder.js';
import { formatDateUTCSeconds, makePublicUrl } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const title = getMetadata('og:title');
  let blogs = await ffetch('/us/en/query-index.json')
    .filter((blog) => title !== blog.title)
    .all();

  blogs = blogs.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 6);
  block.innerHTML = '';
  const divEl = div(
    { class: 'article-summary-heading' },
    div({ class: 'text-xl leading-7 font-bold text-gray-900' }, 'Recent Articles'),
    a({ class: 'text-sm leading-5 font-normal text-danaherpurple-500', href: '/us/en/blog' }, 'View All'),
  );
  block.append(divEl);

  const ulEl = ul({ class: 'article-summary-body px-2 divide-y' });
  console.log(blogs);
  blogs.forEach((blog) => {
    const liEl = li(
      { class: 'recent-articles-item' },
      a(
        { href: makePublicUrl(blog.path) },
        p({ class: 'text-sm font-medium text-danahergray-500 pb-2' }, blog.title),
        p(
          { class: 'flex justify-between items-center' },
          span({ class: 'text-sm text-gray-700 font-normal' }, formatDateUTCSeconds(blog.publishDate)),
          span({ class: 'flex items-center text-xs font-bold text-danaherblue-600', id: 'read-article' }),
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
