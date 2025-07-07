import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
<<<<<<< HEAD
  const [title, brandAddress, callDescription, browseDescription] = block.children;

  brandAddress
    ?.querySelectorAll('div')[1]
    ?.classList.add(
      'flex',
      'flex-col',
      'gap-4',
      'text-black',
      'text-base',
      'leading-snug',
      'items-start',
    );
  callDescription
    ?.querySelectorAll('div')[1]
    ?.classList.add(
      'flex',
      'flex-col',
      'gap-4',
      'text-black',
      'text-base',
      'leading-snug',
      'items-start',
    );
  browseDescription
    ?.querySelectorAll('div')[1]
    ?.classList.add(
      'flex',
      'flex-col',
      'gap-4',
      'text-black',
      'text-base',
      'leading-snug',
      'items-start',
    );
  const addressSectionContent = brandAddress;
=======
  const addressSectionContent = block.querySelector(
    '[data-aue-prop="brandaddress"]',
  );
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  addressSectionContent?.classList.add(
    'flex',
    'flex-col',
    'gap-4',
    'text-black',
    'text-base',
<<<<<<< HEAD
    'text-black',
=======
    'font-extralight',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    'leading-snug',
    'items-start',
  );
  const addressSectionAnchor = addressSectionContent?.querySelectorAll('a') ?? [];
  if (addressSectionAnchor.length) {
    addressSectionAnchor?.forEach((anchor) => {
<<<<<<< HEAD
      const linkHref = anchor?.getAttribute('href');
      anchor.setAttribute(
        'target',
        linkHref?.includes('http') ? '_blank' : '_self',
      );
      anchor?.classList.add(
        'text-danaherpurple-500',
        'cursor-pointer',
        'hover:text-danaherpurple-800',
        '[&_svg>use]:hover:stroke-danaherpurple-800',
=======
      anchor?.classList.add(
        'text-danaherpurple-500',
        'cursor-pointer',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        'text-base',
        'font-semibold',
        'flex',
        'items-center',
        'leading-snug',
        'link',
      );
      anchor?.classList.remove('btn', 'btn-outline-primary');
      anchor?.parentElement?.classList.remove('btn', 'btn-outline-primary');
      anchor.textContent = anchor.textContent.replace(/->/g, '');
      anchor?.append(
        span({
          class:
            'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      );
    });
  }
<<<<<<< HEAD
  const callSectionContent = callDescription;
=======
  const callSectionContent = block.querySelector(
    '[data-aue-prop="callDescription"]',
  );
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  callSectionContent?.classList.add(
    'flex',
    'flex-col',
    'gap-4',
    'text-black',
    'text-base',
<<<<<<< HEAD
    'text-black',
=======
    'font-extralight',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    'leading-snug',
    'items-start',
  );
  const callSectionAnchor = callSectionContent?.querySelectorAll('a') ?? [];
  if (callSectionAnchor.length) {
    callSectionAnchor?.forEach((anchor) => {
<<<<<<< HEAD
      const linkHref = anchor?.getAttribute('href');
      anchor.setAttribute(
        'target',
        linkHref?.includes('http') ? '_blank' : '_self',
      );
      anchor?.classList.add(
        'text-danaherpurple-500',
        'cursor-pointer',
        'hover:text-danaherpurple-800',
        '[&_svg>use]:hover:stroke-danaherpurple-800',
=======
      anchor?.classList.add(
        'text-danaherpurple-500',
        'cursor-pointer',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        'text-base',
        'font-semibold',
        'flex',
        'items-center',
        'leading-snug',
        'link',
      );
      anchor?.classList.remove('btn', 'btn-outline-primary');
      anchor?.parentElement?.classList.remove('btn', 'btn-outline-primary');
      anchor.textContent = anchor.textContent.replace(/->/g, '');
      anchor?.append(
        span({
          class:
            'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      );
    });
  }

<<<<<<< HEAD
  const browseDescriptionContent = browseDescription;
=======
  const browseDescriptionContent = block.querySelector(
    '[data-aue-prop="browseDescription"]',
  );
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  browseDescriptionContent?.classList.add(
    'flex',
    'flex-col',
    'gap-4',
<<<<<<< HEAD
    'text-black',
    'text-base',
    'text-black',
    'leading-snug',
=======
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    'items-start',
  );
  const browseDescriptionAnchor = browseDescriptionContent?.querySelectorAll('a') ?? [];

  if (browseDescriptionAnchor.length) {
    browseDescriptionAnchor?.forEach((anchor) => {
<<<<<<< HEAD
      const linkHref = anchor?.getAttribute('href');
      anchor.setAttribute(
        'target',
        linkHref?.includes('http') ? '_blank' : '_self',
      );
      anchor?.classList.add(
        'text-danaherpurple-500',
        'cursor-pointer',
        'hover:text-danaherpurple-800',
        '[&_svg>use]:hover:stroke-danaherpurple-800',
=======
      anchor?.classList.add(
        'text-danaherpurple-500',
        'cursor-pointer',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        'text-base',
        'font-semibold',
        'flex',
        'items-center',
        'leading-snug',
        'link',
      );
      anchor?.classList.remove('btn', 'btn-outline-primary');
      anchor?.parentElement?.classList.remove('btn-outline-primary');
      anchor.textContent = anchor.textContent.replace(/->/g, '');
      anchor?.append(
        span({
          class:
            'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      );
    });
  }
<<<<<<< HEAD
=======
  const getText = (prop) => block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim()
    || 'Learn more';

>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  // === Main Container
  const learnMoreContainer = div({
    class: ' dhls-container px-5 lg:px-10 dhlsBp:p-0 mb-12',
  });

  // === Inner Flex Row
  const innerLearnMore = div({
    class: `
        md:pl-0 md:pr-0 
      flex flex-col md:flex-row justify-between items-start
      gap-6 md:gap-12 text-sm text-gray-700
    `.trim(),
  });

  // === Left: Title
  const titleLearnMore = div(
    { class: 'min-w-[120px] font-medium text-black text-3xl leading-[1.5rem]' },
<<<<<<< HEAD
    title?.textContent?.trim() || '',
=======
    getText('title'),
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  );

  // === Middle: SCIEX address
  // const addressNodes = getHTMLNodes("brandaddress");
  let addressSection = '';

  // === Right: Call & Browse
  let callSection = '';

  let browseSection = '';
  if (addressSectionContent) {
<<<<<<< HEAD
    addressSection = div({ class: 'text-center md:text-left mt-2' });
=======
    addressSection = div({ class: ' text-center md:text-left mt-2' });
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    addressSection?.append(addressSectionContent);
  }
  if (callSectionContent) {
    callSection = div({ class: 'space-y-1' });
    callSection?.append(callSectionContent);
  }
  if (browseDescriptionContent) {
    browseSection = div({ class: 'space-y-1' });
    browseSection?.append(browseDescriptionContent);
  }
  const rightSection = div(
    { class: 'space-y-6 text-right md:text-left mt-2' },
    callSection,
    browseSection,
  );

  // === Assemble Columns
  innerLearnMore.append(titleLearnMore, addressSection, rightSection);
  learnMoreContainer.appendChild(innerLearnMore);

  decorateIcons(learnMoreContainer);
<<<<<<< HEAD
  block.textContent = '';
  block.appendChild(learnMoreContainer);
=======
  block.appendChild(learnMoreContainer);
  // Hide authored content
  [...block.children].forEach((child) => {
    if (!child.contains(learnMoreContainer)) {
      child.style.display = 'none';
    }
  });
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
}
