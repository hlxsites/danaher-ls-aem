import { a, div } from '../../scripts/dom-builder.js';
import { makePublicUrl } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainWrapper = document.querySelector('main');
  const tagsListEl = mainWrapper.querySelector('.tags-list');
  tagsListEl.removeChild(tagsListEl.querySelector('div'));
  const divEl = div({ class: 'flex items-center justify-between' });
  const tagsLinks = div({ class: 'font-bold text-normal text-gray-700 mb-4' }, 'Tags');
  const tags = div(
    { class: 'flex flex-wrap gap-2 mb-4' },
    a({ class: 'text-center my-2 inline-block rounded-full px-4 py-1 font-semibold bg-d text-danaherpurple-500 bg-danaherpurple-50 hover:bg-white hover:text-danaherpurple-500 border hover:border-danaherpurple-500', href: makePublicUrl('/us/en/blog') }, 'View All'),
  );
  divEl.append(tagsLinks);
  divEl.append(tags);

  const socialLinks = div({ class: 'font-bold text-normal text-gray-700 mb-4' }, 'Share');
  divEl.append(socialLinks);

  block.prepend(divEl);
  block.append(document.createElement('hr'));
}
