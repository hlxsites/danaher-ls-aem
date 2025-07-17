import {
  div, input, span, img,
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.innerHTML = '';

  const blockPath = block.closest('.block')?.dataset?.blockName || 'article-info-new';

  // Load JSON manually
  const jsonPath = `${window.location.pathname}${blockPath}/article-info-new.json`;
  let config = {};


  // Load properties from component-models.json
  const res = await fetch(jsonPath);

  const authorName = config.authorName || '';
  const authorJobTitle = config.authorTitle || '';
  const publishDate = config.publishDate || '';
  const readingTime = config.readingTime || '';
  const authorImage = config.authorImage || '';
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
            div({ class: 'text-sm text-danaherblack-500 w-full' }, authorJobTitle),
          ),
        ),
        div(
          { class: 'w-max items-center flex justify-end col-span-1 text-sm mr-4 my-4 text-danaherblack-500' },
          `${expectedPublishFormat.getDate()} ${expectedPublishFormat.toLocaleString('default', { month: 'long' })}, ${expectedPublishFormat.getFullYear()}`,
          input({ id: 'publishdate', class: 'hidden', value: publishDate }),
        ),
        div(
          { class: 'items-center flex justify-start col-span-1 my-4' },
          div({ class: 'reading-icon' }),
          div(
            { class: 'text-sm text-danaherblack-500 pl-1' },
            span({ id: 'timetoread' }, `${readingTime} Mins`),
          ),
        ),
      ),
    ),
  );
}
