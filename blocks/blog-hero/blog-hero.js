export default function decorate(block) {
  if (block.querySelector('h1')) block.querySelector('h1').classList.add(...'px-2 text-gray-900 my-2'.split(' '));
  if (block.querySelector('h1 + p')) block.querySelector('h1 + p').classList.add(...'px-2 text-xl text-gray-500 leading-8'.split(' '));
  if (block.querySelector('img')) block.querySelector('img').classList.add(...'px-2 mt-8'.split(' '));
}
