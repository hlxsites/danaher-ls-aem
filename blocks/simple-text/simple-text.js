import { div, p } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const wrapper = block.closest('.simple-text-wrapper');

  const leftTextEl = wrapper.querySelector('[data-aue-label="Left-Text"]');
  const rightTextEl = wrapper.querySelector('[data-aue-label="Right-Text"]');
  const leftWidth = parseInt(wrapper.querySelector('[data-aue-label^="left"]')?.textContent?.trim() || '50', 10);
  const rightWidth = parseInt(wrapper.querySelector('[data-aue-label^="right"]')?.textContent?.trim() || '50', 10);

  // Validation
  if (leftWidth + rightWidth !== 100) {
    block.innerHTML = '';
    block.appendChild(
      div({ class: 'text-red-600 font-bold p-4' }, '⚠ Error: Left and Right division percentages must add up to 100.')
    );
    return;
  }

  // Create the left side
  const leftDiv = div(
    { class: 'pr-3 font-bold text-lg', style: `width: ${leftWidth}%` },
    leftTextEl?.textContent?.trim() || ''
  );

  // Create the right side
  const rightDiv = div(
    { class: 'text-base text-gray-700', style: `width: ${rightWidth}%` },
    rightTextEl?.textContent?.trim() || ''
  );

  // Wrap both in flex container
  const container = div(
    { class: 'flex flex-wrap max-w-[1200px]' },
    leftDiv,
    rightDiv
  );

  block.innerHTML = '';
  block.appendChild(container);
}
