import {
  div, span, h6, p, h2,a,img,h4,h1, button,section,h3

} from '../../scripts/dom-builder.js';
export default function decorate(block) {
  block.innerHtml = "";
const sectionWrapper = div({
  class: 'w-full flex justify-start bg-white py-12 px-8'
});

const productCategoryContainer = div({
  class: 'w-full max-w-screen-xl pl-4'
},
  h2({
    class: 'text-xl font-semibold text-gray-900 mb-6'
  }, 'Product Categories')
);

// Grid layout
const productGrid = div({
  class: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-8'
});

const products = [
  { title: "Cellular Imaging Systems", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Laboratory Microscopes", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Electron Microscopes", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Surgical Microscopes", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Digital Microscopes", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Stereo Microscopes", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Confocal Systems", image: "/icons/sciex-7500-system-beyond01-hero.avif" },
  { title: "Fluorescence Microscopes", image: "/icons/sciex-7500-system-beyond01-hero.avif" }
];

// Product cards with left border
products.forEach(product => {
  const item = div({
    class: 'flex flex-col items-center px-4 border-l border-black'
  },
    img({
      src: product.image,
      alt: product.title,
      class: 'h-28 object-contain transition-transform duration-300 ease-in-out hover:scale-105'
    }),
    p({
      class: 'mt-4 text-sm font-medium text-gray-800 hover:text-purple-600 transition text-center'
    }, `${product.title} `, span({ class: 'text-purple-600 text-base' }, '→'))
  );

  productGrid.appendChild(item);
});

productCategoryContainer.appendChild(productGrid);
sectionWrapper.appendChild(productCategoryContainer);

// Divider line
const fullLine = div({
  class: 'w-full h-[2px] bg-black'
});

// Add to DOM
block.append(sectionWrapper, fullLine);
}