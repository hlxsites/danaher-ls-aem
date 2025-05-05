import {
  div, img, p, a
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const companies = [
    {
      name: 'abcam',
      description: 'Helping to accelerate the next breakthrough in drug discovery, diagnostics and basic research.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Abcam_logo.png',
    },
    {
      name: 'Beckman Coulter Life Sciences',
      description: 'For more than 80 years, Beckman Coulter has been a trusted partner for laboratory professionals.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Beckman_Coulter_Logo.svg',
    },
    {
      name: 'Genedata',
      description: 'Genedata provides enterprise software solutions that digitalize and automate data-rich and complex biology workflows.',
      logo: 'https://seeklogo.com/images/G/genedata-logo-E5566A084E-seeklogo.com.png',
    },
    {
      name: 'IDBS',
      description: 'IDBS provides purpose-built software solutions to address the data management challenges prominent in research and development.',
      logo: 'https://logos-world.net/wp-content/uploads/2023/07/IDBS-Logo.png',
    },
    {
      name: 'Leica Microsystems',
      description: 'Leica Microsystems develops leading-edge microscopes and scientific instruments to power technological advancement.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Leica_Microsystems_Logo.svg',
    },
    {
      name: 'Molecular Devices',
      description: 'Molecular Devices provides high-performance bioanalytical measurement solutions for life science research.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Molecular_Devices_logo.svg',
    },
    {
      name: 'Phenomenex',
      description: 'Phenomenex is a global technology leader committed to developing novel analytical chemistry solutions.',
      logo: 'https://seeklogo.com/images/P/phenomenex-logo-76E225CEB3-seeklogo.com.png',
    },
    {
      name: 'Sciex',
      description: 'At SCIEX, our mission is to deliver solutions for the precision detection and quantification of molecules.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/SCIEX_logo.svg',
    },
  ];

  const grid = div({ class: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4' });

  companies.forEach((company) => {
    const card = div({ class: 'border rounded-md p-4 bg-white flex flex-col h-full shadow hover:shadow-md transition' });

    const logo = img({
      src: company.logo,
      alt: `${company.name} logo`,
      class: 'w-32 h-10 object-contain mb-4',
    });

    const title = p({ class: 'font-semibold text-gray-800 mb-2' }, company.name);
    const desc = p({ class: 'text-sm text-gray-600 flex-grow' }, company.description);
    const cta = a({ href: '#', class: 'mt-3 text-purple-600 text-sm font-medium' }, 'Browse All Products →');

    card.append(logo, title, desc, cta);
    grid.appendChild(card);
  });

  block.appendChild(grid);
}
