import { decorateIcons } from '../lib-franklin.js';

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
    const addRequestforQuote = () => {
      const quoteText = document.querySelector('.quote-textarea');
      if (!quoteText?.value) {
        quoteText.classList.add('border-red');
        document.querySelector('.quote-error').classList.remove('hidden');
      }
    };
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;
    const contentHTML = createContent?.() || '';
    dialogElement.append(contentHTML);
    decorateIcons(dialogElement);
    document.body.appendChild(dialogElement);
    addEventListeners?.(dialogElement);
    dialogElement.querySelector('button[name="continue"]')?.addEventListener('click', () => {
      addRequestforQuote();
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
