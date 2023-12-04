import { button, div } from "../../scripts/dom-builder.js";

var initiateSlider;
const SLIDE_DELAY = 4000;
const SLIDE_TRANSITION = 500;
// const AUTO_PLAY = true;

function serializeSliders(carouselId, { navigation, pagination }) {
  const element = document.getElementById(carouselId);
  const sliders = element.querySelectorAll(".carousel-slider");
  sliders.forEach((item, index) => {
    if (index === 0) {
      item.setAttribute("data-carousel-item", "active");
      item.classList.add("translate-x-0");
    } else {
      item.setAttribute("data-carousel-item", "");
      if (
        item.previousElementSibling.getAttribute("data-carousel-item") ===
        "active"
      )
        item.classList.add("translate-x-full");
      else item.classList.add("-translate-x-full");
    }
  });
}

function configureNavigation(carouselId) {
  const element = document.getElementById(carouselId);
  const previousBtn = button({ type: 'button', class: 'absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.innerHTML = `
    <span
      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50"
    >
      <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  `;
  const nextBtn = button({ type: 'button', class: 'absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  nextBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
      <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  `;
  element.append(previousBtn);
  element.append(nextBtn);
}

function configurePagination(carouselId) {
  const element = document.getElementById(carouselId);
  const paginateWrapper = div({ class: 'absolute z-10 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3' });
  for (let index = 0; index < element.querySelectorAll(".carousel-slider").length; index++) {
    paginateWrapper.append(button({ class: `w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-stone-200'}`, type: 'button', 'aria-current': 'true', 'aria-label': `Slide ${index}`, 'data-carousel-slide-to': index }));
  }
  element.append(paginateWrapper);
}

function previousSlide() {
  const element = document.getElementById(carouselId);
  const activeSlide = element.querySelector('');
}

function nextSlide() {}
  
function carouselControls(carouselId) {
    const element = document.getElementById(carouselId);
    const sliders = element.querySelectorAll(".carousel-slider");
    initiateSlider = setInterval(() => {
      var counter = 0;
      sliders.forEach((item, index) => {
        item.classList.remove("hidden");
        if (
          item.getAttribute("data-carousel-item") === "active" &&
          !item.nextElementSibling
        ) {
          sliders[0].setAttribute("data-carousel-item", "active");
          sliders[0].classList.replace("-translate-x-full", "translate-x-0");
        }
        if (item.getAttribute("data-carousel-item") !== "active") {
          if (counter === 1) {
            item.setAttribute("data-carousel-item", "active");
            item.classList.replace("translate-x-full", "translate-x-0");
            item.classList.replace("-translate-x-full", "translate-x-0");
          } else {
            if (
              item.previousElementSibling &&
              item.previousElementSibling.getAttribute("data-carousel-item") ===
                "active"
            ) {
              item.classList.replace("-translate-x-full", "translate-x-full");
            }
          }
          counter = 0;
        } else {
          item.setAttribute("data-carousel-item", "");
          if (item.nextElementSibling) item.classList.replace("translate-x-0", "-translate-x-full");
          else item.classList.replace("translate-x-0", "translate-x-full");
          counter = 1;
        }
          if (
            element.querySelector(".translate-x-full") &&
            element.querySelector(".translate-x-full").nextElementSibling
          ) {
            element
              .querySelector(".translate-x-full")
              .nextElementSibling.classList.add("hidden");
          }
          if (
            element.querySelector(".translate-x-full") &&
            element.querySelector(".translate-x-full").nextElementSibling &&
            element.querySelector(".translate-x-full").nextElementSibling
              .nextElementSibling
          ) {
            element
              .querySelector(".translate-x-full")
              .nextElementSibling.nextElementSibling.classList.add("hidden");
          }
      });
    }, SLIDE_DELAY);
}

export default function decorate(block) {
    const uuid = self.crypto.randomUUID(4).substring(0, 6);
    block.classList.add(...'relative h-56 md:h-[40rem] overflow-hidden rounded-lg'.split(' '));
    if (block.parentElement.className.includes('carousel-wrapper')) {
        block.parentElement.classList.add(...'relative w-full hidden'.split(' '));
        block.parentElement.style.backgroundImage = "linear-gradient(to right bottom, rgb(67, 15, 159), rgb(93, 18, 181), rgb(120, 20, 204), rgb(148, 20, 226), rgb(177, 16, 247))";
        block.parentElement.setAttribute('data-carousel', 'slide');
        block.parentElement.setAttribute('id', uuid);
    }
    let groupElements = [...block.children[0].children].reduce(function(prev, curr, index) {
        if (prev.length && (index % 2) === 0) prev[prev.length - 1].push(curr)
        else  prev.push([curr])
        return prev;
    }, []);
    block.innerHTML = '';
    groupElements.map(ele => {
        if (ele.length > 1) {
            const carouselSlider = div({ class: `carousel-slider duration-${SLIDE_TRANSITION} ease-in-out absolute inset-0 transition-transform z-10`, 'data-carousel-item': ''});
            ele.map((el, index) => {
                if (index === 0) {
                  el.classList.add(...'px-4 sm:px-10 lg:w-1/2 xl:pr-10 space-y-6'.split(' '));
                  if (el.querySelector('p')) el.querySelector('p').classList.add(...'text-4xl font-extrabold tracking-tight text-white md:text-5xl'.split(' '));
                  carouselSlider.append(div({ class: 'mx-auto w-full max-w-7xl pt-8 h-97 md:h-auto overflow-hidden md:pt-16 pb-20 lg:py-48 lg:text-left' }, el));
                } else {
                  el.classList.add(...'relative h-1/2 w-full md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2'.split(' '));
                  el.querySelector('img').classList.add(...'absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'.split(' '));
                  carouselSlider.append(el);
                }
                return index;
            });
            block.append(carouselSlider);
            return carouselSlider;
        }
    }).filter(item => item);
    serializeSliders(uuid, { navigation: true, pagination: true });
    configureNavigation(uuid);
    configurePagination(uuid);
    if (block.parentElement.className.includes('carousel-wrapper')) block.parentElement.classList.remove("hidden");
    carouselControls(uuid);
}