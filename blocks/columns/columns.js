import { div } from '../../scripts/dom-builder.js';

function formatPublishDate(articleInfoBlock) {
  if (!articleInfoBlock) return;
  const dateWrapper = articleInfoBlock.querySelector('[data-aue-prop="publishDate"]');
  if (!dateWrapper) {
    console.warn('publishDate not found in article-info-new block');
    return;
  }

  let rawDate = dateWrapper.textContent?.trim();
  const input = dateWrapper.querySelector('input');
  if (input && input.value) rawDate = input.value.trim();

  const parsedDate = new Date(rawDate);
  if (isNaN(parsedDate)) {
    console.warn('Invalid date:', rawDate);
    return;
  }

  const formatted = parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  if (input) {
    input.value = formatted;
  } else {
    dateWrapper.textContent = formatted;
  }
}

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-new-${cols.length}-cols`);

  const wrapper = div({
    class: 'align-text-center w-full h-full container max-w-7xl mx-auto flex flex-col lg:flex-row gap-x-12 justify-center items-center',
  });

  const [leftCol, rightCol] = cols;

  // Determine ratio classes...
  // (same as previous code for width)

  // === TEXT COLUMN ===
  const textCol = div({ class: `h-full w-full lg:w-1/2 md:pr-16` }); // simplified widths for demo
  const textInner = leftCol.querySelector('div') || leftCol; 
  if (textInner) textCol.append(...textInner.children);

  // Headline and button styling
  // (same as previous code...)

  // Append columns into wrapper
  const imageCol = div({ class: `columns-new-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:w-1/2 lg:mt-56` });

  const picture = rightCol.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) img.classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
    imageCol.append(picture);
  }

  wrapper.append(textCol, imageCol);

  // Clear original block and append wrapper
  block.textContent = '';
  block.append(wrapper);

  // Now locate .article-info-new **anywhere inside the leftCol or textCol**
  const articleInfo =
    textCol.querySelector('.article-info-new') ||
    leftCol.querySelector('.article-info-new') ||
    block.querySelector('.article-info-new');

  if (!articleInfo) {
    console.warn('No .article-info-new block found inside columns');
    return;
  }

  // Format the publishDate
  formatPublishDate(articleInfo);
}
