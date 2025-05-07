import {
  div, p, img, a, h6
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // === Extract content from authored HTML ===
  const getHTML = (prop) =>
    block.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';

  const title = block.querySelector('[data-aue-prop="title"]')?.textContent.trim() || 'Learn more';
  const brandAddressHTML = getHTML('brandaddress');
  const callDescHTML = getHTML('callDescription');
  const browseDescHTML = getHTML('browseDescription');

  // === Learn More Wrapper
  const learnMoreContainer = div({
    class: 'border-t border-gray-300 pt-6 mt-10'
  });

  const innerLearnMore = div({
    class: 'max-w-[1100px] mx-auto px-4 flex flex-wrap justify-between items-start gap-6'
  });

  // === Title Left Side
  const titleLearnMore = document.createElement('h3');
  titleLearnMore.className = 'text-base font-semibold text-black min-w-[120px]';
  titleLearnMore.textContent = title;

  // === Contact Flex Wrapper
  const contactFlex = div({
    class: 'flex flex-wrap justify-start gap-14 text-sm text-gray-700 w-full max-w-4xl'
  });

  // === Address Section
  const brandAddressNodes = Array.from(
    new DOMParser().parseFromString(brandAddressHTML, 'text/html').body.childNodes
  );
  const addressSection = div(
    { class: 'space-y-1' },
    ...brandAddressNodes.map((node, i) => {
      const isLast = i === brandAddressNodes.length - 1;
      return h6({
        class: isLast ? 'text-violet-600 hover:underline cursor-pointer mt-2' : undefined
      }, node.textContent.trim());
    })
  );

  // === Call Section
  const callNodes = Array.from(
    new DOMParser().parseFromString(callDescHTML, 'text/html').body.childNodes
  );
  const callSection = div(
    { class: 'space-y-1' },
    ...callNodes.map((node, i) => {
      const isPhone = i === callNodes.length - 1;
      return h6({
        class: isPhone ? 'text-violet-600 hover:underline cursor-pointer' : 'font-medium text-black'
      }, node.textContent.trim());
    })
  );

  // === Browse Section
  const browseNodes = Array.from(
    new DOMParser().parseFromString(browseDescHTML, 'text/html').body.childNodes
  );
  const browseSection = div(
    { class: 'space-y-1' },
    ...browseNodes.map((node, i) => {
      const isLink = i === browseNodes.length - 1;
      return h6({
        class: isLink ? 'text-violet-600 hover:underline cursor-pointer' : 'font-medium text-black'
      }, node.textContent.trim());
    })
  );

  // === Combine Call + Browse
  const callAndBrowseWrapper = div(
    { class: 'space-y-6' },
    callSection,
    browseSection
  );

  // === Assemble everything
  contactFlex.append(addressSection, callAndBrowseWrapper);
  innerLearnMore.append(titleLearnMore, contactFlex);
  learnMoreContainer.append(innerLearnMore);
  block.innerHTML = '';
  block.appendChild(learnMoreContainer);
}
