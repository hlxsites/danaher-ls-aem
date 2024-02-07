export default function decorate(block) {
  const main = document.querySelector('.download-container');
  const downloadContent = main.querySelector('.download');
  downloadContent.querySelectorAll('div > picture, img').forEach((item) => {
    item?.parentElement?.parentElement?.classList.add(...'w-full card flex flex-col md:flex-row py-4'.split(' '));
    item?.parentElement?.classList.add(...'card-image flex'.split(' '));
    item?.classList.add(...'w-64 h-64 md:w-56 md:h-36 rounded-md shrink-0 mb-3 md:mb-0 object-cover aspect-video'.split(' '));
  });
  downloadContent.querySelectorAll('div').forEach((item) => {
    item.classList.add(...'card-body w-full'.split(' '));
    const pEl = item.querySelector('p');
    pEl?.classList.add(...'text-sm break-words text-danaherlightblue-500'.split(' '));
    const h2El = item.querySelector('h2');
    h2El?.classList.add(...'text-base tracking-tight text-gray-900 font-semibold'.split(' '));
    const strongEl = item.querySelector('strong');
    strongEl?.classList.add(...'text-xs font-semibold tracking-wide px-3 py-1 bg-darkblue-50 rounded-full font-sans'.split(' '));
  });
  block.append(main);
}
