import {
  div,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const sectionDiv = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const imageAspectRatio = 1.7778;
  block.querySelectorAll('div').forEach((ele, index) => {
    if (index === 0) {
      if (window.location.pathname.includes('/us/en/blog/') || window.location.pathname.includes('/us/en/news/')) {
        ele.classList.add(...'align-text-center w-full h-full'.split(' '));
      } else {
        ele.classList.add(...'align-text-top pb-7 py-0 my-0'.split(' '));
        const firstDiv = ele.querySelector('div:nth-child(1)');
        const secondDiv = ele.querySelector('div:nth-child(2)');
        if (sectionDiv.className.includes('thirtyseventy')) {
          firstDiv.classList.add('lg:w-1/3');
          secondDiv.classList.add('lg:w-2/3');
        } else if (sectionDiv.className.includes('seventythirty')) {
          firstDiv.classList.add('lg:w-2/3');
          secondDiv.classList.add('lg:w-1/3');
        } else {
          firstDiv.classList.add('lg:w-1/2');
          secondDiv?.classList.add('lg:w-1/2');
        }
      }
    }
  });
  block.querySelectorAll('h2').forEach((ele) => {
    ele.classList.add(...'my-0 lg:my-4 font-medium text-4xl2 inline-flex leading-10'.split(' '));
    if (sectionDiv.className.includes('text-white')) ele.classList.add('text-white');
    else ele.classList.add('text-danahergray-900');
  });
  block.querySelectorAll('.button-container > a').forEach((ele) => {
    ele.classList.add(...'bg-transparent no-underline text-lg px-5 py-3 text-danaherpurple-500 border border-danaherpurple-500 leading-5 rounded-full font-medium mt-6 ease-in-out duration-150 transition-all hover:bg-danaherpurple-500 hover:text-white'.split(' '));
  });

  if (block.className.includes('bottom-border-right')) {
    block.querySelectorAll('div > div:nth-child(2) > p > a').forEach((ele, index, arr) => {
      if (index === arr.length - 1) ele.parentElement?.classList.add('border-0');
      else ele.parentElement?.classList.add(...'border-b border-solid border-black my-6'.split(' '));
    });
  }

  if (block.className.includes('bg-color-right')) {
    const divEl = block.querySelector('div > div:nth-child(2)');
    divEl.classList.add('bg-danaherred-800', 'pb-10');
    divEl.querySelectorAll('p').forEach((ele, index, arr) => {
      if (!ele.className.includes('.button-container')) ele.classList.add(...'py-2 px-6 leading-7 text-base !text-white'.split(' '));
      ele.classList.add('href-text');
      if (index === arr.length - 1) {
        ele.querySelector('a')?.classList.add(...'btn-outline-trending-brand text-lg font-medium rounded-full px-6 py-3 !no-underline'.split(' '));
      }
    });
    divEl.querySelectorAll('h2, h3, h4').forEach((ele) => {
      ele.classList.add(...'py-2 px-6 !text-white'.split(' '));
    });
  }

  // setup image columns
  [...block.children].forEach((col) => {
    cols.forEach((row) => {
      const img = row.querySelector('img');
      if (img) {
        img.classList.add('w-full');
        // eslint-disable-next-line func-names
        img.onerror = function () {
          img.width = this.width;
          img.height = Math.floor(this.width / imageAspectRatio);
        };
      } else if (!block.className.includes('itemscenter')) {
        if (window.location.pathname.includes('/us/en/blog/') || window.location.pathname.includes('/us/en/news/')) {
          row.classList.add('h-full', 'lg:w-1/2', 'md:pr-16');
          row.querySelectorAll('h1').forEach((ele) => {
            ele.classList.add('pb-4');
          });
        } else {
          row.classList.add('h-full');
          const aTag = row.querySelectorAll('p > a');
          const formType = [...aTag].filter((ele) => ele.title === 'Form_Type');
          if (formType[0]?.title === 'Form_Type' && formType[0]?.textContent === 'promotion') {
            loadForm(row, aTag);
          }
        }
      }

      const ulEle = row.querySelectorAll('div > ul, p > ul');
      ulEle.forEach((ele) => {
        ele.classList.add(...'text-base list-disc pl-10 space-y-2 text-danahergray-700'.split(' '));
      });

      const spanEl = row.querySelectorAll('p > span.icon');
      spanEl.forEach((element) => {
        element.classList.add(...'w-12 h-12 relative rounded-md bg-danaherblue-900 text-white shrink-0'.split(' '));
        const svg = element.querySelector('svg');
        svg.classList.add(...'w-4 h-4 rounded shadow invert brightness-0'.split(' '));
      });

      if (block.className.includes('features-card-left')) {
        const pTags = row.querySelectorAll('p');
        let cardDiv;
        let leftDiv;
        let rightDiv;
        pTags.forEach((element) => {
          if (element.firstElementChild?.nodeName.toLowerCase() === 'span') {
            cardDiv = div({ class: 'card' });
            leftDiv = div({ class: 'left-content' });
            rightDiv = div({ class: 'right-content' });
            leftDiv.append(element);
            cardDiv.append(leftDiv);
            cardDiv.append(rightDiv);
            row.append(cardDiv);
          } else if (rightDiv) rightDiv.append(element);
        });
      }
      if (block.className.includes('columns-2-cols')) {
        if (window.location.pathname.includes('/us/en/blog/') || window.location.pathname.includes('/us/en/news/')) {
          block.firstElementChild?.classList.add(...'container max-w-7xl mx-auto flex flex-col-reverse gap-x-12 lg:flex-col-reverse justify-items-center'.split(' '));
        } else {
          block.firstElementChild?.classList.add(...'container max-w-7xl mx-auto flex flex-col gap-x-12 gap-y-4 lg:flex-row justify-items-center'.split(' '));
        }
        const pTags = row.querySelectorAll('p');
        pTags.forEach((element) => {
          if (element?.firstElementChild?.nodeName?.toLowerCase() === 'picture') {
            element.parentElement.classList.add('picdiv');
          }
        });
      } else if (block.className.includes('columns-3-cols')) {
        block.firstElementChild?.classList.add(...'container max-w-7xl mx-auto grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3 justify-items-center items-center'.split(' '));
        const heading = block.querySelector('h4');
        heading?.classList.add('font-bold');
      }

      const anc = row.querySelectorAll('p > a');
      if (anc) {
        [...anc].forEach((item) => {
          if (item.title === 'link') {
            item.parentElement.classList.add('link', 'pb-8');
            item.textContent += ' ->';
            item.classList.add(...'text-sm font-bold'.split(' '));
            if (sectionDiv.className.includes('text-white')) item.classList.add('text-white');
            else item.classList.add('text-danaherpurple-500');
          }
        });
      }

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          if (window.location.pathname.includes('/us/en/blog/') || window.location.pathname.includes('/us/en/news/')) {
            picWrapper.classList.add(...'columns-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:w-1/2 lg:mt-56'.split(' '));
            pic.querySelector('img').classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
          } else {
            picWrapper.classList.add('columns-img-col', 'order-none');
            const seventythirtyEl = picWrapper.parentElement
              ?.parentElement?.parentElement?.parentElement;
            if (seventythirtyEl.querySelector('img')) {
              pic.querySelector('img').classList.add('block', 'w-1/2');
            } else {
              pic.querySelector('img').classList.add('block');
            }
          }
        }
      }
    });
  });
}
