import {
  div, input, span, img,
} from '../../scripts/dom-builder.js';

// Get value from fields array by name
function getFieldValue(fields, name) {
  if (!Array.isArray(fields)) return '';
  const field = fields.find(f => f.name === name);
  return field && typeof field.value === 'string' ? field.value : '';
}

// Fallback utility (for flat JSON or fields array only)
function fallback(...args) {
  for (const v of args) {
    if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
}

// Main decorate
export default function decorate(block, json = null) {
  console.log('decorate block:', block);
  console.log('decorate called with json:', json);
  block.innerHTML = '';

  // Extract from EDS/Universal Editor JSON
  let fields = null;
  if (json && json.models && Array.isArray(json.models) && json.models[0]?.fields) {
    fields = json.models[0].fields;
  }

  // Extract all possible values, only from JSON (no metadata fallback)
  const authorName = fallback(
    fields && getFieldValue(fields, 'authorName'),
    json?.authorName
  );
  const authorJobTitle = fallback(
    fields && getFieldValue(fields, 'authorTitle'),
    json?.authorJobTitle || json?.authorTitle
  );
  const publishDate = fallback(
    fields && getFieldValue(fields, 'publishDate'),
    json?.publishDate
  );
  const readingTime = fallback(
    fields && getFieldValue(fields, 'readingTime'),
    json?.readingTime
  );
  const authorImage = fallback(
    fields && getFieldValue(fields, 'image'),
    json?.authorImage || json?.image
  );
  const articleOpco = fallback(
    fields && getFieldValue(fields, 'articleOpco'),
    json?.articleOpco
  );

  // Debugging output
  console.log("authorName", authorName);
  console.log("authorJobTitle", authorJobTitle);
  console.log("publishDate", publishDate);
  console.log("readingTime", readingTime);
  console.log("authorImage", authorImage);
  console.log("articleOpco", articleOpco);

  // Format date
  let formattedDate = '';
  if (publishDate) {
    const d = new Date(publishDate);
    if (!isNaN(d)) {
      formattedDate = `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })}, ${d.getFullYear()}`;
    }
  }

  block.append(
    div(
      { class: 'articleinfo' },
      div(
        { class: 'max-w-4xl mx-auto' },
        div(
          { class: 'items-center flex justify-start my-4 w-full col-span-2' },
          authorImage
            ? img({ class: 'h-16 w-16 rounded-full lg:h-20 lg:w-20 mr-7', src: authorImage, alt: authorName })
            : '',
          div(
            { class: 'space-y-1 text-lg leading-6' },
            div({ class: 'text-danaherblack-500 font-medium' }, authorName),
            div({ class: 'text-sm text-danaherblack-500 w-full' }, authorJobTitle),
          ),
        ),
        div(
          { class: 'w-max items-center flex justify-end col-span-1 text-sm mr-4 my-4 text-danaherblack-500' },
          formattedDate,
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

  block.querySelector('.reading-icon').innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.01172 5.66667V9L11.5117 11.5M16.5117 9C16.5117 13.1421 13.1539 16.5 9.01172 16.5C4.86958 16.5 1.51172 13.1421 1.51172 9C1.51172 4.85786 4.86958 1.5 9.01172 1.5C13.1539 1.5 16.5117 4.85786 16.5117 9Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  // The rest of your DOM logic
  const toBeRemoved = ['social-media-wrapper', 'columns-wrapper', 'article-info-wrapper', 'tags-list-wrapper', 'related-articles-wrapper'];
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
