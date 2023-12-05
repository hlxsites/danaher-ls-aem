export default function decorate(block) {
  if (block.parentElement.parentElement.className.includes('columns-container')) {
    block.parentElement.parentElement.classList.add(...'px-0 lg:px-8 !py-4 md:!py-10'.split(' '));
  }
  if (block.parentElement.className.includes('columns-wrapper')) {
    block.parentElement.classList.add(...'max-w-7xl w-full mx-auto bg-danaherlightblue-50'.split(' '));
  }
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const imageAspectRatio = 1.7778;

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const img = col.querySelector('img');
      if (img) {
        img.classList.add('w-full');
        // eslint-disable-next-line func-names
        img.onerror = function () {
          img.width = this.width;
          img.height = Math.floor(this.width / imageAspectRatio);
        };
      } else if (![...block.classList].includes('itemscenter')) {
        col.classList.add('h-full');
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
