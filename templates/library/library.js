export default async function buildAutoBlocks(block) {
  const main = document.querySelector('main');
  main.prepend(block);
}
