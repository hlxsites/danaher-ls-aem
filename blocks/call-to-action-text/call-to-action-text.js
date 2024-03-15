// Description: Add a link to the CTA text block.
export default function decorate(block) {
  const ctaLink = block.querySelector('a');
  if (ctaLink) {
    ctaLink.href = ctaLink?.getAttribute('href');
    ctaLink.innerHTML = block.textContent;
    ctaLink.innerHTML += ' ->';
    ctaLink.classList.add(...'text-base text-danaherpurple-500 font-semibold'.split(' '));
  }
  const ctaTextSection = ctaLink.parentElement.parentElement;
  ctaTextSection.remove();
  block.append(ctaLink);
}
