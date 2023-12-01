import {
  a, div,
} from '../../scripts/dom-builder.js';
import { toClassName } from '../../scripts/lib-franklin.js';

const createFilters = (items, activeTag) => {
  // collect tag filters
  const allTags = items.map((item) => item.brand.replace(/,\s*/g, ',').split(','));
  const filterTags = new Set([].concat(...allTags));
  filterTags.delete('');

  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('tag');
  newUrl.searchParams.delete('page');
  const tags = div(
    { class: 'flex flex-wrap gap-2 mt-10 mb-4' },
    a(
      {
        class:
            'text-center my-2 inline-block rounded-full px-4 py-1 text-sm font-bold bg-d text-danaherpurple-500 bg-danaherpurple-50 hover:bg-gray-100 hover:text-gray-500',
        href: newUrl.toString(),
      },
      'View All',
    ),
  );
  [...filterTags].sort().forEach((tag) => {
    newUrl.searchParams.set('tag', toClassName(tag).toLowerCase());
    const tagAnchor = a(
      {
        class:
            'text-center my-2 inline-block rounded-full px-4 py-1 text-sm font-bold bg-d hover:bg-gray-100 hover:text-gray-500',
        href: newUrl.toString(),
      },
      tag,
    );
    if (toClassName(tag).toLowerCase() === activeTag) {
      tagAnchor.classList.add('bg-danaherpurple-500', 'text-white');
      tagAnchor.setAttribute('aria-current', 'tag');
    } else {
      tagAnchor.classList.add('text-danaherpurple-500', 'bg-danaherpurple-50');
    }
    tags.append(tagAnchor);
  });
  return tags;
};
export default createFilters;
