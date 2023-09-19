export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const imageAspectRatio = 1.7778;

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const img = col.querySelector('img');
      if (img) {
        img.onerror = function () {
          img.width = img.width;
          img.height = `${Math.floor(img.width / imageAspectRatio)}`;
        };
      }

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
