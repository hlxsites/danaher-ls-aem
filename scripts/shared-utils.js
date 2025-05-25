import {
  div, p, span, img,
} from './dom-builder.js';
import { decorateIcons } from './lib-franklin.js';
/*
 ::::::::::::::::::::
 Show preloader (animation)
 :::::::::::::::::
 */
export function showPreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  mainPreLoader?.classList.remove('hidden');
}

/*
 ::::::::::::::::::::
 creates a preloader (animation)
 :::::::::::::::::
 */
export function preLoader() {
  return div(
    {
      class:
        ' flex w-full relative top-1/2 left-[46%] justify-start items-center',
      id: 'preLoader',
    },
    img({
      class: ' h-24',
      src: 'https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/loading_icon.gif',
    }),
  );
}

/*
::::::::::::::::::::::
function to remove preloader whenever required
:::::::::::::::::::::::
*/
export function removePreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  setTimeout(() => {
    mainPreLoader?.classList.add('hidden');
  });
}

/*
 ::::::::::::::::::::::::
 utility function to close the modal...
 can be imported and used globally
 for the modal created using utlility createModal function
 ::::::::::::::::::::::::::::::::::::
*/
export function closeUtilityModal() {
  const utilityModal = document.querySelector('#utilityModal');
  if (utilityModal) {
    utilityModal.remove();
  }
}
/*
  create modal function... Creates a popup/modal with the input content
  @param: content : html content to load into the modal
  @param hasCancelButton : boolean. Optional cancel button
  @param hasCloseButton : boolean. Optional close button
*/
export function createModal(content, hasCancelButton, hasCloseButton) {
  const modalWrapper = div({
    class:
      'inset-0 fixed w-full  bg-black z-50 bg-opacity-50 flex items-center justify-center',
    id: 'utilityModal',
  });
  const modalContainer = div({
    class: 'relative max-w-xl w-full items-center bg-white p-8',
    id: 'utilityModalWrapper',
  });

  let modalBody = div({});
  if (content) {
    modalBody = div(
      {
        class: 'modal-body py-6 pb-6',
      },
      content,
    );
  }
  let cancelButton = '';
  if (hasCancelButton) {
    cancelButton = span(
      {
        class: 'mt-6 text-danaherpurple-500 cursor-pointer',
        id: 'closeUtilityModal',
      },
      'Cancel',
    );
    if (content && modalBody) {
      const getModalButtonWrapper = modalBody.querySelector('.button-wrapper');
      if (getModalButtonWrapper) {
        getModalButtonWrapper.classList.add(
          'flex',
          'justify-between',
          'items-center',
        );
        getModalButtonWrapper.append(cancelButton);
      }
    }
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });
  }
  if (hasCloseButton) {
    const modalCloseButton = p(
      {
        class: 'close-button absolute right-10 top-6',
        name: 'close',
      },
      span({
        class: 'icon icon-close cursor-pointer',
      }),
    );
    modalCloseButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });

    decorateIcons(modalCloseButton);
    modalContainer.append(modalCloseButton);
  }
  modalContainer.append(modalBody);

  modalWrapper.append(modalContainer);
  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    mainContainer.append(modalWrapper);
  }
}
