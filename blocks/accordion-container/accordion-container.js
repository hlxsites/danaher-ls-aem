export default async function decorate(block) {
  const items = block.querySelectorAll('[data-aue-model="accordion-item"]');

  items.forEach((item, index) => {
    const title = item.querySelector('[data-aue-prop="item_title"]').textContent;
    const description = item.querySelector('[data-aue-prop="item_description"]').textContent;

    // Clear default content
    item.innerHTML = '';

    // Create button for accordion toggle
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.className =
      'w-full text-left flex justify-between items-center py-4 font-semibold text-gray-900 border-t border-gray-200 hover:cursor-pointer';
    button.innerHTML = `
      <span class="text-base">${title}</span>
      <svg class="w-4 h-4 transform transition-transform duration-300 ${index === 0 ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
      </svg>
    `;

    // Create content div
    const content = document.createElement('div');
    content.className = `overflow-hidden transition-all duration-300 text-sm text-gray-700 ${
      index === 0 ? 'max-h-[1000px] py-2' : 'max-h-0'
    }`;
    content.innerHTML = `<p class="pr-4">${description}</p>`;

    // Toggle logic
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !expanded);
      button.querySelector('svg').classList.toggle('rotate-180');

      if (expanded) {
        content.classList.remove('max-h-[1000px]', 'py-2');
        content.classList.add('max-h-0');
      } else {
        // Collapse others
        items.forEach((el) => {
          const otherBtn = el.querySelector('button');
          const otherContent = el.querySelector('div');
          if (otherBtn && otherContent && otherBtn !== button) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherBtn.querySelector('svg').classList.remove('rotate-180');
            otherContent.classList.remove('max-h-[1000px]', 'py-2');
            otherContent.classList.add('max-h-0');
          }
        });

        content.classList.remove('max-h-0');
        content.classList.add('max-h-[1000px]', 'py-2');
      }
    });

    item.appendChild(button);
    item.appendChild(content);
  });
}