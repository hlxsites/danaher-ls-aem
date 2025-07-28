import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  const imageAspectRatio = 1.7778;

  // Add column count class
  block.classList.add(`columns-${cols.length}-cols`);

  // Add flex layout to column wrapper
  block.firstElementChild.classList.add('flex', 'flex-col', 'gap-6', 'lg:flex-row');

  // Apply ratio-based widths
  if (sectionDiv.classList.contains('fiftyfifty')) {
    cols.forEach(col => col.classList.add('w-full', 'lg:w-1/2'));
  } else if (sectionDiv.classList.contains('seventythirty')) {
    cols[0]?.classList.add('w-full', 'lg:w-2/3');
    cols[1]?.classList.add('w-full', 'lg:w-1/3');
  } else if (sectionDiv.classList.contains('thirtyseventy')) {
    cols[0]?.classList.add('w-full', 'lg:w-1/3');
    cols[1]?.classList.add('w-full', 'lg:w-2/3');
  } else if (sectionDiv.classList.contains('twentyfiveseventyfive')) {
    cols[0]?.classList.add('w-full', 'lg:w-1/4');
    cols[1]?.classList.add('w-full', 'lg:w-3/4');
  } else if (sectionDiv.classList.contains('seventyfivetwentyfive')) {
    cols[0]?.classList.add('w-full', 'lg:w-3/4');
    cols[1]?.classList.add('w-full', 'lg:w-1/4');
  }

  // Headings
  block.querySelectorAll('h2').forEach((ele) => {
    ele.classList.add(...'my-0 lg:my-4 font-medium text-4xl2 inline-flex leading-10'.split(' '));
    if (sectionDiv.classList.contains('text-white')) {
      ele.classList.add('text-white');
    } else {
      ele.classList.add('text-danahergray-900');
    }
  });

  // Buttons
  block.querySelectorAll('.button-container > a').forEach((ele) => {
    ele.classList.add(...'bg-transparent no-underline text-lg px-5 py-3 text-danaherpurple-500 border border-danaherpurple-500 leading-5 rounded-full font-medium mt-6 ease-in-out duration-150 transition-all hover:bg-danaherpurple-500 hover:text-white'.split(' '));
  });

  // Bottom border variant
  if (block.classList.contains('bottom-border-right')) {
    block.querySelectorAll('div > div:nth-child(2) > p > a').forEach((ele, index, arr) => {
      const p = ele.parentElement;
      if (index === arr.length - 1) p?.classList.add('border-0');
      else p?.classList.add(...'border-b border-solid border-black my-6'.split(' '));
    });
  }

  // Background color variant
  if (block.classList.contains('bg-color-right')) {
    const divEl = block.querySelector('div > div:nth-child(2)');
    divEl?.classList.add('bg-danaherred-800', 'pb-10');
    divEl?.querySelectorAll('p').forEach((ele, index, arr) => {
      if (!ele.className.includes('button-container')) {
        ele.classList.add(...'py-2 px-6 leading-7 text-base !text-white'.split(' '));
      }
      ele.classList.add('href-text');
      if (index === arr.length - 1) {
        ele.querySelector('a')?.classList.add(...'btn-outline-trending-brand text-lg font-medium rounded-full px-6 py-3 !no-underline'.split(' '));
      }
    });
    divEl?.querySelectorAll('h2, h3, h4').forEach((ele) => {
      ele.classList.add(...'py-2 px-6 !text-white'.split(' '));
    });
  }

  // Column children processing
  cols.forEach((col) => {
    const img = col.querySelector('img');
    if (img) {
      img.classList.add('w-full');
      img.onerror = function () {
        img.width = this.width;
        img.height = Math.floor(this.width / imageAspectRatio);
      };
    } else if (!block.classList.contains('itemscenter')) {
      if (window.location.pathname.includes('/us/en/blog-eds/') || window.location.pathname.includes('/us/en/news-eds/')) {
        col.classList.add('h-full', 'lg:w-1/2', 'md:pr-16');
        col.querySelectorAll('h1').forEach((ele) => {
          ele.classList.add('pb-4');
        });
      } else {
        col.classList.add('h-full');
      }
    }

    // Lists
    col.querySelectorAll('div > ul, p > ul').forEach((ele) => {
      ele.classList.add(...'text-base list-disc pl-10 space-y-2 text-danahergray-700'.split(' '));
    });

    // Icons
    col.querySelectorAll('p > span.icon').forEach((element) => {
      element.classList.add(...'w-12 h-12 relative rounded-md bg-danaherblue-900 text-white shrink-0'.split(' '));
      element.querySelector('svg')?.classList.add(...'w-4 h-4 rounded shadow invert brightness-0'.split(' '));
    });

    // Links
    col.querySelectorAll('p > a').forEach((item) => {
      if (item.title === 'link') {
        item.parentElement.classList.add('link', 'pb-8');
        item.textContent += ' ->';
        item.classList.add(...'text-sm font-bold'.split(' '));
        if (sectionDiv.classList.contains('text-white')) {
          item.classList.add('text-white');
        } else {
          item.classList.add('text-danaherpurple-500');
        }
      }
    });

    // Picture handling
    const pic = col.querySelector('picture');
    if (pic) {
      const picWrapper = pic.closest('div');
      if (picWrapper && picWrapper.children.length === 1) {
        if (window.location.pathname.includes('/us/en/blog-eds/') || window.location.pathname.includes('/us/en/news-eds/')) {
          picWrapper.classList.add(...'columns-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:w-1/2 lg:mt-56'.split(' '));
          pic.querySelector('img')?.classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
        } else {
          picWrapper.classList.add('columns-img-col', 'order-none');
          pic.querySelector('img')?.classList.add('block', 'w-1/2');
        }
      }
    }

    // Feature card left
    if (block.classList.contains('features-card-left')) {
      const pTags = col.querySelectorAll('p');
      let cardDiv, leftDiv, rightDiv;
      pTags.forEach((p) => {
        if (p.firstElementChild?.nodeName.toLowerCase() === 'span') {
          cardDiv = div({ class: 'card' });
          leftDiv = div({ class: 'left-content' });
          rightDiv = div({ class: 'right-content' });
          leftDiv.append(p);
          cardDiv.append(leftDiv, rightDiv);
          col.append(cardDiv);
        } else if (rightDiv) {
          rightDiv.append(p);
        }
      });
    }
  });
}
