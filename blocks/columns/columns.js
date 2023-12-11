export default function decorate(block) {
  if (block.parentNode.parentNode.className.includes('top-border')) block.classList.add('top-border');
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
    cols.forEach((row) => {
      const img = row.querySelector('img');
      if (img) {
        img.classList.add('w-full');
        // eslint-disable-next-line func-names
        img.onerror = function () {
          img.width = this.width;
          img.height = Math.floor(this.width / imageAspectRatio);
        };
      } else {
        if (!block.className.includes('itemscenter')) {
          row.classList.add('h-full');
        }
        if (block.className.includes('bg-color-right')) {
          row.classList.add('bg-color-right');
        }
      }

      const anc = row.querySelectorAll('p > a');
      if (anc) {
        [...anc].forEach((item, i) => {
          if (item.title === 'link') {
            item.parentElement.classList.add('pb-8');
            item.textContent += ' ->';
            item.classList.add(...'text-sm font-bold text-danaherpurple-500'.split(' '));
          }
          if (block.className.includes('bottom-border-right') && i < anc.length - 1) item.parentNode.classList.add('bottom-border-right');
          if (block.className.includes('bg-color-right')) item.classList.add('bg-color-right');
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
  block.parentNode.parentNode.classList.remove('top-border');
  block.classList.remove('bottom-border-right');
  block.classList.remove('bg-color-right');
}
