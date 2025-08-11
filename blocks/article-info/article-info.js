import {
  div, input, span, img,
} from '../../scripts/dom-builder.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

/**
 * Helper to extract values from JSON field array as per Universal Editor/EDS pattern.
 * @param {Array} fields
 * @param {string} name
 * @returns {string}
 */
function getFieldValue(fields, name) {
  if (!Array.isArray(fields)) return '';
  const field = fields.find(f => f.name === name);
  return field && typeof field.value === 'string' ? field.value : '';
}

/**
 * Helper to prioritize JSON model/fields, then JSON flat properties, then metadata.
 * Accepts either a flat JSON object, or an EDS/Universal Editor model JSON structure.
 */
function extractArticleInfo(json) {
  // Case 1: EDS/Universal Editor structure
  if (json && json.models && Array.isArray(json.models) && json.models[0]?.fields) {
    const fields = json.models[0].fields;
    return {
      authorName: getFieldValue(fields, 'authorName'),
      authorJobTitle: getFieldValue(fields, 'authorTitle'),
      authorImage: getFieldValue(fields, 'image'),
      authorImageAlt: getFieldValue(fields, 'imageAlt'),
      articleOpco: getFieldValue(fields, 'articleOpco'),
      publishDate: getFieldValue(fields, 'publishDate'),
      readingTime: getFieldValue(fields, 'readingTime'),
    };
  }
  // Case 2: Flat JSON
  if (json && typeof json === 'object') {
    return {
      authorName: json.authorName || '',
      authorJobTitle: json.authorJobTitle || json.authorTitle || '',
      authorImage: json.authorImage || json.image || '',
      authorImageAlt: json.authorImageAlt || json.imageAlt || '',
      articleOpco: json.articleOpco || '',
      publishDate: json.publishDate || '',
      readingTime: json.readingTime || '',
    };
  }
  // Case 3: No JSON, fallback to empty
  return {};
}

/**
 * Helper to return the first non-empty value in the fallback chain.
 */
function fallback(...args) {
  for (const val of args) {
    if (typeof val === 'string' && val.trim()) return val;
  }
  return '';
}

export default function decorate(block, json = null) {
  block.innerHTML = '';

  // Extract values from JSON if available (works for EDS/Universal Editor or flat JSON)
  const jsonInfo = extractArticleInfo(json);

  // Fallback to metadata if not present in JSON
  const authorName = fallback(jsonInfo.authorName, getMetadata('authorname'));
  const authorJobTitle = fallback(jsonInfo.authorJobTitle, getMetadata('authortitle'));
  const authorImage = fallback(jsonInfo.authorImage, getMetadata('authorimage'));
  const authorImageAlt = fallback(jsonInfo.authorImageAlt, authorName, getMetadata('authorimagealt'), 'Author image');
  const articleOpco = fallback(jsonInfo.articleOpco, getMetadata('articleopco'));
  const publishDate = fallback(jsonInfo.publishDate, getMetadata('publishdate'));
  const readingTime = fallback(jsonInfo.readingTime, getMetadata('readingtime'));

  const expectedPublishFormat = publishDate ? new Date(publishDate) : null;

  block.append(
    div(
      { class: 'articleinfo' },
      div(
        { class: 'max-w-4xl mx-auto' },
        div(
          { class: 'items-center flex justify-start my-4 w-full col-span-2' },
          authorImage
            ? img({
                class: 'h-16 w-16 rounded-full lg:h-20 lg:w-20 mr-7',
                src: authorImage,
                alt: authorImageAlt,
              })
            : '',
          div(
            { class: 'space-y-1 text-lg leading-6' },
            div({ class: 'text-danaherblack-500 font-medium' }, authorName),
            div({ class: 'text-sm text-danaherblack-500 w-full' }, authorJobTitle),
          ),
        ),
        div(
          { class: 'w-max items-center flex justify-end col-span-1 text-sm mr-4 my-4 text-danaherblack-500' },
          expectedPublishFormat
            ? `${expectedPublishFormat.getDate()} ${expectedPublishFormat.toLocaleString('default', { month: 'long' })}, ${expectedPublishFormat.getFullYear()}`
            : '',
          input({ id: 'publishdate', class: 'hidden', value: publishDate || '' }),
        ),
        div(
          { class: 'items-center flex justify-start col-span-1 my-4' },
          div({ class: 'reading-icon' }),
          div(
            { class: 'text-sm text-danaherblack-500 pl-1' },
            span({ id: 'timetoread' }, readingTime ? `${readingTime} Mins` : ''),
          ),
        ),
      ),
    ),
  );

  // Insert SVG icon for reading time
  const readingIcon = block.querySelector('.reading-icon');
  if (readingIcon) {
    readingIcon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.01172 5.66667V9L11.5117 11.5M16.5117 9C16.5117 13.1421 13.1539 16.5 9.01172 16.5C4.86958 16.5 1.51172 13.1421 1.51172 9C1.51172 4.85786 4.86958 1.5 9.01172 1.5C13.1539 1.5 16.5117 4.85786 16.5117 9Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
  }

  const toBeRemoved = [
    'social-media-wrapper',
    'columns-wrapper',
    'article-info-wrapper',
    'tags-list-wrapper',
    'related-articles-wrapper',
  ];
  const sectionEl = document.querySelector('main > div:nth-child(1)');
  if (sectionEl) {
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
}
