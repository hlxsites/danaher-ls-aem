
// const buildVideoModal = (href) => {
//     const videoModal =  createTag('div', { class: 'video-modal', 'aria-modal': 'true', role: 'dialog' });
//     const videoOverlay = createTag('div', { class: 'video-modal-overlay' });
//     const videoContainer = createTag('div', { class: 'video-modal-container' });
  
//     const videoHeader = createTag('div', { class: 'video-modal-header' });
//     const videoClose = createTag('button', { class: 'video-modal-close', 'aria-label': 'close' });
  
//     videoClose.addEventListener('click', toggleVideoOverlay);
  
//     const videoContent = createTag('div', { class: 'video-modal-content' });
//     videoContent.innerHTML = `<video controls playsinline loop preload="auto">
//           <source src="${href}" type="video/mp4" />
//           "Your browser does not support videos"
//           </video>`;
  
//     videoHeader.appendChild(videoClose);
//     videoContainer.appendChild(videoHeader);
//     videoContainer.appendChild(videoContent);
//     videoModal.appendChild(videoOverlay);
//     videoModal.appendChild(videoContainer);
  
//     return videoModal;
//   };

export default function decorate(block) {
  const img = block.querySelector('img');
  const imgWrapper = img.parentElement;
  const content = block.querySelector('div > div > div:nth-child(2)');
  const contentWrapper = content.parentElement;
  const heroNumber = content.querySelector('strong');

  img.closest('div.block').prepend(img);
  imgWrapper.remove();

  // video overlay
//   const videoButton = content.querySelector('a');
//   videoButton.addEventListener('click', () => {
//     // add video overlay
//     const modal = block.querySelector(selectors.videoModal);
//     if (!modal && videoHref) {
//       const videoModal = buildVideoModal(videoHref);
//       block.append(videoModal);
//     }
//     toggleVideoOverlay();
//   });

  // decorate styles
  block.classList.add('relative', 'w-full');
  img.className = 'h-72 w-full md:h-full object-cover z-50';
  contentWrapper.className = 'absolute top-0 left-0 w-full';
  content.className = 'relative mx-auto max-w-7xl mt-8 md:mt-16 p-4 md:p-6 z-10';
  heroNumber.className = 'mb-1 lg:mb-8 font-normal text-6xl lg:text-[11rem] leading-none font-fort';
  videoButton.className = 'btn bg-transparent rounded-lg md:px-8 border border-purple-200 hover:text-white hover:bg-purple-200 text-purple-200 md:btn-lg';
}
