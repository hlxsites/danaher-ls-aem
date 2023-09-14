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

const toggleVideoOverlay = () => {
  const modal = document.querySelector(videoModalSelector);
  modal?.classList.toggle('hidden');
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
        'video-modal hidden fixed inset-0 bg-black/25 backdrop-brightness-50 flex item-center justify-center overflow-hidden z-50',
      'aria-modal': 'true',
      role: 'dialog',
      onclick: toggleVideoOverlay,
    },
    videoContainer,
  );

  return videoModal;
};

export default function decorate(block) {
  const img = block.querySelector('img');
  const imgWrapper = img.parentElement;
  const content = block.querySelector('div > div > div:nth-child(2)');
  img.closest('div.block').prepend(img);
  imgWrapper.remove();

  // add video overlay
  const videoButton = content.querySelector('a');
  if (videoButton && videoButton.href.indexOf('player.vimeo.com/') > -1) {
    videoButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const modal = block.querySelector(videoModalSelector);
      if (!modal && videoButton.href) {
        const videoModal = await buildVideoModal(videoButton.href);
        block.append(videoModal);
      }
      toggleVideoOverlay();
    });
  }

  // decorate styles
  const contentWrapper = content.parentElement;
  const heroNumber = content.querySelector('strong');
  const heading = contentWrapper.querySelector('h2');
  const text = contentWrapper.querySelector('p');
  block.classList.add('relative', 'w-full');
  img.className = 'h-72 w-full md:h-full object-cover';
  contentWrapper.className = 'absolute top-0 left-0 w-full';
  content.className = 'relative mx-auto max-w-7xl mt-8 md:mt-16 p-4 md:p-6';
  heroNumber.className = 'mb-1 lg:mb-8 font-normal text-6xl lg:text-[11rem] leading-none font-fort';
  heading.className = 'mb-1 mt-0 font-semibold tracking-wide text-2xl font-fort';
  text.className = 'mb-2 max-w-sm text-2xl font-fort text-gray-600';
  videoButton.className = 'btn bg-transparent rounded-lg md:px-8 border border-purple-200 hover:text-white hover:bg-purple-200 text-purple-200 md:btn-lg';
}
