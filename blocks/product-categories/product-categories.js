import {
  div, span, h6, p, h2, a, img, h4, h1, button, section, h3
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
 // Main section wrapper
 const sectionWrapper = div({
  class: 'w-full flex justify-start bg-white py-12 px-8'
});

// Inner container
const productCategoryContainer = div({
  class: 'w-full max-w-screen-xl mx-auto'
},
  // Title
  h2({
    class: 'text-2xl font-semibold text-gray-900 mb-2'
  }, 'Product Categories'),

  // Subtitle
  p({
    class: 'text-sm text-gray-600 mb-8'
  }, '30 Products available')
);

// Grid layout (4 columns)
const productGrid = div({
  class: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'
});

// Hardcoded products (based on your screenshot style)
const products = [
  {
    title: "Capillary Electrophoresis Instruments",
    image: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-biophase-8800-capillary-electrophoresis-system-big-hero.webp", // replace with actual image
    browseText: "Browse 15 Products"
  },
  {
    title: "HPLC (High Performance Liquid Chromatography)",
    image: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-exionlc-2-0plus-product-image3webp",
    browseText: "Browse 10 Products"
  },
  {
    title: "Mass Spectrometers",
    image: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260.jpeg",
    browseText: "Browse 5 Products"
  }
];

// Loop products
products.forEach(product => {
  const item = div({
    class: 'flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow'
  },
    // Image
    img({
      src: product.image,
      alt: product.title,
      class: 'w-full h-48 object-contain p-4'
    }),

    // Text section
    div({ class: 'p-4 flex flex-col flex-1' },
      p({
        class: 'text-sm font-medium text-gray-900 mb-4'
      }, product.title),
      a({
        href: '#',
        class: 'text-sm text-purple-600 font-semibold mt-auto flex items-center gap-1 hover:underline'
      },
        product.browseText,
        span({ class: 'text-purple-600' }, '➔')
      )
    )
  );

  productGrid.appendChild(item);
});

productCategoryContainer.appendChild(productGrid);
sectionWrapper.appendChild(productCategoryContainer);

// Add to DOM
block.appendChild(sectionWrapper);
}
