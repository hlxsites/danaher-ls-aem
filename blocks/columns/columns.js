export default function decorate(block) {
  // if (getMetadata('template') === 'ProductBrandHome')
  // block.parentNode.prepend(div({ class: 'border-t-0-5 border-solid border-black pb-8' }));
  if (block.parentElement.parentElement.className.includes('columns-container')) {
    block.parentElement.parentElement.classList.add(...'px-0 lg:px-8 !py-4 md:!py-10'.split(' '));
  }
  if (block.parentElement.className.includes('columns-wrapper')) {
    block.parentElement.classList
      .add(...'max-w-7xl w-full mx-auto'.split(' '));
  }
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const imageAspectRatio = 1.7778;

  // setup image columns
  [...block.children].forEach((col) => {
    if (block.className.includes('right-bottom-border')) {
      const columns = [...col.children];
      const rightCol = columns[columns.length - 1];
      const anchorTags = rightCol.querySelectorAll('p > a');
      anchorTags.forEach((tag, i) => {
        if (i < anchorTags.length - 1)tag.parentNode.classList.add(...'border-b border-solid border-black my-6'.split(' '));
      });
    }

    cols.forEach((row) => {
      const img = row.querySelector('img');
      if (img) {
        img.classList.add('w-full');
        // eslint-disable-next-line func-names
        img.onerror = function () {
          img.width = this.width;
          img.height = Math.floor(this.width / imageAspectRatio);
        };
      } else if (![...block.classList].includes('itemscenter')) {
        row.classList.add('h-full');
      }
      const anc = row.querySelectorAll('a');
      if (anc) {
        [...anc].forEach((item) => {
          if (item.title === 'link') {
            item.parentElement.classList.add(...'pt-2 pb-8'.split(' '));
            item.textContent += ' ->';
            item.classList.add(...'text-sm font-bold text-danaherpurple-500'.split(' '));
          }
        });
      }

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col', 'order-none');
        }
      }
    });
  });
}
