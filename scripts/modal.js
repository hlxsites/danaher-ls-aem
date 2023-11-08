import { decorateIcons } from './lib-franklin.js';

import {
  div, p, span,
} from './dom-builder.js';

/**
 * Creates a modal with id modalId, or if that id already exists, returns the existing modal.
 * To show the modal, call `modal.showModal()`.
 * @param modalId
 * @param createContent Callback called when the modal is first opened; should return html string
 * for the modal content
 * @param addEventListeners Optional callback called when the modal is first opened;
 * should add event listeners to body if needed
 * @returns {Promise<HTMLElement>} The <dialog> element, after loading css
 */
export default async function getModal(modalId, createContent, addEventListeners) {
  let dialogElement = document.getElementById(modalId);
  if (!dialogElement) {
    const contentHTML = createContent ? createContent() : '';
    const { default: quoteModal, addRequestforQuote } = await import('./quote-modal.js');
    const modalContent = () => div(
      div(
        { class: 'justify-between flex item-center mb-2 text-2xl font-bold leading-6 text-gray-900' },
        div(
          { class: 'modal-title flex items-center gap-2' },
          span({ class: 'icon icon-chat-bubble flex items-center justify-center flex-shrink-0 mx-auto bg-gray-200 rounded-full w-10 h-10 p-2' }),
          'Request for Quote',
        ),
        p({ class: 'close-button', name: 'close' }, span({ class: 'icon icon-close cursor-pointer' })),
      ),
      quoteModal ? quoteModal() : '',
    );
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;
    dialogElement.append(modalContent());
    dialogElement.append(contentHTML);
    decorateIcons(dialogElement);
    document.body.appendChild(dialogElement);
    addEventListeners?.(dialogElement);
    dialogElement.querySelector('button[name="continue"]')?.addEventListener('click', () => {
      addRequestforQuote(dialogElement);
    });
    dialogElement.querySelector('button[name="submit"]')?.addEventListener('click', () => {
      addRequestforQuote(dialogElement, true);
    });
    dialogElement.querySelector('.quote-textarea')?.addEventListener('keypress', () => {
      const quoteText = document.querySelector('.quote-textarea');
      quoteText.classList.remove('border-red');
      document.querySelector('.quote-error').classList.add('hidden');
    });
  }
  dialogElement.className = 'w-full max-w-xl px-6 py-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-md shadow-xl';
  return dialogElement;
}
