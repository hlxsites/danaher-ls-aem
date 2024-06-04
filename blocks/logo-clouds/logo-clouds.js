import { button, div } from '../../scripts/dom-builder.js';

function styleForLeftContainer(element) {
  element.classList.add(...'content-visibility mx-auto max-w-7xl my-2 ml-3 mr-12'.split(' '));
  if (element.firstElementChild?.classList.length === 0) {
    element.firstElementChild?.remove();
  }
  element.querySelector('h3')?.classList.add(...'inline-flex'.split(' '));
  element.querySelector('p')?.classList.add(...'mt-3 href-text v-html leading-7 text-lg text-danahergray-700'.split(' '));
  const buttonLogoCloud = button({ class: 'btn font-medium btn-primary-purple rounded-full px-6 mt-10 p-3' });
  const ancLink = element.querySelector('a');
  if (ancLink) {
    ancLink.className = 'h-full w-full';
    buttonLogoCloud.appendChild(ancLink);
    element.appendChild(buttonLogoCloud);
  }
  return element;
}

function styleRowForRightContainer(row) {
  row.className = 'col-span-1 flex justify-center py-8 px-8 rounded-xl border-2 border-transparent bg-white';
  row.querySelector('img').className = 'h-12 transform transition duration-500 hover:scale-105';
  const anchor = row.querySelector('a');
  anchor.className = '';
  anchor.innerHTML = '';
  anchor.setAttribute('target', '_blank');
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
  const mainContainer = div({ class: 'logo-clouds bg-gray-200 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-8' });
  const rightContainer = div({ class: 'mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2' });
  const leftContainer = div();
  organizeChildren(block, leftContainer, rightContainer);
  mainContainer.appendChild(leftContainer);
  mainContainer.appendChild(rightContainer);
  block.classList.add('flex', 'justify-center', 'items-center');
  block.appendChild(mainContainer);
}
