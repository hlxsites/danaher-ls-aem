import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const mainWrapper = main.querySelector(':scope > div');
  const blogH1 = mainWrapper.querySelector(':scope > h1');
  const blogHeroImage = mainWrapper.querySelector(':scope > p')?.querySelector(':scope > picture, :scope > img');
  let heroBlock = '';
  if (blogHeroImage) {
    mainWrapper.removeChild(blogH1);
    mainWrapper.removeChild(blogHeroImage.parentElement);
    heroBlock = buildBlock('blog-hero', { elems: [blogH1, blogHeroImage] });
  }
  mainWrapper.prepend(
    buildBlock('social-media', { elems: [] }),
    heroBlock,
  );
  mainWrapper.append(
    buildBlock('social-media', { elems: [] }),
    buildBlock('related-articles', { elems: [] }),
  );
  if (Array.from(main.children).length > 1) {
    main.removeChild(main.querySelector(':scope > div:last-child'));
  }
  main.append(
    buildBlock('popular-articles', { elems: [] }),
  );
}
