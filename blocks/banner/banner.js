export default function decorate(block) {
  const isBlogPath = window.location.pathname.startsWith('/us/en/blog');
  const isNewsPath = window.location.pathname.startsWith('/us/en/news');
  const main = document.querySelector('main');
  const content = block.querySelector('div');
  if (isBlogPath || isNewsPath) {
    content.style.minHeight = '0';
    content.style.padding = '0';
    content.style.marginTop = '0';
  } else {
    content.parentNode.setAttribute('style', 'background: linear-gradient(to right bottom, #430f9f, #5d12b5, #7814cc, #9414e2, #b110f7)');
  }
  content.parentNode.classList.add(...'px-6'.split(' '));
  content.classList.add(...'relative min-h-[13rem] h-max w-full flex justify-start items-center'.split(' '));
  const innerContent = content?.querySelector('div');
  innerContent.classList.add(...'relative max-w-7xl mx-auto w-full p-4 text-white'.split(' '));
  const contentH1 = innerContent?.querySelector('h1');
  if (isBlogPath || isNewsPath) {
    contentH1.classList.add(...'!text-4xl font-extrabold tracking-tight text-black'.split(' '));
    contentH1.style.marginTop = '1.0rem';
    contentH1.style.marginBottom = '-2.0rem'; // minimal spacing to next row, adjust if needed
    contentH1.style.marginLeft = '-0.5rem';
    contentH1.style.marginRight = '0';
    contentH1.style.padding = '0';
    contentH1.style.textAlign = 'left';
    contentH1.classList.add('!text-4xl', 'font-extrabold', 'tracking-tight', 'text-black', 'text-left');
  } else {
    contentH1.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));
  }
  if (innerContent?.querySelector('h2')) {
    const contentH2 = innerContent?.querySelector('h2');
    if (isBlogPath || isNewsPath) {
      contentH2.classList.add(...'w-full md:w-3/4 !text-lg font-normal tracking-tight text-black'.split(' '));
      contentH2.style.margin = '0';
      contentH2.style.padding = '0';
      contentH2.style.textAlign = 'left';
      contentH2.classList.add('w-full', 'md:w-3/4', '!text-lg', 'font-normal', 'tracking-tight', 'text-left');
    } else {
      contentH2.classList.add(...'w-full md:w-3/4 !text-lg font-normal tracking-tight text-white'.split(' '));
    }
  }
  main.parentNode.insertBefore(block, main);
  if (isBlogPath || isNewsPath) {
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.remove();
    }
  }
}
