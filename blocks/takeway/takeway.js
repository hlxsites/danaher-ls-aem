export default function decorate(block) {
  block.classList.add(...'mb-20 bg-danaherpurple-50 border-t-8 border-danaherpurple-500 px-6 lg:px-10 py-6 space-y-4 leading-7 text-base text-danahergray-700'.split(' '));
  const divContent = block.querySelector('div > div');
  divContent.querySelectorAll('ul').forEach((ulContent) => {
    ulContent.classList.add(...'list-disc pl-8'.split(' '));
  });
  const h2Content = block.querySelector('h2');
  h2Content.classList.add(...'pb-2'.split(' '));
}
