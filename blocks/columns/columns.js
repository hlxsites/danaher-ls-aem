import { div } from '../../scripts/dom-builder.js';
import { decorate as decorateArticleInfoNew } from '../article-info-new/article-info-new.js';

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];

  block.classList.add(`columns-new-${cols.length}-cols`);

  const wrapper = div({
    class: 'align-text-center w-full h-full container max-w-7xl mx-auto flex flex-col lg:flex-row gap-x-12 justify-center items-center',
  });

  const [leftCol, rightCol] = cols;

  let leftWidth = 'lg:w-1/2';
  let rightWidth = 'lg:w-1/2';

  if (sectionDiv.classList.contains('thirtyseventy')) {
    leftWidth = 'lg:w-1/3';
    rightWidth = 'lg:w-2/3';
  } else if (sectionDiv.classList.contains('seventythirty')) {
    leftWidth = 'lg:w-2/3';
    rightWidth = 'lg:w-1/3';
  } else if (sectionDiv.classList.contains('twentyfiveseventyfive')) {
    leftWidth = 'lg:w-1/4';
    rightWidth = 'lg:w-3/4';
  } else if (sectionDiv.classList.contains('seventyfivetwentyfive')) {
    leftWidth = 'lg:w-3/4';
    rightWidth = 'lg:w-1/4';
  } else if (sectionDiv.classList.contains('sixtyforty')) {
    leftWidth = 'lg:w-3/5';
    rightWidth = 'lg:w-2/5';
  } else if (sectionDiv.classList.contains('fortysixty')) {
    leftWidth = 'lg:w-2/5';
    rightWidth = 'lg:w-3/5';
  }

  const textCol = div({ class: `h-full w-full ${leftWidth} md:pr-16` });
  const textInner = leftCol.querySelector('div');
  if (textInner) textCol.append(...textInner.children);

  textCol.querySelectorAll('h1, h2').forEach((h) => {
    h.classList.add(...'pb-4 text-danahergray-900 text-4xl font-semibold'.split(' '));
  });

  textCol.querySelectorAll('a[title="Button"]').forEach((a) => {
    a.classList.add(...'btn btn-outline-primary rounded-full text-danaherpurple-500 border border-danaherpurple-500 px-6 py-3 mt-4 inline-block'.split(' '));
  });

  // Initialize article-info-new block formatting (date etc.)
  textCol.querySelectorAll('.article-info-new').forEach((articleBlock) => {
    decorateArticleInfoNew(articleBlock);
  });

  const imageCol = div({
    class: `columns-new-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 ${rightWidth} lg:mt-56`,
  });

  const picture = rightCol.querySelector('picture');
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
