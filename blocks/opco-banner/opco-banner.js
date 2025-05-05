import { button, img, div, h1, p, span } from '../../scripts/dom-builder.js';

function configureNavigation(wrapper, updateSlide) {
  const nav = div({ class: 'flex gap-4 items-center justify-center mt-4' });

  const prevBtn = button({
    'aria-label': 'Previous',
    class: 'carousel-prev flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-black',
  }, '‹');

  const nextBtn = button({
    'aria-label': 'Next',
    class: 'carousel-next flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-black',
  }, '›');

  prevBtn.addEventListener('click', () => updateSlide(-1));
  nextBtn.addEventListener('click', () => updateSlide(1));

  nav.append(prevBtn, nextBtn);
  wrapper.append(nav);
}

function configurePagination(wrapper, currentIndex, total) {
  const pagination = wrapper.querySelector('.carousel-paginate');
  if (pagination) {
    pagination.textContent = `${currentIndex + 1}/${total}`;
  }
}

export default function decorate(block) {
  block.textContent = '';

  // === LEFT CONTENT ===
  const title = document.querySelector("[data-aue-prop='brand_title']")?.textContent || '';
  const description = document.querySelector("[data-aue-prop='brand_description']")?.textContent || '';
  const ctaText = document.querySelector("[data-aue-prop='link']")?.textContent || 'Browse';

  const left = div({ class: 'w-full md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
    img({
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/SCIEX_logo.svg/2560px-SCIEX_logo.svg.png',
      alt: 'SCIEX Logo',
      class: 'h-8 w-auto',
    }),
    h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, title),
    p({ class: 'text-gray-600' }, description),
    button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
    }, ctaText)
  );

  // === RIGHT CONTENT ===
  const right = div({ class: 'w-full md:w-1/2 bg-gray-50 flex flex-col justify-center items-center px-10 py-12 relative' });

  const items = [...document.querySelectorAll("[data-aue-label='Opco-Banner-Item']")];
  const slides = [];
  const slidesWrapper = div({ class: 'carousel-slides w-full text-center space-y-4' });

  items.forEach((item, index) => {
    const heading = item.querySelector("[data-aue-prop='brand_title']")?.textContent || '';
    const desc = item.querySelector("[data-aue-prop='brand_description']")?.textContent || '';
    const link1 = item.querySelector("[data-aue-prop='link1']")?.textContent || '';
    const link2 = item.querySelector("[data-aue-prop='link2']")?.textContent || '';
    const cta = item.querySelector("[data-aue-prop='link3']")?.textContent || '';
    const imgSrc = item.querySelector("img")?.getAttribute("src") || '';

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} flex-col items-center space-y-4`,
    },
      img({ src: imgSrc, class: 'h-48 object-contain mx-auto' }),
      h1({ class: 'text-xl md:text-2xl font-semibold text-gray-900' }, heading),
      div({ class: 'flex justify-center gap-4 text-sm text-purple-600 font-medium' },
        span({}, link1),
        span({}, link2)
      ),
      p({ class: 'text-gray-600 max-w-md mx-auto' }, desc),
      button({ class: 'bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition' }, cta)
    );

    slides.push(slide);
    slidesWrapper.append(slide);
  });

  right.append(slidesWrapper);

  // Pagination text
  right.append(span({
    class: 'carousel-paginate text-base font-bold mt-2 block text-center',
  }, `1/${slides.length}`));

  // Slide index logic
  let currentIndex = 0;

  const updateSlide = (direction) => {
    slides[currentIndex].classList.add('hidden');
    slides[currentIndex].classList.remove('block');
    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    slides[currentIndex].classList.remove('hidden');
    slides[currentIndex].classList.add('block');
    configurePagination(right, currentIndex, slides.length);
  };

  configureNavigation(right, updateSlide);

  const container = div({ class: 'flex flex-col md:flex-row bg-white' }, left, right);
  block.append(container);
}
