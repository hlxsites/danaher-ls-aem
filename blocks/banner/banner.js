export default function decorate(block) {
  const main = document.querySelector('main');
  if (!main) return;

  // --- Move any banner blocks that are direct children of main into the top of the first section ---
  let section = main.querySelector('section');
  if (!section) {
    // If no section exists, create one and append to main
    section = document.createElement('section');
    main.appendChild(section);
  }

  // Find any banner blocks that are direct children of main (not inside section)
  const bannerBlocks = Array.from(main.children).filter(
    (el) => el.classList && el.classList.contains('banner-block') && el.parentElement === main
  );

  // Also include the current block if it's not already in section
  if (
    block.classList &&
    block.classList.contains('banner-block') &&
    block.parentElement === main &&
    !bannerBlocks.includes(block)
  ) {
    bannerBlocks.push(block);
  }

  // Move each banner block into the first section (at the top)
  bannerBlocks.forEach((banner) => {
    section.insertBefore(banner, section.firstChild);
  });

  // --- Banner block decoration logic ---
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

  // Common layout styles
  content.parentNode.classList.add('px-6');
  content.classList.add(
    ...'relative min-h-[13rem] h-max w-full flex justify-start items-center'.split(' ')
  );

  const innerContent = content?.querySelector('div');
  const contentH1 = innerContent?.querySelector('h1');
  const contentH2 = innerContent?.querySelector('h2');

  // Conditional text color
  if (isBlogPath || isNewsPath) {
    innerContent?.classList.add(
      ...'relative max-w-7xl mx-auto w-full p-4 text-black'.split(' ')
    );
    contentH1?.classList.add(
      ...'!text-4xl font-extrabold tracking-tight text-black'.split(' ')
    );
    contentH2?.classList.add(
      ...'w-full md:w-3/4 !text-lg font-normal tracking-tight text-black'.split(' ')
    );
  } else {
    innerContent?.classList.add(
      ...'relative max-w-7xl mx-auto w-full p-4 text-white'.split(' ')
    );
    contentH1?.classList.add(
      ...'!text-4xl font-extrabold tracking-tight text-white'.split(' ')
    );
    contentH2?.classList.add(
      ...'w-full md:w-3/4 !text-lg font-normal tracking-tight text-white'.split(' ')
    );
  }
}
