import { buildBlock } from '../../scripts/lib-franklin.js';

const social = `
  <a href="javascript:history.back()" aria-label="back" class="back-btn">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1697724519641"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 14.7071C7.31658 15.0976 6.68342 15.0976 6.2929 14.7071L2.29289 10.7071C1.90237 10.3166 1.90237 9.68342 2.29289 9.29289L6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289C8.09763 5.68342 8.09763 6.31658 7.70711 6.70711L5.41421 9L17 9C17.5523 9 18 9.44771 18 10C18 10.5523 17.5523 11 17 11L5.41421 11L7.70711 13.2929C8.09763 13.6834 8.09763 14.3166 7.70711 14.7071Z" fill="#4B5563"></path></svg>
    <span class="my-auto">Back</span>
  </a>
  <div class="social-links">
    <a href="javascript:window.print();" aria-label="print" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-print"></span>
    </a>
    <a href="javascript:window.open('//twitter.com/intent/tweet?' + location.href + '&title=' + encodeURI(document.title) )" aria-label="twitter" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-twitter"></span>
    </a>
    <a href="javascript:window.open('//www.linkedin.com/shareArticle?mini=true&url=' + location.href + '&title=' + document.title )" aria-label="linkedin" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-linkedin"></span>
    </a>
  </div>
`;

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  main.classList.add('mx-auto', 'max-w-7xl', 'flex', 'flex-row', 'gap-8', 'max-w-7xl', 'mx-auto', 'w-full', 'bg-white');
  const mainWrapper = main.querySelector(':scope > div');
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';

  const firstThreeChildren = Array.from(mainWrapper.children).slice(1, 4);
  firstThreeChildren.every((child) => {
    if (child.tagName === 'H1' && !blogH1) {
      blogH1 = child;
    } else if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }

    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) return false;
    return true;
  });

  mainWrapper.removeChild(blogH1);
  let heroBlock = '';
  let heroElements = [];
  if (blogHeroP2) {
    const blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    mainWrapper.removeChild(blogHeroP1);
    mainWrapper.removeChild(blogHeroP2);
    heroElements = [blogH1, blogHeroP1, blogHeroImage];
  } else if (blogHeroP1) {
    const blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    mainWrapper.removeChild(blogHeroP1);
    heroElements = [blogH1, blogHeroImage];
  } else {
    heroElements = [blogH1];
  }

  heroBlock = buildBlock('blog-hero', { elems: heroElements });
  mainWrapper.prepend(
    buildBlock('social-media', { elems: [social] }),
    heroBlock,
  );
  mainWrapper.append(
    buildBlock('social-media', { elems: [social] }),
    buildBlock('related-articles', { elems: [] }),
  );
}
