import { div } from '../../scripts/dom-builder.js';

function formatPublishDate(block) {
  const dateEl = block.querySelector('[data-aue-prop="publishDate"]');
  if (!dateEl) return;

  const rawDate = dateEl.textContent.trim();
  if (!rawDate) return;

  const parsed = new Date(rawDate);
  if (isNaN(parsed)) return;

  const formatted = parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  dateEl.textContent = formatted;
}

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-new-${cols.length}-cols`);

  const wrapper = div({
    class: 'container mx-auto flex flex-col lg:flex-row gap-x-12 items-center',
  });

  const [leftCol, rightCol] = cols;
  const textCol = div({ class: 'h-full w-full lg:w-1/2 md:pr-16' });

  const textInner = leftCol.querySelector('div');
  if (textInner) {
    textCol.append(...textInner.children);

    // Defer publishDate formatting to ensure content is fully loaded
    requestAnimationFrame(() => {
      const articleInfo = textCol.querySelector('.article-info-new');
      if (articleInfo) formatPublishDate(articleInfo);
    });
  }

  const imageCol = div({
    class: 'columns-new-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:mt-56 lg:w-1/2',
  });

  const picture = rightCol?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
    }
    imageCol.append(picture);
  }

  wrapper.append(textCol, imageCol);
  block.textContent = '';
  block.append(wrapper);
}
