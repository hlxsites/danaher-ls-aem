import {
  div, p, img, a, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  //block.textContent = '';

  const sections = [
    {
      title: 'Continue Browsing',
      ctaText: 'Continue',
      bgColor: 'bg-gray-100',
      arrowColor: 'text-blue-600 border-blue-600',
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
        },
        {
          brand: 'Molecular Devices',
          title: 'Histone Detection Kit',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
        },
        {
          brand: 'Molecular Devices',
          title: 'Another product from MD',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
        },
      ],
    },
    {
      title: 'Best Offers / New Arrivals',
      ctaText: 'View Details',
      bgColor: 'bg-gray-300',
      arrowColor: 'text-blue-600 border-blue-600',
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
        },
        {
          brand: 'Molecular Devices',
          title: 'Arrival: New Antibody Kit',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_13e52a4d7cb6ab28bb568cd7c22c6d1150dd53260',
        },
        {
          brand: 'Molecular Devices',
          title: 'Final Arrival Product',
          image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/media_1a2df0a2c69ad948b8b4ae21889e27b8caeb5ab9f',
        },
      ],
    },
  ];

  const container = div({ class: 'flex gap-6' });

  sections.forEach((section) => {
    const sectionCard = div({ class: `w-1/2 ${section.bgColor} p-4 rounded-lg` });

    const titleRow = div({ class: 'flex justify-between items-center mb-4' },
      p({ class: 'text-lg font-semibold text-gray-800' }, section.title),
    );

    const leftArrow = span({
      class: `w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none ${section.arrowColor}`,
      title: 'Scroll Left'
    }, '←');

    const rightArrow = span({
      class: `w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition ${section.arrowColor}`,
      title: 'Scroll Right'
    }, '→');

    const arrowRow = div({ class: 'flex items-center' }, leftArrow, rightArrow);
    titleRow.appendChild(arrowRow);

    const scrollWrapper = div({
      class: 'overflow-hidden',
    });

    const scrollContainer = div({
      class: 'flex transition-all duration-300 ease-in-out space-x-4',
      style: 'transform: translateX(0);',
    });

    let currentIndex = 0;
    const visibleCards = 2;
    const totalCards = section.items.length;

    section.items.forEach((item) => {
      const card = div({ class: 'min-w-[48%] w-[48%] flex-shrink-0 bg-white rounded-md border p-3 space-y-2 h-[260px]' },
        img({ src: item.image, alt: item.title, class: 'w-full h-24 object-contain' }),
        p({ class: 'text-xs text-purple-600 font-medium' }, item.brand),
        p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, item.title),
        a({ href: '#', class: 'text-purple-600 text-sm font-medium' }, `${section.ctaText} →`)
      );
      scrollContainer.appendChild(card);
    });

    const updateArrows = () => {
      if (currentIndex <= 0) {
        leftArrow.classList.add('opacity-50', 'pointer-events-none');
      } else {
        leftArrow.classList.remove('opacity-50', 'pointer-events-none');
      }

      if (currentIndex >= totalCards - visibleCards) {
        rightArrow.classList.add('opacity-50', 'pointer-events-none');
      } else {
        rightArrow.classList.remove('opacity-50', 'pointer-events-none');
      }
    };

    const scrollToIndex = (index) => {
      const card = scrollContainer.children[0];
      const cardWidth = card.offsetWidth + 16; // 16px = space-x-4 gap
      scrollContainer.style.transform = `translateX(-${cardWidth * index}px)`;
      currentIndex = index;
      updateArrows();
    };

    leftArrow.addEventListener('click', () => {
      if (currentIndex > 0) scrollToIndex(currentIndex - 2);
    });

    rightArrow.addEventListener('click', () => {
      if (currentIndex < totalCards - visibleCards) scrollToIndex(currentIndex + 2);
    });

    setTimeout(updateArrows, 100); // Initialize after layout

    scrollWrapper.appendChild(scrollContainer);
    sectionCard.append(titleRow, scrollWrapper);
    container.appendChild(sectionCard);
  });

  block.appendChild(container);
}
