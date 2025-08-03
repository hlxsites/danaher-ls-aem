export default function decorate(block) {
  const main = document.querySelector('main');
  const content = block.querySelector('div');
  const isBlogPath = window.location.pathname.startsWith('/us/en/blog');
  const isNewsPath = window.location.pathname.startsWith('/us/en/news');

  // Set background
  if (isBlogPath || isNewsPath) {
    content.parentNode.setAttribute('style', 'background: white');
  } else {
    content.parentNode.setAttribute('style', 'background: linear-gradient(to right bottom, #430f9f, #5d12b5, #7814cc, #9414e2, #b110f7)');
  }

  // Common layout styles
  content.parentNode.classList.add('px-6');
  content.classList.add(...'relative min-h-[13rem] h-max w-full flex justify-start items-center'.split(' '));

  const innerContent = content?.querySelector('div');
  const contentH1 = innerContent?.querySelector('h1');
  const contentH2 = innerContent?.querySelector('h2');

  // Conditional text color
  if (isBlogPath || isNewsPath) {
    innerContent?.classList.add(...'relative max-w-7xl mx-auto w-full p-4 text-black'.split(' '));
    contentH1?.classList.add(...'!text-4xl font-extrabold tracking-tight text-black'.split(' '));
    contentH2?.classList.add(...'w-full md:w-3/4 !text-lg font-normal tracking-tight text-black'.split(' '));
  } else {
    innerContent?.classList.add(...'relative max-w-7xl mx-auto w-full p-4 text-white'.split(' '));
    contentH1?.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));
    contentH2?.classList.add(...'w-full md:w-3/4 !text-lg font-normal tracking-tight text-white'.split(' '));
  }

  main.parentNode.insertBefore(block, main);
}
