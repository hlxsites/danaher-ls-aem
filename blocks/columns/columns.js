import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  const imageAspectRatio = 1.7778;

  // Add column count class
  block.classList.add(`columns-${cols.length}-cols`);

  // Clean slate: reset any layout on the wrapper
  const wrapper = div({
    class: 'align-text-center w-full h-full container max-w-7xl mx-auto flex flex-col lg:flex-row gap-x-12 justify-center items-center',
  });

  // Wrap the block's first child with new layout
  const [leftCol, rightCol] = cols;

  // === TEXT COLUMN ===
  const textCol = div({ class: 'h-full w-full lg:w-1/2 md:pr-16' });

  const textInner = leftCol.querySelector('div');
  if (textInner) textCol.append(...textInner.children);

  // Headline styling
  textCol.querySelectorAll('h1, h2').forEach((h) => {
    h.classList.add(...'pb-4 text-danahergray-900 text-4xl font-semibold'.split(' '));
  });

  // Button styling
  textCol.querySelectorAll('a[title="Button"]').forEach((a) => {
    a.classList.add(...'btn btn-outline-primary rounded-full text-danaherpurple-500 border border-danaherpurple-500 px-6 py-3 mt-4 inline-block'.split(' '));
  });

  // === IMAGE COLUMN ===
  const imageCol = div({
    class: 'columns-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:w-1/2 lg:mt-56',
  });

  const picture = rightCol.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
    }
    imageCol.append(picture);
  }

  // Append columns into wrapper
  wrapper.append(textCol, imageCol);

  // Replace block content with new wrapper
  block.textContent = '';
  block.append(wrapper);
}
