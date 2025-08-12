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
    (el) => el.classList && el.classList.contains('banner-block') && el.parentElement === main
  );
  if (block.classList && block.classList.contains('banner-block') && block.parentElement === main 
      && !bannerBlocks.includes(block)
  ) 
  {
    bannerBlocks.push(block);
  }
  bannerBlocks.forEach((banner) => {
    section.insertBefore(banner, section.firstChild);
  });

  // Banner block styles
  const content = block.querySelector('div');
  const isBlogPath = window.location.pathname.startsWith('/us/en/blog');
  const isNewsPath = window.location.pathname.startsWith('/us/en/news');

  // Set background
  if (isBlogPath || isNewsPath) {
    content.parentNode.setAttribute('style', 'background: white');
  } else {
    content.parentNode.setAttribute(
      'style',
      'background: linear-gradient(to right bottom, #430f9f, #5d12b5, #7814cc, #9414e2, #b110f7)'
    );
  }

  // Remove vertical padding from wrappers and reduce top margin on banner
  content.parentNode.classList.remove('px-6', 'py-4', 'py-2', 'py-0');
  content.parentNode.style.padding = '0';
  content.parentNode.style.marginTop = '0'; // Make sure no parent margin
  content.classList.add('relative', 'h-auto', 'w-full', 'flex', 'justify-start', 'items-start');
  content.classList.remove('py-4', 'py-2', 'py-0');
  content.style.minHeight = '0';
  content.style.padding = '0';
  content.style.marginTop = '0';

  // Tighter inner content, left align, remove vertical spacing
  const innerContent = content?.querySelector('div');
  if (innerContent) {
    innerContent.classList.add('max-w-7xl', 'mx-auto', 'w-full', 'text-left');
    innerContent.classList.remove('p-4', 'p-2', 'p-0');
    innerContent.style.padding = '0';
    innerContent.style.textAlign = 'left';
    innerContent.style.marginTop = '0';
  }

  // Headline (h1): only margin-bottom for spacing, left align, no top margin
  const contentH1 = innerContent?.querySelector('h1');
  if (contentH1) {
    contentH1.style.marginTop = '0';
    contentH1.style.marginBottom = '2rem'; // minimal spacing to next row, adjust if needed
    contentH1.style.marginLeft = '0';
    contentH1.style.marginRight = '0';
    contentH1.style.padding = '0';
    contentH1.style.textAlign = 'left';
    contentH1.classList.add('!text-4xl', 'font-extrabold', 'tracking-tight', 'text-left');
    if (isBlogPath || isNewsPath) {
      contentH1.classList.add('text-black');
      contentH1.classList.remove('text-white');
    } else {
      contentH1.classList.add('text-white');
      contentH1.classList.remove('text-black');
    }
  }

  // Subtitle (h2): Remove top margin, left align
  const contentH2 = innerContent?.querySelector('h2');
  if (contentH2) {
    contentH2.style.margin = '0';
    contentH2.style.padding = '0';
    contentH2.style.textAlign = 'left';
    contentH2.classList.add('w-full', 'md:w-3/4', '!text-lg', 'font-normal', 'tracking-tight', 'text-left');
    if (isBlogPath || isNewsPath) {
      contentH2.classList.add('text-black');
      contentH2.classList.remove('text-white');
    } else {
      contentH2.classList.add('text-white');
      contentH2.classList.remove('text-black');
    }
  }
  const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
    buttonContainer.remove();
  }
}
