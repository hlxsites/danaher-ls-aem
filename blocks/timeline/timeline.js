import { div } from '../../scripts/dom-builder.js';

function decoratePicture(picture, timeline) {
  picture.classList.add(...'w-full mx-auto'.split(' '));
  const pictureDiv = div({ class: 'timeline-img float-right hidden lg:block w-[47%] relative bottom-4 px-4 py-8' }, picture);
  timeline.append(pictureDiv);
}

function decorateItemNo(item, timeline) {
  const itemNo = item.querySelector('div:first-child');
  itemNo.classList.add(...'md:w-10 h-10 m-0 bg-danaherblue-600 text-white rounded flex justify-center items-center'.split(' '));
  const itemNoDiv = div({ class: '!w-[15%] lg:!w-[6%] relative py-4' }, itemNo);
  timeline.append(itemNoDiv);
}

function decorateContent(item, timeline) {
  const content = item.querySelector('div:last-child');
  content.classList.add(...'flex flex-col'.split(' '));
  content.querySelector('p > em').classList.add(...'text-xs text-gray-400 tracking-wider pb-2 not-italic'.split(' '));
  content.querySelector('h2').classList.add(...'text-3xl font-bold text-danahergray-900 pb-6'.split(' '));
  content.querySelector('p:nth-child(3)').classList.add('text-danahergray-700');
  content.querySelector('p:nth-child(4)').classList.add(...'flex flex-col md:flex-row gap-3 mt-4'.split(' '));
  content.querySelector('p:nth-child(4) > a').classList.add('!rounded-full');
  const itemContent = div({ class: 'w-[85%] lg:!w-[47%] relative bottom-4 px-4 py-8' }, content);
  timeline.append(itemContent);
}

export default function decorate(block) {
  block.classList.add(...'w-full h-full top-14 bottom-0'.split(' '));
  const items = block.children;
  [...items].forEach((item, idx) => {
    item.classList.add(...'flex flex-row items-stretch px-2 w-full'.split(' '));
    const picture = item.querySelector('div:last-child > p > picture');
    const timeline = (idx % 2 === 0)
      ? div({ class: 'flex flex-row items-stretch px-2 w-full' })
      : div({ class: 'flex flex-row lg:flex-row-reverse items-stretch px-2 w-full' });
    decoratePicture(picture, timeline);
    decorateItemNo(item, timeline);
    decorateContent(item, timeline);
    item.replaceWith(timeline);
  });
}
