import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  const imageAspectRatio = 1.7778;

  // Mark block as 2 columns and block
  block.classList.add('columns-2-cols', 'block');

  // Clear block content to rebuild with new wrapper structure
  const originalCols = cols.map(c => c); // save references
  block.innerHTML = '';

  // Create the main flex container div (wrapper for left & right columns)
  const container = div({
    class: 'align-text-center w-full h-full container max-w-7xl mx-auto flex flex-col-reverse gap-x-12 lg:flex-col-reverse justify-center ms-center'
  });

  // Create left column div with correct classes
  const leftCol = div({ class: 'h-full lg:w-1/2 md:pr-16' });
  if (originalCols[0]) {
    // Wrap left column content as <p><div>...</div></p>
    const pWrapper = document.createElement('p');
    const innerDiv = document.createElement('div');
    innerDiv.appendChild(originalCols[0]);
    pWrapper.appendChild(innerDiv);
    leftCol.appendChild(pWrapper);
  }

  // Create right column div with image wrapper classes
  const rightCol = div({
    class: 'columns-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:w-1/2 lg:mt-56'
  });
  if (originalCols[1]) {
    rightCol.appendChild(originalCols[1]);

    // Add image classes to <img> inside picture
    const pic = originalCols[1].querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        img.classList.add('absolute', 'bottom-0', 'h-full', 'w-full', 'object-cover');
      }
    }
  }

  // Append left and right columns to container
  container.append(leftCol, rightCol);

  // Append container to block
  block.appendChild(container);

  // Optional: You can add your existing styling code here (headings, buttons, lists etc.)

  // Example: handle headings inside block
  block.querySelectorAll('h1, h2').forEach((ele) => {
    ele.classList.add('pb-4');
    if (sectionDiv?.classList.contains('text-white')) {
      ele.classList.add('text-white');
    } else {
      ele.classList.add('text-danahergray-900');
    }
  });

  // Handle image width/height ratio and error fallback
  const img = block.querySelector('img');
  if (img) {
    img.classList.add('w-full');
    img.onerror = function () {
      img.width = this.width;
      img.height = Math.floor(this.width / imageAspectRatio);
    };
  }
}
