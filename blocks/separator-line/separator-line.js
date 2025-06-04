import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const bgColorContainer = block.querySelector('[data-aue-prop="bg-color"]');
  const separatorHeight = block.querySelector(
    '[data-aue-prop="separatorHeight"]',
  );
  
  const marginBottom = block.querySelector('[data-aue-prop="subscribe"]')?.textContent;

  console.log('margin', marginBottom);
  const bgColor = bgColorContainer?.textContent?.trim() || '#D1D5DB';
  const height = separatorHeight?.textContent?.trim() || '1';

  const separatorSection = div(
    {
      style: `background-color: ${bgColor};height: ${height}px`,
      class: `dhls-container ${marginBottom ? 'mb-12' : ''} px-5 lg:px-10 dhlsBp:p-0 `,
    },

    // Text Block
    div({ class: 'flex flex-col items-start max-w-3xl' }),
  );
  block.innerHtml = '';
  block.appendChild(separatorSection);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(separatorSection)) {
      child.style.display = 'none';
    }
  });
}
