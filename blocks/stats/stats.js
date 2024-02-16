export default function decorate(block) {
  const mainContentDiv = block.querySelector('div');
  mainContentDiv?.parentNode.classList.add(...'form-padding pt-12 sm:pt-16 stats-mainContentDiv-visibility'.split(' '));
  mainContentDiv?.classList.add(...'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'.split(' '));
  const innerContentDiv = mainContentDiv.querySelector('div');
  innerContentDiv.classList.add(...'max-w-4xl mx-auto text-center'.split(' '));
  const h2ContentDiv = innerContentDiv.querySelector('h2');
  h2ContentDiv.classList.add(...'text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900'.split(' '));
  const pContentDiv = innerContentDiv.querySelector('p');
  pContentDiv.classList.add(...'mt-3 text-xl text-gray-500 sm:mt-4'.split(' '));
}
