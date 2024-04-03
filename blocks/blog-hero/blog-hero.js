import {
  div, input, span, img,
} from '../../scripts/dom-builder.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  if (block.querySelector('h1')) block.querySelector('h1').classList.add(...'px-2 text-gray-900 my-2'.split(' '));
  if (block.querySelector('h1 + p')) block.querySelector('h1 + p').classList.add(...'px-2 text-xl text-gray-500 leading-8'.split(' '));
  if (block.querySelector('img')) block.querySelector('img').classList.add(...'px-2 mt-8'.split(' '));

  const authorName = getMetadata('authorname');
  const authorJobTitle = getMetadata('authortitle');
  const publishDate = getMetadata('publishdate');
  const readingTime = getMetadata('readingtime');
  const authorImage = getMetadata('authorimage');
  const expectedPublishFormat = new Date(publishDate);

  block.append(
    div(
      { class: 'articleinfo' },
      div(
        { class: 'max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-20 mt-4 mb-2' },
        div(
          { class: 'items-center flex justify-start w-full ml-2 col-span-2' },
          div(
            { class: 'space-y-1 text-lg leading-6' },
            div({ class: 'text-danaherblack-500 font-medium' }, authorName),
            div({ class: 'text-sm text-danaherpurple-800 w-full' }, authorJobTitle),
          ),
        ),
        div(
          { class: 'items-center flex justify-start col-span-1 ml-4 my-4' },
          div({ class: 'reading-icon' }),
          div(
            { class: 'text-sm text-danahergray-500 pl-1' },
            span({ id: 'timetoread' }, `${readingTime} Mins`),
          ),
        ),
        div(
          { class: 'w-max items-center flex justify-end col-span-1 text-sm mr-4 text-danahergray-500' },
          `${expectedPublishFormat.getDate()} ${expectedPublishFormat.toLocaleString('default', { month: 'long' })}, ${expectedPublishFormat.getFullYear()}`,
          input({ id: 'publishdate', class: 'hidden', value: publishDate }),
        ),
      ),
    ),
  );

  if (authorImage) {
    const items = block.querySelector('.items-center');
    items.insertBefore(img({ class: 'h-16 w-16 rounded-full lg:h-20 lg:w-20 mr-7', src: authorImage, alt: authorName }), items.firstChild);
  }

  block.querySelector('.reading-icon').innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.01172 5.66667V9L11.5117 11.5M16.5117 9C16.5117 13.1421 13.1539 16.5 9.01172 16.5C4.86958 16.5 1.51172 13.1421 1.51172 9C1.51172 4.85786 4.86958 1.5 9.01172 1.5C13.1539 1.5 16.5117 4.85786 16.5117 9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;
}
