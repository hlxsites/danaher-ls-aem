import {
  div, p, img, a
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const sections = [
    {
      title: 'Continue Browsing',
      ctaText: 'Continue',
      items: [
        {
          brand: 'SCIEX',
          title: 'Triple Quad™ 5500+ LC-MS/MS System – QTRAP...',
          image: 'https://via.placeholder.com/150x150?text=Product+1',
        },
        {
          brand: 'abcam',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://via.placeholder.com/150x150?text=Product+2',
        },
      ],
    },
    {
      title: 'Best Offers / New Arrivals',
      ctaText: 'View Details',
      items: [
        {
          brand: 'Molecular Devices',
          title: 'Triple Quad™ 5500+ LC-MS/MS System – QTRAP...',
          image: 'https://via.placeholder.com/150x150?text=Product+3',
        },
        {
          brand: 'Molecular Devices',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://via.placeholder.com/150x150?text=Product+4',
        },
      ],
    },
  ];

  const wrapper = div({ class: 'flex gap-4 overflow-x-auto' });

  sections.forEach((section) => {
    const sectionCard = div({ class: 'bg-gray-100 p-4 rounded-md w-[300px] min-w-[300px]' });

    const header = div({ class: 'flex justify-between items-center mb-4' },
      p({ class: 'text-sm font-semibold text-gray-800' }, section.title),
      div({ class: 'w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm' }, '→')
    );

    const products = div({ class: 'space-y-3' });

    section.items.forEach((item) => {
      const card = div({ class: 'bg-white rounded-md border p-3 space-y-2' },
        img({ src: item.image, alt: item.title, class: 'w-full h-32 object-contain' }),
        p({ class: 'text-xs text-purple-600 font-medium' }, item.brand),
        p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, item.title),
        a({ href: '#', class: 'text-purple-600 text-sm font-medium' }, `${section.ctaText} →`)
      );
      products.appendChild(card);
    });

    sectionCard.append(header, products);
    wrapper.appendChild(sectionCard);
  });

  block.appendChild(wrapper);
}
