import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.querySelector('h1').className = 'text-gray-900 my-2 font-extrabold text-4xl pt-10';
  block.querySelector('img').className = 'mt-8';

  block.append(
    div(
      { class: 'articleinfo' },
      div(
        { class: 'articleinfo-content-visibility max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-20 mt-4 mb-2' },
        div(
          { class: 'items-center flex justify-start w-full ml-2 col-span-2' },
          div(
            { class: 'space-y-1 text-lg leading-6 pl-7' },
            div({ class: 'text-danaherblack-500 font-medium' }, 'Angeline Lim'),
            div({ class: 'text-sm text-danaherlightblue-500 w-full' }, ' PhD, Molecular Devices'),
          ),
        ),
        div(
          { class: 'items-center flex justify-start col-span-1 ml-4 my-4' },
          div({ class: 'reading-icon' }),
          div({ class: 'text-sm text-danahergray-500 pl-1' }, '5 Mins'),
        ),
        div(
          { class: 'items-center flex justify-end col-span-1' },
          div({ class: 'text-sm mr-4 text-danahergray-500' }, '08 February, 2021'),
        ),
      ),
    ),
  );
  block.querySelector('.reading-icon').innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path data-v-3c153bfb="" d="M9.01172 5.66667V9L11.5117 11.5M16.5117 9C16.5117 13.1421 13.1539 16.5 9.01172 16.5C4.86958 16.5 1.51172 13.1421 1.51172 9C1.51172 4.85786 4.86958 1.5 9.01172 1.5C13.1539 1.5 16.5117 4.85786 16.5117 9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;
}
