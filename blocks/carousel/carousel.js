import { button, div, span } from '../../scripts/dom-builder.js';

const SLIDE_DELAY = 5000;
const SLIDE_TRANSITION = 500;

function previousSlide(evt) {
  const element = evt.currentTarget.element;
  const sliders = element.querySelectorAll('div[data-carousel-item]');
  let counter = 0;
  for (let index = sliders.length - 1; index >= 0; index -= 1) {
    const isActive = ['active'].includes(sliders[index].getAttribute('data-carousel-item'));

    sliders[index].classList.remove('hidden');
    if (isActive && !sliders[index].previousElementSibling) {
      document.querySelector('.carousel-paginate').innerHTML = `${itemIndex+1}/${sliders.length}`;
      // SET LAST SLIDE ACTIVE IF THERE IS NO PREVIOUS SIBLING ( WORKS FOR FIRST INDEX POSITION SLIDE ONLY )
      sliders[sliders.length-1].setAttribute('data-carousel-item', 'active');
      sliders[sliders.length-1].classList.replace('-translate-x-full', 'translate-x-0');
    }
    if (!isActive) {
      if (counter === 1) {
        document.querySelector('.carousel-paginate').innerHTML = `${itemIndex+1}/${sliders.length}`;
        // SET THE CURRENT SLIDE ACTIVE
        sliders[index].setAttribute('data-carousel-item', 'active');
        sliders[index].classList.replace('-translate-x-full', 'translate-x-0');
      } else if (sliders[index].nextElementSibling && ['active'].includes(sliders[index].nextElementSibling.getAttribute('data-carousel-item'))) {

        sliders[index].classList.replace('translate-x-full', '-translate-x-full');
      }
      counter = 0;
    } else {
      // MAKE CHANGES FOR THE CURRENT SLIDE ( TO NULLIFY ITS ACTIVE STATUS )
      sliders[index].setAttribute('data-carousel-item', '');
      if (sliders[index].previousElementSibling) {
        sliders[index].classList.replace('translate-x-0', 'translate-x-full');
        if (sliders[index].nextElementSibling) {
          sliders[index].nextElementSibling.classList.add('hidden');
          sliders[index].nextElementSibling.classList.replace('translate-x-full', '-translate-x-full');
        }
        else sliders[0].classList.replace('translate-x-full', '-translate-x-full');
      }
      else {
        // SET FIRST-INDEX-POSITION-SLIDE TO NEGATIVE POSITION IF THERE IS NO PREVIOUS SIBLING ( WORKS FOR FIRST-INDEX-POSITION-SLIDE ONLY )
        sliders[index].classList.replace('translate-x-0', 'translate-x-full');
      }
      counter = 1;
    }
  }
}

function nextSlide(evt) {
  const element = evt.currentTarget.element;
  const sliders = element.querySelectorAll('div[data-carousel-item]');
  // console.log(allSlides);
  let counter = 0;
  sliders.forEach((item, itemIndex) => {
    item.classList.remove('hidden');
    if (['active'].includes(item.getAttribute('data-carousel-item')) && !item.nextElementSibling) {
      document.querySelector('.carousel-paginate').innerHTML = `${itemIndex+1}/${sliders.length}`;
      sliders[0].setAttribute('data-carousel-item', 'active');
      sliders[0].classList.replace('-translate-x-full', 'translate-x-0');
    }
    if (item.getAttribute('data-carousel-item') !== 'active') {
      if (counter === 1) {
        document.querySelector('.carousel-paginate').innerHTML = `${itemIndex+1}/${sliders.length}`;
        item.setAttribute('data-carousel-item', 'active');
        item.classList.replace('translate-x-full', 'translate-x-0');
        item.classList.replace('-translate-x-full', 'translate-x-0');
      } else if (item.previousElementSibling && ['active'].includes(item.previousElementSibling.getAttribute('data-carousel-item'))) {
        item.classList.replace('-translate-x-full', 'translate-x-full');
      }
      counter = 0;
    } else {
      item.setAttribute('data-carousel-item', '');
      if (item.nextElementSibling) item.classList.replace('translate-x-0', '-translate-x-full');
      else item.classList.replace('translate-x-0', 'translate-x-full');
      counter = 1;
    }
    if (element.querySelector('.translate-x-full') && element.querySelector('.translate-x-full').nextElementSibling) {
      element.querySelector('.translate-x-full').nextElementSibling.classList.add('hidden');
      if (element.querySelector('.translate-x-full').nextElementSibling.nextElementSibling) element.querySelector('.translate-x-full').nextElementSibling.nextElementSibling.classList.add('hidden');
    }
  });
}

function serializeSliders(element) {
  const sliders = element.querySelectorAll('.carousel-slider');
  sliders.forEach((item, index) => {
    if (index === 0) {
      item.setAttribute('data-carousel-item', 'active');
      item.classList.add('translate-x-0');
    } else {
      item.setAttribute('data-carousel-item', '');
      if (item.previousElementSibling.getAttribute('data-carousel-item') === 'active') item.classList.add('translate-x-full');
      else item.classList.add('-translate-x-full');
    }
  });
}

function configureNavigation(element) {
  const elementControls = element.querySelector('.carousel-controls');
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.addEventListener('click', previousSlide, false);
  previousBtn.element = element;
  previousBtn.innerHTML = `
    <span
      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25"
    >
      <svg class="w-4 h-4 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  `;
  const nextBtn = button({ type: 'button', class: 'flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  nextBtn.addEventListener('click', nextSlide, false);
  nextBtn.element = element;
  nextBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
      <svg class="w-4 h-4 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  `;
  elementControls.prepend(previousBtn);
  elementControls.append(nextBtn);
}

function configurePagination(element) {
  const paginateWrapper = div({ class: 'carousel-controls absolute z-10 flex items-center -translate-x-1/2 bottom-5 left-32 space-x-3' });
  paginateWrapper.append(span({ class: 'carousel-paginate text-base font-bold' }, `1/${element.querySelectorAll('.carousel-slider').length}`));
  element.append(paginateWrapper);
}

function carouselControls(element) {
  const sliders = element.querySelectorAll('.carousel-slider');
  setInterval(() => {
    let counter = 0;
    sliders.forEach((item, itemIndex) => {
      const isActive = ['active'].includes(item.getAttribute('data-carousel-item'));
      item.classList.remove('hidden');
      if (isActive && !item.nextElementSibling) {
        document.querySelector('.carousel-paginate').innerHTML = `${itemIndex+1}/${sliders.length}`;
        sliders[0].setAttribute('data-carousel-item', 'active');
        sliders[0].classList.replace('-translate-x-full', 'translate-x-0');
      }
      if (!isActive) {
        if (counter === 1) {
          item.setAttribute('data-carousel-item', 'active');
          document.querySelector('.carousel-paginate').innerHTML = `${itemIndex+1}/${sliders.length}`;
          item.classList.replace('translate-x-full', 'translate-x-0');
          item.classList.replace('-translate-x-full', 'translate-x-0');
        } else if (item.previousElementSibling && ['active'].includes(item.previousElementSibling.getAttribute('data-carousel-item'))) {
          item.classList.replace('-translate-x-full', 'translate-x-full');
        }
        counter = 0;
      } else {
        item.setAttribute('data-carousel-item', '');
        if (item.nextElementSibling) item.classList.replace('translate-x-0', '-translate-x-full');
        else item.classList.replace('translate-x-0', 'translate-x-full');
        counter = 1;
      }
      if (element.querySelector('.translate-x-full') && element.querySelector('.translate-x-full').nextElementSibling) {
        element.querySelector('.translate-x-full').nextElementSibling.classList.add('hidden');
        if (element.querySelector('.translate-x-full').nextElementSibling.nextElementSibling) element.querySelector('.translate-x-full').nextElementSibling.nextElementSibling.classList.add('hidden');
      }
    });
  }, SLIDE_DELAY);
}

export default function decorate(block) {
  // console.log(block);
  const uuid = crypto.randomUUID(4).substring(0, 6);
  block.classList.add(...'relative h-56 md:h-[40rem] overflow-hidden'.split(' '));
  const groupElements = [...block.children].reduce((prev, curr, index) => {
    // console.log(prev, curr, index);
    // if (prev.length && (index % 2) === 0) prev[prev.length - 1].push(curr);
    // else prev.push([curr]);
    // return prev;
    prev.push([...curr.children]);
    return prev;
  }, []);
  // console.log(groupElements);
  block.innerHTML = '';
  groupElements.map((ele, eleIndex) => {
    if (ele.length > 1) {
      const carouselSlider = div({ class: `${eleIndex} carousel-slider duration-${SLIDE_TRANSITION} ease-in-out absolute inset-0 transition-transform z-10`, 'data-carousel-item': '' });
      ele.map((el, index) => {
        if (index === 0) {
          el.classList.add(...'px-4 sm:px-10 lg:w-1/2 xl:pr-10 space-y-6 pb-20 pt-8 md:pt-16 lg:py-20'.split(' '));
          if (el.querySelector('h2')) el.querySelector('h2').classList.add(...'text-4xl font-normal leading-[64px] tracking-tight'.split(' '));
          if (el.querySelector('p')) el.querySelector('p').classList.add(...'text-xl font-extralight tracking-tight'.split(' '));
          if (el.querySelector('.button-container')) {
            el.querySelector('.button-container').querySelectorAll('.btn').forEach((elBtn, elBtnIndex) => {
              if (index === 0) elBtn.className = `btn btn-lg ${elBtnIndex === 0 ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
            });
          }
          carouselSlider.append(div({ class: 'mx-auto w-full max-w-7xl h-97 md:h-auto overflow-hidden lg:text-left' }, el));
        } else {
          el.classList.add(...'relative h-1/2 w-full md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2'.split(' '));
          el.querySelector('img').classList.add(...'absolute block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'.split(' '));
          carouselSlider.append(el);
        }
        return index;
      });
      // console.log(carouselSlider);
      block.append(carouselSlider);
      return carouselSlider;
    }
    return null;
  }).filter((item) => item);
  if (block.parentElement.className.includes('carousel-wrapper')) {
    block.parentElement.classList.add(...'relative w-full hidden'.split(' '));
    block.parentElement.setAttribute('data-carousel', 'slide');
    block.parentElement.setAttribute('id', uuid);
    serializeSliders(block.parentElement, { navigation: true, pagination: true });
    configurePagination(block.parentElement);
    configureNavigation(block.parentElement);
    block.parentElement.classList.remove('hidden');
    carouselControls(block.parentElement);
  }
}
