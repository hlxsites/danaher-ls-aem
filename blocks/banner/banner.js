export default function decorate(block) {
  const main = document.querySelector('main');
  const content = block.querySelector('div');
  content.parentNode.setAttribute('style', 'background: linear-gradient(to right bottom, #430f9f, #5d12b5, #7814cc, #9414e2, #b110f7)');
  content.parentNode.classList.add(...'px-6'.split(' '));
  content.classList.add(...'relative min-h-[13rem] h-max w-full flex justify-start items-center'.split(' '));
  const innerContent = content?.querySelector('div');
  innerContent.classList.add(...'relative max-w-7xl mx-auto w-full py-4 text-white'.split(' '));
  const contentH1 = innerContent?.querySelector('h1');
  contentH1.classList.add(...'text-4xl font-extrabold tracking-tight text-white'.split(' '));
  if (innerContent?.querySelector('h2')) {
    const contentH2 = innerContent?.querySelector('h2');
    contentH2.classList.add(...'w-full md:w-3/4 text-lg font-normal tracking-tight text-white'.split(' '));
  }
  main.parentNode.insertBefore(block, main);
}
