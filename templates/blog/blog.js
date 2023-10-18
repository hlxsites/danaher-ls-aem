import { buildBlock } from '../../scripts/lib-franklin.js';

const social = `
                    <div class="flex items-center gap-4 back-btn">
                      <a href="javascript:history.back()" class="rounded-lg flex gap-4 transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
                        <span class="my-auto icon icon-icon-arrow-left"></span>
                        <span class="my-auto">Back</span>
                      </a>
                    </div>
                    <div class="flex items-center gap-3 social-links">
                      <a href="javascript:window.print();" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
                        <span class="icon icon-print"></span>
                      </a>
                      <a href="javascript:window.open('//twitter.com/intent/tweet?' + location.href + '&title=' + encodeURI(document.title) )" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
                        <span class="icon icon-twitter"></span>
                      </a>
                      <a href="javascript:window.open('//www.linkedin.com/shareArticle?mini=true&url=' + location.href + '&title=' + document.title )" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
                        <span class="icon icon-linkedin"></span>
                      </a>
                    </div>
                `;

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const mainSelector = main.querySelector('div.breadcrumb') ? ':scope > div:nth-child(2)' : ':scope > div';
  const mainWrapper = main.querySelector(mainSelector);
  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';
  let blogVideo = [];
  const mainChildren = Array.from(mainWrapper.children);
  mainChildren.forEach((item) => {
    const videoItem = item.querySelector('a');
    if (videoItem && videoItem.hostname.match('www.youtube.com') && videoItem.getAttribute('href')) {
      blogVideo = [videoItem];
    }
  });

  const firstThreeChildren = Array.from(mainWrapper.children).slice(0, 3);
  firstThreeChildren.every((child) => {
    if (child.tagName === 'H1' && !blogH1) {
      blogH1 = child;
    } else if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }

    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) {
      return false;
    }
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
    buildBlock('embed', { elems: blogVideo }),
    buildBlock('social-media', { elems: [social] }),
  );
  main.append(
    buildBlock('recent-articles', { elems: [] }),
  );
}
