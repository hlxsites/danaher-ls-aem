function updateMenu(target, block) {
  const clickedMenu = target.closest('.menu-item');
  if (!clickedMenu) return;

  const allMenus = block.querySelectorAll('.menu-item');
  allMenus.forEach((menu) => {
    menu.classList.remove('border-danaherlightblue-500');
    const title = menu.querySelector('div > strong');
    const svg = title.querySelector('svg');
    svg?.remove();
  });

  const title = clickedMenu.querySelector('div > strong');
  clickedMenu.classList.add('border-danaherlightblue-500');
  title.innerHTML += `
        <svg data-v-e019efe8="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-danaherlightblue-500" data-di-res-id="f8b21aa6-f30b99b3" data-di-rand="1708403729282">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"></path>
        </svg>`;
}

function handleClick(event, block) {
  updateMenu(event.target, block);
}

export default function decorate(block) {
  block.classList.add(...'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8'.split(' '));
  const menus = block.children;

  [...menus].forEach((menu) => {
    menu.addEventListener('click', (event) => handleClick(event, block));
    menu.classList.add(...'menu-item flex flex-col p-4 rounded-md shadow-md cursor-pointer border border-gray-300 hover:border-danaherlightblue-500'.split(' '));

    const title = menu.querySelector('div > strong');
    title.classList.add(...'inline-flex items-center justify-between text-gray-900 text-base font-bold leading-6 w-full'.split(' '));

    const description = menu.querySelector('div > p:first-child');
    description.classList.add('h-20');

    const link = menu.querySelector('div > p > a');
    link.textContent += ' -->';
    link.parentElement.classList.remove('button-container');
    link.classList.remove(...'btn btn-outline-primary'.split(' '));
    link.classList.add(...'inline-flex text-danaherblue-600 items-center gap-1 font-semibold leading-6 mt-auto'.split(' '));
  });
}
