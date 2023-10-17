import ffetch from '../../scripts/ffetch.js';
import {
    ul, li, a, p, span
  } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
    let blogs = await ffetch('/us/en/query-index.json')
    .all();

    blogs = blogs.sort((a, b) => b.publishDate - a.publishDate).slice(0, 7);

    const ulEl = ul({class: 'article-summary-body space-y-2 px-2'});
    blogs.forEach((blog) => {
        const liEl = li({ class: 'mb-0.5 py-4 px-1.5 border-b border-dashed rounded transition transform hover:bg-gray-50 hover:scale-95'},
            a({class: 'text-xs text-danaherblue-600', href: blog.path},
                p({class: 'text-sm font-medium text-danahergray-500 pb-2'}, blog.title),
                p({class: 'flex justify-between items-center'},
                    span({class: 'text-xs text-danahergray-500'}),
                    span({class: 'flex items-center text-xs font-bold text-danaherblue-600', id: 'read-article'}, 'Read Article')
                ),
            ),
        )
        liEl.querySelector('#read-article').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-4 h-4 ml-0.5" data-di-res-id="e64c7d67-741d6760" data-di-rand="1697538734744">
        <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd"></path>
        </svg>`;
        ulEl.append(liEl);
    })
    block.append(ulEl);
    console.log(blogs);
}