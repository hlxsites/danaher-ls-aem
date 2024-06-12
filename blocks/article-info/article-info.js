import {
  div, input, span, img,
} from '../../scripts/dom-builder.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block.innerHTML = '';
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
        { class: 'max-w-4xl mx-auto' },
        div(
          { class: 'items-center flex justify-start my-4 w-full col-span-2' },
          div(
            { class: 'space-y-1 text-lg leading-6' },
            div({ class: 'text-danaherblack-500 font-medium' }, authorName),
            div({ class: 'text-sm text-danaherpurple-800 w-full' }, authorJobTitle),
          ),
        ),
        div(
          { class: 'w-max items-center flex justify-end col-span-1 text-sm mr-4 my-4 text-danahergray-500' },
          `${expectedPublishFormat.getDate()} ${expectedPublishFormat.toLocaleString('default', { month: 'long' })}, ${expectedPublishFormat.getFullYear()}`,
          input({ id: 'publishdate', class: 'hidden', value: publishDate }),
        ),
        div(
          { class: 'items-center flex justify-start col-span-1 my-4' },
          div({ class: 'reading-icon' }),
          div(
            { class: 'text-sm text-danahergray-500 pl-1' },
            span({ id: 'timetoread' }, `${readingTime} Mins`),
          ),
        ),
      ),
    ),
  );

  if (authorImage) {
    const items = block.querySelector('.items-center');
    items.insertBefore(img({ class: 'h-16 w-16 rounded-full lg:h-20 lg:w-20 mr-7', src: authorImage, alt: authorName }), items.firstChild);
    const imageEl = block.querySelector('.articleinfo')?.querySelector('.items-center')?.querySelector('img');
    imageEl.remove();
    block.querySelector('.articleinfo')?.firstChild?.prepend(imageEl);
  }

  block.querySelector('.reading-icon').innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.01172 5.66667V9L11.5117 11.5M16.5117 9C16.5117 13.1421 13.1539 16.5 9.01172 16.5C4.86958 16.5 1.51172 13.1421 1.51172 9C1.51172 4.85786 4.86958 1.5 9.01172 1.5C13.1539 1.5 16.5117 4.85786 16.5117 9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  const toBeRemoved = ['social-media-wrapper', 'columns-wrapper', 'article-info-wrapper', 'tags-list-wrapper', 'related-articles-wrapper'];
  const sectionEl = document.querySelector('main > div:nth-child(1)');
  sectionEl.classList.remove('article-info-container');
  const leftSideElements = div({ class: 'mt-4' });
  Array.from(sectionEl.children).forEach((element) => {
    if (!toBeRemoved.includes(element.classList[0])) {
      leftSideElements.append(element);
    }
  });

  const divEl = div(
    { class: 'article-info-container' },
    sectionEl.querySelector('.article-info-wrapper'),
    leftSideElements,
  );
  sectionEl.querySelector('.columns-wrapper')?.after(divEl);
}
