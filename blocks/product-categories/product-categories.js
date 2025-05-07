import {
  div, span, p, h2, a, img
} from '../../scripts/dom-builder.js';

import { getMetadata } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const fullCategoryRaw = getMetadata('fullcategory');
  console.log('🧾 Metadata fullcategory:', fullCategoryRaw);

  // let productsInfo = [];
  // try {
  //   productsInfo = JSON.parse(fullCategoryRaw);
  //   console.log('✅ Parsed fullcategory products:', productsInfo);
  // } catch (e) {
  //   console.error('❌ Failed to parse fullcategory metadata as JSON:', e);
  // }

  // // Main section wrapper
  // const sectionWrapper = div({
  //   class: 'w-full flex justify-start bg-white py-12 px-8'
  // });

  // // Inner container
  // const productCategoryContainer = div({
  //   class: 'w-full max-w-screen-xl mx-auto'
  // },
  //   h2({
  //     class: 'text-2xl font-semibold text-gray-900 mb-6'
  //   }, 'Product Categories')
  // );

  // // Grid container
  // const productGrid = div({
  //   class: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'
  // });

  // // Render product cards
  // productsInfo.forEach((item) => {
  //   const title = item.Title;
  //   const clickUri = item.ClickUri || '#';
  //   const images = item.raw?.images || [];

  //   const jpgImage = images.find((url) => url.endsWith('.jpg')) || images[0] || '';

  //   const card = div({
  //     class: 'flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow'
  //   },
  //     jpgImage && img({
  //       src: jpgImage,
  //       alt: title,
  //       class: 'w-full h-48 object-contain p-4'
  //     }),
  //     div({ class: 'p-4 flex flex-col flex-1' },
  //       p({
  //         class: 'text-sm font-medium text-gray-900 mb-4'
  //       }, title),
  //       a({
  //         href: clickUri,
  //         target: '_blank',
  //         rel: 'noopener noreferrer',
  //         class: 'text-sm text-purple-600 font-semibold mt-auto flex items-center gap-1 hover:underline'
  //       },
  //         'Browse Products',
  //         span({ class: 'text-purple-600' }, '➔')
  //       )
  //     )
  //   );

  //   productGrid.appendChild(card);
  // });

  // productCategoryContainer.appendChild(productGrid);
  // sectionWrapper.appendChild(productCategoryContainer);
  // block.appendChild(sectionWrapper);
}
