import { decorateIcons } from '../../scripts/aem.js';
import { div, iframe, span } from '../../scripts/dom-builder.js';

function toggleModalPopUp(parentDiv) {
  parentDiv.querySelector('.modal').classList.toggle('hidden');
}

function toggleModalPopUp1(modalPopUp) {
  modalPopUp.classList.toggle('hidden');
  const iframe1 = modalPopUp.querySelector('iframe');
  if (iframe1) {
    iframe1.src = '';
  }
}

function createModalPopUp(videoLink) {
  const modalPopUp = div(
    { class: 'modal hidden fixed z-30 m-0 p-0 w-full h-full' },
    div(
      {
        class:
          'modal-content bg-black m-auto p-10 max-[576px]:px-2.5 max-[767px]:px-3.5 h-full w-full left-0 text-center',
      },
      div(
        { class: 'youtube-frame h-3/4 md:h-full' },
        span({
          class:
            'bg-black close-btn float-right icon icon-close absolute right-[0px] top-[-30px] cursor-pointer p-[10px]',
          onclick: () => toggleModalPopUp1(modalPopUp),
        }),
        iframe({
          class: 'm-0 p-0 w-full h-full',
          src: videoLink,
          loading: 'lazy',
          style: 'border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;',
          allow:
            'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture',
          allowfullscreen: '',
          scrolling: 'no',
          title: 'Content from Youtube',
        }),
      ),
    ),
  );
  decorateIcons(modalPopUp);
  return modalPopUp;
}

function loadVideo(parentDiv, divEl, link) {
  divEl.classList.add('md:basis-1/2');
  link.classList.add('relative', 'hover:scale-125');
  link.textContent = '';
  divEl
    .querySelector('img[alt="thumbnail"]')
    ?.classList.add(...'max-[767px]:h-[457px] max-[767px]:w-auto object-cover h-full'.split(' '));
  const thumbnailImage = divEl.querySelector('img[alt="thumbnail"]')?.closest('p');
  const playButton = divEl.querySelector('img[alt="play button"]')?.closest('p');
  playButton.addEventListener('click', (e) => {
    e.preventDefault();
    toggleModalPopUp(parentDiv);
  });
  thumbnailImage?.classList.add('relative', 'h-full');
  thumbnailImage?.querySelector('a')?.remove();
  playButton?.closest('p')?.classList.add('absolute');
  const divCenter = div({
    class: 'flex flex-col items-center justify-center max-[767px]:h-[28.563rem] max-[767px]:w-full h-full',
  });
  divCenter.append(thumbnailImage, playButton);
  link.append(divCenter);
  divEl.append(link);
}

function loadContent(divEl) {
  divEl.classList.add('p-8', 'md:basis-1/2');
  const divCenter = div({ class: 'py-6 px-24 max-[1024px]:px-0 text-center' });
  const h2El = divEl.querySelector('h2');
  const pEl = divEl.querySelector('p:not(:first-child)');
  h2El.classList.add(
    ...'pb-6 text-[83px] leading-[70px] max-[480px]:text-[24px] max-[480px]:leading-[24px] max-[640px]:text-[35px] max-[767px]:text-[45px] max-[767px]:leading-[45px] max-[992px]:text-[55px] max-[992px]:leading-[45px] max-[1199px]:text-[69px] max-[1199px]:leading-[50px]'.split(
      ' ',
    ),
  );
  pEl.classList.add(
    ...'font-light text-[24px] leading-[1.9rem] max-[480px]:text-[20px] max-[480px]:leading-[27px] max-[767px]:text-[24px] max-[767px]:leading-[31px] max-[991px]:text-3xl max-[1200px]:text-[30px] max-[1200px]:leading-[1.9rem]'.split(
      ' ',
    ),
  );
  divCenter.append(h2El, pEl);
  divEl
    .querySelector('img[alt="top image"]')
    ?.classList.add(
      ...'w-[500px] h-[220px] object-contain max-[767px]:w-[8.438rem] max-[767px]:h-[4.375rem] max-[1199px]:w-[300px]'.split(
        ' ',
      ),
    );
  divEl
    .querySelector('img[alt="bottom image"]')
    ?.classList.add(
      ...'w-[500px] h-[220px] object-contain max-[767px]:w-[8.438rem] max-[767px]:h-[4.375rem] max-[1199px]:w-[300px]'.split(
        ' ',
      ),
    );
  divEl.querySelector('img[alt="top image"]')?.closest('p').after(divCenter);
  divEl
    .querySelector('img[alt="top image"]')
    ?.closest('p')
    ?.classList.add(...'flex flex-row justify-start max-[767px]:justify-center'.split(' '));
  divEl
    .querySelector('img[alt="bottom image"]')
    ?.closest('p')
    ?.classList.add(...'flex flex-row justify-end max-[767px]:justify-center'.split(' '));
}

export default function decorate(block) {
  block.classList.add('bg-black', 'text-white');
  const parentDiv = block.querySelector('div');
  parentDiv.classList.add('main-container');
  parentDiv.classList.add(...'max-w-full flex md:flex-row md:justify-between flex-col'.split(' '));

  parentDiv.querySelectorAll('div').forEach((divEl) => {
    const link = divEl.querySelector('a');
    if (link) {
      parentDiv.append(createModalPopUp(link.href));
      loadVideo(parentDiv, divEl, link);
    } else {
      loadContent(divEl);
    }
  });

  if (block.classList.contains('left-video')) {
    parentDiv.classList.add('flex-col', 'md:flex-row-reverse');
  }
}
 