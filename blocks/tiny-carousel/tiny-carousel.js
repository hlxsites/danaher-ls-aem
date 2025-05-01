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
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_1a2df0a2c69ad948b8b4ae21889e27b8caeb5ab9f',
        },
        {
          brand: 'abcam',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_1a2df0a2c69ad948b8b4ae21889e27b8caeb5ab9f',
        },{
          brand: 'Molecular Devices',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
        },{
          brand: 'Molecular Devices',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
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
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
        },
        {
          brand: 'Molecular Devices',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_1a2df0a2c69ad948b8b4ae21889e27b8caeb5ab9f',
        },{
          brand: 'Molecular Devices',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
        },{
          brand: 'Molecular Devices',
          title: 'Anti-Histone H3 antibody – Nuclear Marker',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_1a2df0a2c69ad948b8b4ae21889e27b8caeb5ab9f',
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
