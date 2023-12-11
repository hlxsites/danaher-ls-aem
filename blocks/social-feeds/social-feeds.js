export default async function decorate(block) {
  if (block.parentNode.parentNode.className.includes('top-border')) block.classList.add('top-border');
  block.parentNode.parentNode.classList.remove('top-border');
}
