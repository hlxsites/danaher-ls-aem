import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  const imageAspectRatio = 1.7778;

  // Clear and rebuild block
  block.classList.add('columns-2-cols', 'block');
  const originalCols = cols.map(c => c);
  block.innerHTML = '';

  const isTwentyFive = sectionDiv.classList.contains('twentyfiveseventyfive');
  const isSeventyFive = sectionDiv.classList.contains('seventyfivetwentyfive');

  const wrapper = div({
    class: 'align-text-center w-full h-full container max-w-7xl mx-auto flex flex-col-reverse gap-x-12 lg:flex-col-reverse justify-center ms-center',
  });

  // LEFT COLUMN
  const leftCol = div({
    class: `h-full ${isTwentyFive ? 'lg:w-1/4' : isSeventyFive ? 'lg:w-3/4' : 'lg:w-1/2'} md:pr-16`,
  });

  if (originalCols[0]) {
    // Add content directly without wrapping <p><div>
    leftCol.appendChild(originalCols[0]);

    // Add headline class
    const h1 = leftCol.querySelector('h1');
    if (h1) h1.classList.add('pb-4', 'text-danahergray-900');
  }

  // RIGHT COLUMN (Image)
  const rightCol = div({
    class: `columns-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 ${isTwentyFive ? 'lg:w-3/4' : isSeventyFive ? 'lg:w-1/4' : 'lg:w-1/2'} lg:mt-56`,
  });

  if (originalCols[1]) {
    rightCol.appendChild(originalCols[1]);
    const pic = originalCols[1].querySelector('picture');
    const img = pic?.querySelector('img');
    if (img) {
      img.classList.add('absolute', 'bottom-0', 'h-full', 'w-full', 'object-cover');
    }
  }

  wrapper.append(leftCol, rightCol);
  block.appendChild(wrapper);
}
