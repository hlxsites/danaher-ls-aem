export default function decorate(block) {
  const main = document.querySelector('main');
  main.parentNode.insertBefore(block, main);
}
