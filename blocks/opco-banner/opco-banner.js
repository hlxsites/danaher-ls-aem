import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const wrapper = block;
  console.log('🟣 Starting decorate() for opco-banner');

  // === Extract Left Content ===
  const leftTitleEl = wrapper.querySelector("[data-aue-label='LeftTitle']");
  const leftHeadingEl = wrapper.querySelector("[data-aue-label='LeftHeading']");
  const leftDescEl = wrapper.querySelector("[data-aue-label='LeftDescription'] p");
  const leftImgEl = wrapper.querySelector("img[data-aue-label='LeftImage']");
  const leftCtaEl = wrapper.querySelector("p[data-aue-label='Link']");

  // Individually extract brand links
  const link1El = wrapper.querySelector("p[data-aue-label='Link1']");
  const link2El = wrapper.querySelector("p[data-aue-label='Link2']");
  const link3El = wrapper.querySelector("p[data-aue-label='Link3']");
  const link4El = wrapper.querySelector("p[data-aue-label='Link4']");
  const link5El = wrapper.querySelector("p[data-aue-label='Link5']");
  const link6El = wrapper.querySelector("p[data-aue-label='Link6']");

  // Build link grid dynamically (2 per row, only if present)
  const linkGrid = div({ class: 'flex flex-col gap-2' });
  const linkPairs = [
    [link1El, link2El],
    [link3El, link4El],
    [link5El, link6El],
  ];

  linkPairs.forEach(([linkA, linkB]) => {
    const row = div({ class: 'flex gap-2' });
    if (linkA) row.append(span({ class: 'text-purple-700 bg-purple-50 text-sm font-medium px-3 py-1 rounded' }, linkA.textContent.trim()));
    if (linkB) row.append(span({ class: 'text-purple-700 bg-purple-50 text-sm font-medium px-3 py-1 rounded' }, linkB.textContent.trim()));
    if (row.childNodes.length > 0) linkGrid.appendChild(row);
  });

  const left = div({ class: 'md:w-1/2 h-full flex flex-col justify-center items-start px-10 py-4 space-y-4' });

  if (leftImgEl) left.append(img({ src: leftImgEl.src, alt: leftImgEl.alt || 'Left image', class: 'h-40 w-auto' }));
  if (leftHeadingEl) left.append(p({ class: 'text-blue-700 font-semibold text-sm' }, leftHeadingEl.textContent.trim()));
  if (leftTitleEl) left.append(h1({ class: 'text-2xl font-bold text-gray-900 leading-snug' }, leftTitleEl.textContent.trim()));
  if (leftDescEl) left.append(p({ class: 'text-gray-600 text-start' }, leftDescEl.textContent.trim()));
  if (linkGrid.childNodes.length > 0) left.append(linkGrid);
  if (leftCtaEl) {
    left.append(button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
      onclick: () => window.location.href = '#',
    }, leftCtaEl.textContent.trim()));
  }

  // === Right Carousel Content ===
  const items = wrapper.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  console.log(`🟠 Found ${items.length} carousel item(s)`);

  const slides = [];
  items.forEach((item, index) => {
    const titleEl = item.querySelector("[data-aue-label='Title']");
    const descEl = item.querySelector("[data-aue-label='RightDescription'] p");
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const smallTitle = item.querySelector("[data-aue-label='smallTitle']");
    const link3El = item.querySelector("[data-aue-label='Link3']");

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} text-center space-y-4`,
      'data-index': index,
    });

    if (imgEl) slide.append(img({ src: imgEl.src, alt: titleEl?.textContent || 'Slide image', class: 'w-full max-w-sm h-40 object-contain mx-auto' }));
    if (titleEl) slide.append(h1({ class: 'text-lg md:text-xl font-semibold text-gray-900' }, titleEl.textContent.trim()));
    if (smallTitle) slide.append(p({ class: 'text-base font-medium text-gray-600' }, smallTitle.textContent.trim()));
    if (descEl) slide.append(p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, descEl.textContent.trim()));
    if (link3El) slide.append(button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, link3El.textContent.trim()));

    if (slide.childNodes.length > 0) slides.push(slide);
  });

  const numberIndicator = span({ class: 'font-bold text-gray-700' }, `1/${slides.length}`);
  let currentIndex = 0;

  const updateSlides = (dir) => {
    const total = slides.length;
    slides[currentIndex].classList.add('hidden');
    currentIndex = (currentIndex + dir + total) % total;
    slides[currentIndex].classList.remove('hidden');
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
    console.log(`🔄 Slide changed to ${currentIndex + 1}`);
  };

  const controls = div({ class: 'flex items-center justify-center gap-4 mt-4' },
    button({
      class: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300',
      onclick: () => updateSlides(-1),
    }, '<'),
    numberIndicator,
    button({
      class: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300',
      onclick: () => updateSlides(1),
    }, '>')
  );

  const right = div({
    class: 'md:w-1/2 h-full bg-gray-100 flex flex-col justify-center items-center px-10 py-4',
  },
    ...slides,
    controls
  );

  const container = div({
    class: 'flex flex-col md:flex-row w-full bg-white min-h-screen',
  });

  container.append(left, right);
  block.append(container);

  console.log('✅ decorate() complete.');
}
