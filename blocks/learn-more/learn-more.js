import {
  div, p, img, a, h6
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const getHTMLNodes = (prop) => {
    const html = block.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';
    return Array.from(new DOMParser().parseFromString(html, 'text/html').body.childNodes);
  };

  const getText = (prop) =>
    block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || 'Learn more';

  // === Container Setup
  const learnMoreContainer = div({ class: 'border-t border-gray-300 pt-6 mt-10' });
  const innerLearnMore = div({
    class: 'max-w-[1100px] mx-auto px-4 flex flex-wrap justify-between items-start gap-6'
  });

  // === Title Section
  const titleLearnMore = document.createElement('h3');
  titleLearnMore.className = 'text-base font-semibold text-black min-w-[120px]';
  titleLearnMore.textContent = getText('title');

  // === Contact Columns Container
  const contactFlex = div({
    class: 'flex flex-wrap justify-start gap-14 text-sm text-gray-700 w-full max-w-4xl'
  });

  // === Address Section
  const addressNodes = getHTMLNodes('brandaddress');
  const addressSection = div(
    { class: 'space-y-1' },
    ...addressNodes.map((node, i, arr) =>
      h6({
        class:
          i === arr.length - 1
            ? 'text-violet-600 hover:underline cursor-pointer mt-2'
            : i === 0
            ? 'font-medium text-black'
            : ''
      }, node.textContent.trim())
    )
  );

  // === Call Section
  const callHTML = block.querySelector('[data-aue-prop="callDescription"]')?.innerHTML || '';
  const callSection = div({ class: 'space-y-1' });
  const parsedCall = new DOMParser().parseFromString(callHTML, 'text/html').body;
  parsedCall.querySelectorAll('p').forEach((pNode, index) => {
    const parts = pNode.innerHTML.split('<br>');
    parts.forEach((part, i) => {
      callSection.appendChild(
        h6({
          class:
            index === 0 && i === 0
              ? 'font-medium text-black'
              : 'text-violet-600 hover:underline cursor-pointer'
        }, part.replace(/<\/?strong>/g, '').trim())
      );
    });
  });

  // === Browse Section
  const browseNodes = getHTMLNodes('browseDescription');
  const browseSection = div(
    { class: 'space-y-1' },
    ...browseNodes.map((node, i) =>
      h6({
        class: i === 0
          ? 'font-medium text-black'
          : 'text-violet-600 hover:underline cursor-pointer'
      }, node.textContent.trim())
    )
  );

  // === Wrap Call & Browse
  const callAndBrowseWrapper = div(
    { class: 'space-y-6' },
    callSection,
    browseSection
  );

  // === Final Assembly
  contactFlex.append(addressSection, callAndBrowseWrapper);
  innerLearnMore.append(titleLearnMore, contactFlex);
  learnMoreContainer.appendChild(innerLearnMore);

  block.innerHTML = '';
  block.appendChild(learnMoreContainer);
}
