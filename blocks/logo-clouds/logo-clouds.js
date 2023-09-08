import {
  div
} from '../../scripts/dom-builder.js';

const MAIN_CONTAINER_CLASS = 'logo-clouds bg-gray-200 mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8';
const RIGHT_CONTAINER_CLASS = 'mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2';

function styleForLeftContainer(element) {
  element.className = 'content-visibility mx-auto my-2 max-w-7xl';
  element.firstElementChild.className = 'relative grid items-center grid-cols-1 py-4 mx-auto gap-x-6';
  return element;
}

function styleRowForRightContainer(row) {
  row.className = 'col-span-1 flex justify-center py-8 px-8 rounded-xl border-2 border-transparent bg-white';
  row.querySelector('img').className = 'h-12 transform transition duration-500 hover:scale-105';
  
  const anchor = row.querySelector('a');
  anchor.className = '';
  anchor.innerHTML = '';
  anchor.appendChild(row.firstElementChild);
}

function organizeChildren(block, leftContainer, rightContainer) {
  const children = [...block.children];

  if (children.length === 0) {
    return;
  }

  leftContainer.appendChild(styleForLeftContainer(children[0]));

  children.slice(1).forEach((row) => {
    styleRowForRightContainer(row);
    rightContainer.appendChild(row);
  });
}

export default function decorate(block) {
  const mainContainer = div({ class: MAIN_CONTAINER_CLASS });

  const leftContainer = div();
  const rightContainer = div({ class: RIGHT_CONTAINER_CLASS });

  organizeChildren(block, leftContainer, rightContainer);

  mainContainer.appendChild(leftContainer);
  mainContainer.appendChild(rightContainer);

  block.style = 'display: flex;   justify-content: center;   align-items: center;';
  block.appendChild(mainContainer);
}
