import {
    div, p, img, a, h2, span
  } from '../../scripts/dom-builder.js';
  
  export default function decorate(block) {
    const categories = [
      {
        title: '3D and 2D Cell Culture Systems',
        image: 'https://via.placeholder.com/100x100?text=3D+Cell',
        link: '#'
      },
      {
        title: 'Antibodies',
        image: 'https://via.placeholder.com/100x100?text=Antibodies',
        link: '#'
      },
      {
        title: 'Assay Kits',
        image: 'https://via.placeholder.com/100x100?text=Assay+Kits',
        link: '#'
      },
      {
        title: 'Biochemicals',
        image: 'https://via.placeholder.com/100x100?text=Biochemicals',
        link: '#'
      },
      {
        title: '3D and 2D Cell Culture Systems',
        image: 'https://via.placeholder.com/100x100?text=3D+Cell',
        link: '#'
      },
      {
        title: 'Antibodies',
        image: 'https://via.placeholder.com/100x100?text=Antibodies',
        link: '#'
      },
      {
        title: 'Assay Kits',
        image: 'https://via.placeholder.com/100x100?text=Assay+Kits',
        link: '#'
      },
      {
        title: 'Biochemicals',
        image: 'https://via.placeholder.com/100x100?text=Biochemicals',
        link: '#'
      },
      {
        title: '3D and 2D Cell Culture Systems',
        image: 'https://via.placeholder.com/100x100?text=3D+Cell',
        link: '#'
      },
      {
        title: 'Antibodies',
        image: 'https://via.placeholder.com/100x100?text=Antibodies',
        link: '#'
      },
      {
        title: 'Assay Kits',
        image: 'https://via.placeholder.com/100x100?text=Assay+Kits',
        link: '#'
      },
      {
        title: 'Biochemicals',
        image: 'https://via.placeholder.com/100x100?text=Biochemicals',
        link: '#'
      },
      
      // Add more categories as needed
    ];
  
    const categoryGrid = div(
      { class: 'max-w-[1200px] mx-auto px-4 py-10' },
  
      // Header
      div(
        { class: 'flex justify-between items-center mb-8' },
        h2({ class: 'text-2xl font-semibold text-gray-900' }, 'All Categories'),
        a(
          {
            href: '#',
            class: 'text-sm text-blue-600 hover:underline font-medium flex items-center gap-1'
          },
          span({ innerHTML: '→' }),
          'View All'
        )
      ),
  
      // Grid
      div(
        { class: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' },
        ...categories.map(({ title, image, link }) =>
          div(
            { class: 'bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col items-center text-center' },
  
            img({
              src: image,
              alt: title,
              class: 'w-20 h-20 object-contain mb-4'
            }),
  
            p({ class: 'font-medium text-sm text-gray-800 mb-2' }, title),
  
            a(
              {
                href: link,
                class: 'text-xs text-blue-600 font-medium hover:underline'
              },
              'Browse Products →'
            )
          )
        )
      )
    );
  
    block.appendChild(categoryGrid);
  }
  