export default function decorate(block) {
  const main = document.querySelector('main');
  if (!main) return;

  // Move banner blocks as first child of section
  let section = main.querySelector('section');
  if (!section) {
    section = document.createElement('section');
    main.appendChild(section);
  }
  const bannerBlocks = Array.from(main.children).filter(
    (el) => el.classList?.contains('banner-block') && el.parentElement === main
  );
  if (block.classList?.contains('banner-block') && block.parentElement === main && !bannerBlocks.includes(block)) {
    bannerBlocks.push(block);
  }
  bannerBlocks.forEach(banner => {
    section.insertBefore(banner, section.firstChild);
  });

  const content = block.querySelector('div');
  const isBlogPath = window.location.pathname.startsWith('/us/en/blog');
  const isNewsPath = window.location.pathname.startsWith('/us/en/news');

  // Remove all old background classes first
  content.parentNode.classList.remove('banner-gradient-bg', 'banner-white-bg');
  content.parentNode.classList.add(
    isBlogPath || isNewsPath ? 'banner-white-bg' : 'banner-gradient-bg',
    'banner-no-padding'
  );

  // Remove px/py classes, use CSS
  content.parentNode.classList.remove('px-6', 'py-4', 'py-2', 'py-0');
  content.classList.add('relative', 'h-auto', 'w-full', 'flex', 'justify-start', 'items-start');
  content.classList.remove('py-4', 'py-2', 'py-0', 'banner-no-padding');
  content.classList.add('banner-no-padding');

  // Inner content
  const innerContent = content?.querySelector('div');
  if (innerContent) {
    innerContent.classList.add('max-w-7xl', 'mx-auto', 'w-full', 'text-left');
    innerContent.classList.remove('p-4', 'p-2', 'p-0');
    innerContent.classList.add('banner-no-padding');
  }

  // Headline
  const contentH1 = innerContent?.querySelector('h1');
  if (contentH1) {
    contentH1.classList.add('!text-4xl', 'font-extrabold', 'tracking-tight', 'text-left');
    contentH1.classList.remove('banner-headline-black', 'banner-headline-white');
    contentH1.classList.add(
      (isBlogPath || isNewsPath) ? 'banner-headline-black' : 'banner-headline-white'
    );
  }

  // Subtitle
  const contentH2 = innerContent?.querySelector('h2');
  if (contentH2) {
    contentH2.classList.add('w-full', 'md:w-3/4', '!text-lg', 'font-normal', 'tracking-tight', 'text-left');
    contentH2.classList.remove('banner-subtitle-black', 'banner-subtitle-white');
    contentH2.classList.add(
      (isBlogPath || isNewsPath) ? 'banner-subtitle-black' : 'banner-subtitle-white'
    );
  }

  // Remove button container for lighter DOM
  const buttonContainer = document.querySelector('.button-container');
  if (buttonContainer) buttonContainer.remove();
}
