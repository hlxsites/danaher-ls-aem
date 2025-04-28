import {
  div, span, p, h2, a, img
} from '../../scripts/dom-builder.js';

// Example product data (like bannerInfo structure)
const productsInfo = [
  {
    title: "Capillary Electrophoresis Instruments",
    image: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-biophase-8800-capillary-electrophoresis-system-big-hero.webp",
    browseText: "Browse 15 Products"
  },
  {
    title: "HPLC (High Performance Liquid Chromatography)",
    image: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-exionlc-2-0plus-product-image3.webp",
    browseText: "Browse 10 Products"
  },
  {
    title: "Mass Spectrometers",
    image: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260.jpeg",
    browseText: "Browse 5 Products"
  }
];

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
      class: 'text-sm font-semibold text-gray-800 mb-8'
    }, `${productsInfo.length} Products available`)
  );

  // Grid layout
  const productGrid = div({
    class: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'
  });

  // Loop through productsInfo
  productsInfo.forEach(({ title, image, browseText }) => {
    const item = div({
      class: 'flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow'
    },
      img({
        src: image,
        alt: title,
        class: 'w-full h-48 object-contain p-4'
      }),
      div({ class: 'p-4 flex flex-col flex-1' },
        p({
          class: 'text-sm font-medium text-gray-900 mb-4'
        }, title),
        a({
          href: '#',
          class: 'text-sm text-purple-600 font-semibold mt-auto flex items-center gap-1 hover:underline'
        },
          browseText,
          span({ class: 'text-purple-600' }, '➔')
        )
      )
    );

    productGrid.appendChild(item);
  });

  productCategoryContainer.appendChild(productGrid);
  sectionWrapper.appendChild(productCategoryContainer);
  block.appendChild(sectionWrapper);
}
