import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function updateMenu(target, block) {
  const clickedMenu = target.closest('.menu-item');
  if (!clickedMenu) return;

  const allMenus = block.querySelectorAll('.menu-item');
  allMenus.forEach((menu) => {
    menu.classList.remove('border-danaherlightblue-500');
    const title = menu.querySelector('div > h2');
    const spanEl = title.querySelector('span');
    spanEl?.remove();
  });

  const title = clickedMenu.querySelector('div > h2');
  clickedMenu.classList.add('border-danaherlightblue-500');
  title.append(span({ class: 'icon icon-selected' }));
  decorateIcons(title);
}

function updateEachTimeline(items, timelines) {
  timelines.forEach((timeline) => {
    timeline.classList.remove(...'bg-gray-50 pointer-events-none'.split(' '));
    timeline.querySelector('div > picture > img').classList.remove('hidden');
  });
  items.forEach((timeline) => {
    timeline.classList.add(...'bg-gray-50 pointer-events-none'.split(' '));
    timeline.querySelector('div > picture > img').classList.add('hidden');
  });
}

function updateTimeLine(target) {
  const clickedMenu = target.closest('.menu-item');
  if (!clickedMenu) return;

  const main = document.querySelector('main');
  const timelines = main.querySelectorAll('div.timeline:not(.menu) > div');
  const nonAutomation = [...timelines].filter((timeline) => !timeline.querySelector('div > p > em').textContent.includes('LABORATORY AUTOMATION'));
  const nonAnalytical = [...timelines].filter((timeline) => !timeline.querySelector('div > p > em').textContent.includes('ANALYTICAL TOOLS'));
  const nonDigital = [...timelines].filter((timeline) => !timeline.querySelector('div > p > em').textContent.includes('DIGITAL SOLUTIONS'));

  const title = clickedMenu.querySelector('div > h2');

  switch (title.id.trim()) {
    case 'laboratory-automation':
      updateEachTimeline(nonAutomation, timelines);
      break;
    case 'analytical-tools':
      updateEachTimeline(nonAnalytical, timelines);
      break;
    case 'digital-solutions':
      updateEachTimeline(nonDigital, timelines);
      break;
    default:
      updateEachTimeline([], timelines);
      break;
  }
}

function handleClick(event, block) {
  updateMenu(event.target, block);
  updateTimeLine(event.target);
}

function decoratePicture(picture, timeline) {
  picture?.classList.add(...'w-full mx-auto'.split(' '));
  const pictureDiv = div({ class: 'timeline-img float-right hidden lg:block w-[47%] relative bottom-4 px-4 py-8' }, picture);
  timeline.append(pictureDiv);
}

function decorateItemNo(item, timeline) {
  const itemNo = item.querySelector('div:first-child');
  itemNo.classList.add(...'w-9 md:w-10 h-10 m-0 bg-danaherblue-600 text-white rounded flex justify-center items-center'.split(' '));
  const itemNoDiv = div({ class: '!w-[15%] lg:!w-[6%] relative py-4 t-line' }, itemNo);
  timeline.append(itemNoDiv);
}

function decorateContent(item, timeline) {
  const content = item.querySelector('div:last-child');
  content.classList.add(...'flex flex-col'.split(' '));
  content.querySelector('p > em')?.classList.add(...'text-xs text-gray-400 tracking-wider pb-2 not-italic'.split(' '));
  content.querySelector('p:nth-child(3)')?.classList.add('text-danahergray-700');
  content.querySelector('p:nth-child(4)')?.classList.add(...'flex flex-col md:flex-row gap-3 mt-4'.split(' '));
  content.querySelector('p > a')?.classList.add('!rounded-full');
  const itemContent = div({ class: 'w-[85%] lg:!w-[47%] relative bottom-4 px-4 py-8' }, content);
  timeline.append(itemContent);
}

export default function decorate(block) {
  const type = block.classList.length > 2 ? block.classList[1] : '';
  const currentTab = window.location.hash?.replace('#', '');
  if (type !== 'menu') {
    block.classList.add(...'w-full h-full top-14 bottom-0'.split(' '));
    const items = block.children;
    [...items].forEach((item, idx) => {
      const picture = item.querySelector('div:last-child > p > picture');
      const timeline = (idx % 2 === 0)
        ? div({ class: 'flex flex-row items-stretch px-2 w-full' })
        : div({ class: 'flex flex-row lg:flex-row-reverse items-stretch px-2 w-full' });
      decoratePicture(picture, timeline);
      decorateItemNo(item, timeline);
      decorateContent(item, timeline);
      item.replaceWith(timeline);
    });
    if (currentTab) {
      const titleEl = document.getElementById(currentTab);
      updateTimeLine(titleEl);
    }
  } else {
    block.classList.add(...'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'.split(' '));
    const menus = block.children;

    [...menus].forEach((menu) => {
      menu.addEventListener('click', (event) => handleClick(event, block));
      menu.classList.add(...'menu-item flex flex-col p-4 rounded-md shadow-md cursor-pointer border border-gray-300 hover:border-danaherlightblue-500'.split(' '));

      const title = menu.querySelector('div > h2');
      title.classList.add(...'inline-flex items-center justify-between text-gray-900 text-base font-bold leading-6 w-full'.split(' '));

      const description = menu.querySelector('div > p:first-child');
      description.classList.add('h-20');

      const link = menu.querySelector('div > p > a');
      link.textContent += ' -->';
      link.parentElement.classList.remove('button-container');
      link.classList.remove(...'btn btn-outline-primary'.split(' '));
      link.classList.add(...'inline-flex text-danaherblue-600 items-center gap-1 font-semibold leading-6 mt-auto'.split(' '));
    });
    if (currentTab) {
      const titleEl = document.getElementById(currentTab);
      updateMenu(titleEl, block);
    }
  }
}
