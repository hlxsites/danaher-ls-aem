import Carousel from '../../scripts/carousel.js';
import { button, div, span } from '../../scripts/dom-builder.js';
import { decorateModals } from '../../scripts/scripts.js';

// Default CTAs config (labels must be lowercase and trimmed)
const defaultCTAs = {
  "view product": {
    href: "https://lifesciences.danaher.com/us/en/products/family/polar.html",
    type: "secondary",
  },
  "talk to an expert": {
    href: "https://lifesciences.danaher.com/us/en/expert.html",
    type: "secondary",
  }
};

const SLIDE_DELAY = 3000;
const SLIDE_TRANSITION = 1000;

function normalizeLabel(label) {
  return label.trim().toLowerCase();
}

function configureNavigation(elementControls) {
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.innerHTML = `
    <span
      class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25"
    >
      <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  `;
  const nextBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-next': '' });
  nextBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
      <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  `;
  elementControls.prepend(previousBtn);
  elementControls.append(nextBtn);
  return elementControls;
}

function configurePagination(carouselControls, totalSlides) {
  carouselControls.append(span({ class: 'carousel-paginate text-base font-bold' }, `1/${totalSlides}`));
  return carouselControls;
}

function parseAndRenderSlide(slide) {
  const contentDiv = slide.querySelector('div');
  if (!contentDiv) return;
  const fields = Array.from(contentDiv.querySelectorAll('h2, h3, p'));
  if (!fields.length) return;

  const textNodes = [];
  const ctas = [];
  let i = 0;
  while (i < fields.length) {
    const el = fields[i];
    const txt = el.textContent.trim();
    const normTxt = normalizeLabel(txt);

    // Remove stray heading markers
    if (
      (el.nodeName === "H2" || el.nodeName === "H3") &&
      (normTxt === "h2" || normTxt === "h3")
    ) {
      i += 1;
      continue;
    }

    // CTA block: label, type, url
    if (
      el.nodeName === "P" &&
      i + 2 < fields.length &&
      fields[i + 1].nodeName === "P" &&
      fields[i + 2].nodeName === "P" &&
      (fields[i + 1].textContent.trim().toLowerCase() === "primary" ||
        fields[i + 1].textContent.trim().toLowerCase() === "secondary") &&
      /^https?:\/\//.test(fields[i + 2].textContent.trim())
    ) {
      ctas.push({
        text: txt,
        type: fields[i + 1].textContent.trim().toLowerCase(),
        href: fields[i + 2].textContent.trim(),
      });
      i += 3;
      continue;
    }

    // Any <p> whose text matches a default CTA label (case insensitive)
    if (
      el.nodeName === "P" &&
      defaultCTAs[normTxt]
    ) {
      const { href, type } = defaultCTAs[normTxt];
      ctas.push({
        text: txt,
        type,
        href,
      });
      i += 1;
      continue;
    }

    // Remove orphan CTA type/link lines
    if (
      el.nodeName === "P" &&
      (normTxt === "primary" ||
        normTxt === "secondary" ||
        /^https?:\/\//.test(normTxt))
    ) {
      i += 1;
      continue;
    }

    // Remove orphan heading markers in <p>
    if (
      el.nodeName === "P" &&
      (normTxt === "h2" || normTxt === "h3")
    ) {
      i += 1;
      continue;
    }

    // Otherwise, keep as a text node
    textNodes.push({ tag: el.nodeName.toLowerCase(), text: txt });
    i += 1;
  }

  // Clear and rebuild contentDiv
  contentDiv.innerHTML = "";

  // --- Centering and styling based on reference code ---
  const middleWrap = document.createElement("div");
  middleWrap.className = "flex flex-col justify-center h-full min-h-[28rem] md:min-h-[32rem] lg:min-h-[32rem]";

  // Eyebrow (first text, purple, small, margin-bottom)
  if (textNodes.length > 0) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow text-danaherpurple-500 font-medium text-base mb-4";
    eyebrow.textContent = textNodes[0].text;
    middleWrap.appendChild(eyebrow);
  }

  // Headline (second text, bold, large, margin-bottom)
  if (textNodes.length > 1) {
    const headline = document.createElement("h2");
    headline.className = "headline font-medium text-[2.5rem] leading-[3rem] mb-4";
    headline.textContent = textNodes[1].text;
    middleWrap.appendChild(headline);
  }

  // Subheader/product info (third text, normal, black, margin-bottom)
  if (textNodes.length > 2) {
    const subheader = document.createElement("p");
    subheader.className = "subheader font-medium text-xl text-black mb-8";
    subheader.textContent = textNodes[2].text;
    middleWrap.appendChild(subheader);
  }

  // Any remaining text fields as normal text
  for (let j = 3; j < textNodes.length; j++) {
    const p = document.createElement("p");
    p.className = "text-xl font-extralight tracking-tight leading-7 mt-6";
    p.textContent = textNodes[j].text;
    middleWrap.appendChild(p);
  }

  // Render CTAs as a group after all text, as in reference
  if (ctas.length) {
    const actions = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });
    ctas.forEach((cta, idx) => {
      const p = document.createElement('p');
      p.className = 'button-container';
      const a = document.createElement('a');
      a.textContent = cta.text;
      a.href = cta.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      // Reference style for primary/secondary
      if (cta.type === 'secondary') {
        a.className =
          'btn btn-lg font-medium btn-primary-purple rounded-full px-6 mt-0';
      } else {
        a.className =
          'btn btn-lg font-medium btn-outline-trending-brand rounded-full px-6 mt-0';
      }
      p.appendChild(a);
      actions.appendChild(p);
    });
    middleWrap.appendChild(actions);
  }

  contentDiv.appendChild(middleWrap);
}

export default function decorate(block) {
  block.parentElement.parentElement.querySelector('h1')?.classList.add('hidden');
  const uuid = crypto.randomUUID(4).substring(0, 6);
  if (block.querySelector('a[title="link"]')) block.parentElement.parentElement.classList.add(...'!px-6 !py-16 !sm:py-16'.split(' '));
  block.classList.add(...'relative min-h-[30rem] md:min-h-[37rem]'.split(' '));
  block.style = 'grid-auto-columns: 100%';
  block.classList.remove('block');
  block.classList.add(...'grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 scroll-smooth'.split(' '));
  const slides = [...block.children].map((ele, eleIndex) => {
    ele.classList.add(...`card carousel-slider flex snap-start list-none bg-white flex-col duration-${SLIDE_TRANSITION} ease-in-out inset-0 transition-transform transform`.split(' '));
    ele.setAttribute('data-carousel-item', (eleIndex + 1));
    parseAndRenderSlide(ele);

    const content = ele.querySelector('div');
    if (content) {
      content.classList.add(...'lg:w-1/2 px-4 lg:px-8 xl:pr-10 flex flex-col justify-center h-full'.split(' '));
    }
    const picture = ele.querySelector('picture');
    if (picture) {
      picture.querySelector('img').classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
      ele.append(div({ class: 'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2' }, picture));
    }
    decorateModals(ele);
    return { position: parseInt(eleIndex, 10), el: ele };
  }).filter((item) => item);

  // Carousel controls and navigation
  if (block.children.length >= 2 && block.parentElement.className.includes('carousel-wrapper')) {
    block.parentElement.classList.add(...'relative w-full'.split(' '));
    block.parentElement.setAttribute('data-carousel', 'slide');
    block.parentElement.setAttribute('id', uuid);
    const carouselControls = div({ class: 'relative md:absolute md:bottom-16 flex gap-x-4 items-center space-x-3 z-10 px-4 lg:px-8 xl:pr-10' });
    configurePagination(carouselControls, slides.length);
    configureNavigation(carouselControls);
    block.parentElement.append(div({ class: 'carousel-controls relative max-w-7xl mx-auto' }, carouselControls));
    if (block.classList.contains('add-border')) block.classList.add(...'border-t border-b border-solid border-black'.split(' '));
    setTimeout(() => {
      new Carousel({
        wrapperEl: uuid,
        mainEl: '.carousel',
        delay: SLIDE_DELAY,
        previousElAction: 'button[data-carousel-prev]',
        nextElAction: 'button[data-carousel-next]',
        isAutoPlay: true,
        copyChild: 1,
        onChange: (elPosition) => {
          const currentSlide = elPosition.target.getAttribute('data-carousel-item');
          const carouselPaginate = block?.parentElement?.querySelector('.carousel-paginate');
          if (block.children.length > 1 && elPosition && elPosition.target) {
            if (carouselPaginate) carouselPaginate.innerHTML = `${parseInt(currentSlide, 10)}/${slides.length}`;
          }
        },
      });
    }, 5000);
  }
}
