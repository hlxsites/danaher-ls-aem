export default function decorate(block, bannerModel) {
  const main = document.querySelector('main');
  if (!main) return;

  // Remove any .button-container inside the block
  block.querySelectorAll('.button-container').forEach(btn => btn.remove());

  // Get or create content wrapper
  let content = block.querySelector('div');
  if (!content) {
    content = document.createElement('div');
    block.appendChild(content);
  }

  // Remove existing inner content
  content.innerHTML = '';

  // Create new inner content wrapper
  const innerContent = document.createElement('div');
  content.appendChild(innerContent);

  // Path logic
  const isBlogPath = window.location.pathname.startsWith('/us/en/blog');
  const isNewsPath = window.location.pathname.startsWith('/us/en/news');
  const isLight = isBlogPath || isNewsPath;

  // Set background
  if (isLight) {
    content.parentNode.setAttribute('style', 'background: white');
  } else {
    content.parentNode.setAttribute(
      'style',
      'background: linear-gradient(to right bottom, #430f9f, #5d12b5, #7814cc, #9414e2, #b110f7)'
    );
  }

  // Common layout styles
  content.parentNode.classList.add('px-6');
  content.classList.add(...'relative min-h-[13rem] h-max w-full flex justify-start items-center'.split(' '));
  innerContent.classList.add(...`relative max-w-7xl mx-auto w-full p-4 ${isLight ? 'text-black' : 'text-white'}`.split(' '));

  // Inject heading and description from bannerModel, but hide visually
  if (bannerModel && bannerModel.banner && bannerModel.bannerTag) {
    const heading = document.createElement(bannerModel.bannerTag);
    heading.textContent = bannerModel.banner;
    heading.className = '.banner';
    innerContent.appendChild(heading);
  }

  if (bannerModel && bannerModel.description && bannerModel.descriptionTag) {
    const desc = document.createElement(bannerModel.descriptionTag);
    desc.textContent = bannerModel.description;
    desc.className = '.banner';
    innerContent.appendChild(desc);
  }

  // Move banner block before main if not already
  if (main.parentNode && main.parentNode.firstChild !== block) {
    main.parentNode.insertBefore(block, main);
  }
}
