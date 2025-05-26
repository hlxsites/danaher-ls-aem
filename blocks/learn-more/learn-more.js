import { div, a, h6 } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const addressSectionContent = block.querySelector(
    '[data-aue-label="Brand Address"]',
  );
  addressSectionContent.classList.add('flex', 'flex-col', 'gap-4');
  addressSectionContent
    .querySelector('p')
    .classList.add('font-medium', 'text-black');
  const addressSectionAnchor = addressSectionContent?.querySelectorAll('a') || [];
  addressSectionAnchor?.forEach((anchor) => {
    anchor?.classList.add(
      'text-violet-600',
      'hover:underline',
      'cursor-pointer',
      'pb-8',
      'pt-8',
      'link',
    );
    anchor?.classList.remove('btn', 'btn-outline-primary');
  });
  const callSectionContent = block.querySelector(
    '[data-aue-label="Call-Description"]',
  );
  callSectionContent.classList.add('flex', 'flex-col', 'gap-4');
  callSectionContent
    .querySelector('p')
    .classList.add('font-medium', 'text-black');
  const callSectionAnchor = callSectionContent?.querySelectorAll('a') || [];
  callSectionAnchor?.forEach((anchor) => {
    anchor?.classList.add(
      'text-violet-600',
      'hover:underline',
      'cursor-pointer',
      'pb-8',
      'pt-8',
      'link',
    );
    anchor?.classList.remove('btn', 'btn-outline-primary');
  });

  const browseDescriptionContent = block.querySelector(
    '[data-aue-label="Browse-Description"]',
  );
  browseDescriptionContent.classList.add('flex', 'flex-col', 'gap-4');
  browseDescriptionContent
    .querySelector('p')
    .classList.add('font-medium', 'text-black');
  const browseDescriptionAnchor = browseDescriptionContent?.querySelectorAll('a') || [];
  browseDescriptionAnchor?.forEach((anchor) => {
    anchor?.classList.add(
      'text-violet-600',
      'hover:underline',
      'cursor-pointer',
      'pb-8',
      'pt-8',
      'link',
    );
    anchor?.classList.remove('btn', 'btn-outline-primary');
  });

  const getText = (prop) => block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim()
    || 'Learn more';

  // === Main Container
  const learnMoreContainer = div({
    class: 'border-t border-gray-300 pt-6 mt-10',
  });

  // === Inner Flex Row
  const innerLearnMore = div({
    class: `
      max-w-[1100px] mx-auto px-4
      flex flex-col md:flex-row justify-between items-start
      gap-6 md:gap-12 text-sm text-gray-700
    `.trim(),
  });

  // === Left: Title
  const titleLearnMore = div(
    { class: 'min-w-[120px] font-semibold text-black text-xl' },
    getText('title'),
  );

  // === Middle: SCIEX address
  // const addressNodes = getHTMLNodes("brandaddress");
  const addressSection = div({ class: ' text-center md:text-left' });

  // === Right: Call & Browse
  const callHTML = block.querySelector('[data-aue-prop="callDescription"]')?.innerHTML || '';
  const callSection = div({ class: 'space-y-1' });
  const parsedCall = new DOMParser().parseFromString(
    callHTML,
    'text/html',
  ).body;
  parsedCall.querySelectorAll('p').forEach((pNode, index) => {
    const parts = pNode.innerHTML.split('<br>');
    parts.forEach((part, i) => {
      const partContent = h6(
        {
          class:
            index === 0 && i === 0
              ? 'font-medium text-black'
              : 'text-violet-600 hover:underline cursor-pointer',
        },
        part.replace(/<\/?strong>/g, '').trim(),
      );
      const anchorWrapper = div({});
      const partContentAnchor = partContent.querySelectorAll('a');
      partContentAnchor?.forEach((item) => {
        anchorWrapper.append(
          a(
            {
              href: item.textContent,
            },
            item.textContent,
          ),
        );
      });
      partContent.append(anchorWrapper);
      // callSection.appendChild(partContent);
    });
  });

  const browseSection = div({ class: 'space-y-1' });
  addressSection.append(addressSectionContent);
  callSection.append(callSectionContent);
  browseSection.append(browseDescriptionContent);
  const rightSection = div(
    { class: 'space-y-6 text-right md:text-left' },
    callSection,
    browseSection,
  );

  // === Assemble Columns
  innerLearnMore.append(titleLearnMore, addressSection, rightSection);
  learnMoreContainer.appendChild(innerLearnMore);

  // === Final Render
  block.innerHTML = '';
  block.appendChild(learnMoreContainer);
}
