export default function decorate(block) {
  const [leftText, rightText] = block.children;
  // Only add classes; do not clear or append!
  if (leftText) leftText.classList.add('font-medium', 'text-3xl');
  if (rightText) rightText.classList.add('text-base');
}
