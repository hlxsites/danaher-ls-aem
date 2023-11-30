import { button, div } from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';

const videoModalSelector = '.hero .video-modal';

const getVimeoDescriptor = (href) => {
  const descriptor = href.replace('https://player.vimeo.com/video/', '');
  const descriptorParts = descriptor.split('?');
  if (descriptorParts.length === 2) {
    return {
      id: descriptorParts[0],
      params: descriptorParts[1],
    };
  }
  if (descriptorParts.length === 1) {
    return {
      id: descriptorParts[0],
    };
  }
  return null;
};

const removeVideoOverlay = () => {
  const modal = document.querySelector(videoModalSelector);
  modal?.remove();
};

const buildVideoModal = async (href) => {
  await loadScript('https://player.vimeo.com/api/player.js');
  const videoClose = button({ class: 'place-self-end', 'aria-label': 'close' });
  videoClose.innerHTML = `<svg data-v-26c7660b="" xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-12 w-12
    font-extrabold text-white rounded-xl">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
    </svg>`;
  const videoContent = div({ class: 'relative overflow-hidden max-w-full pb-[56.25%]', id: 'vimeo-player' });
  let playerSize = window.innerWidth - 50;
  if (window.innerWidth > 760) playerSize = window.innerWidth - 350;
  const options = {
    id: getVimeoDescriptor(href).id,
    width: playerSize,
    loop: true,
  };

  // eslint-disable-next-line no-undef
  const player = new Vimeo.Player(videoContent, options);
  player.setVolume(1);

  const videoContainer = div(
    { class: 'flex flex-col' },
    videoClose,
    div({ class: 'bg-transparent p-2 rounded' }, videoContent),
  );
  const videoModal = div(
    {
      class:
        'video-modal fixed inset-0 bg-black/25 backdrop-brightness-50 flex item-center justify-center overflow-hidden z-50',
      'aria-modal': 'true',
      role: 'dialog',
      onclick: removeVideoOverlay,
    },
    videoContainer,
  );

  return videoModal;
};

export default function decorate(block) {
  const h1wrapper = block.parentElement.parentElement.parentNode;
  const h1div = document.createElement('h1');
  h1div.innerHTML = 'Drug Discovery & Development Solutions';
  h1wrapper.insertBefore(h1div, block.parentElement.parentElement);
  block.parentElement.parentElement.classList.add('!p-0');
  block.parentElement.classList.add('!max-w-[unset]');
  const picture = block.querySelector('picture');
  const pictureWrapper = picture.parentElement;
  const content = block.querySelector('div > div > div:nth-child(2)');
  picture.closest('div.block').prepend(picture);
  pictureWrapper.remove();

  // add video overlay
  const videoButton = content.querySelector('a');
  videoButton.classList.add(...'btn bg-transparent rounded-lg md:px-8 border border-purple-200 hover:text-white hover:bg-purple-200 text-purple-200 md:btn-lg'.split(' '));
  if (videoButton && videoButton.href.indexOf('player.vimeo.com/') > -1) {
    videoButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const videoModal = await buildVideoModal(videoButton.href);
      block.append(videoModal);
    });
  }

  // decorate styles
  const contentWrapper = content.parentElement;
  const heroNumber = content.querySelector('strong');
  const heading = contentWrapper.querySelector('h2');
  const text = contentWrapper.querySelector('p');
  h1div.classList.add('hidden');
  block.classList.add('relative', 'w-full');
  picture.querySelector('img').classList.add(...'h-80 w-full md:h-full object-cover'.split(' '));
  contentWrapper.classList.add(...'absolute top-0 left-0 w-full'.split(' '));
  content.classList.add(...'relative mx-auto max-w-7xl mt-8 md:mt-16 p-4 md:p-6'.split(' '));
  heroNumber.classList.add(...'mb-1 lg:mb-8 font-normal text-6xl lg:text-[11rem] leading-none font-fort'.split(' '));
  heading.classList.add(...'mb-1 mt-0 font-semibold tracking-wide text-2xl font-fort'.split(' '));
  text.classList.add(...'mb-2 max-w-sm text-2xl font-fort text-gray-600'.split(' '));
}
