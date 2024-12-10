import {
  a, div, p, span, hr, h1, button
} from '../../scripts/dom-builder.js';


export function createCartSlideout(main) {
  let modalButton;
  modalButton = button({ class: 'slideout-button-style .bg-danaherpurple-50' }, 'Add to cart');
  main.append(modalButton
  );
  const simpleModalButton = document.querySelector('.slideout-button-style ');
  simpleModalButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const slideout = document.createElement('div');
    slideout.id = 'slideout';
    const container = document.createElement('div');
    container.classList.add('p-4');
    slideout.appendChild(container);
    const header = document.createElement('div');
    header.classList.add('flex', 'justify-between');
    container.appendChild(header);
    const itemsAdded = document.createElement('h5');
    itemsAdded.textContent = 'Items added to your cart';
    itemsAdded.classList.add('text-lg', 'font-bold');
    header.appendChild(itemsAdded);
    const closeIcon = document.createElement('h5');
    closeIcon.textContent = 'X';
    itemsAdded.classList.add('text-lg');
    header.appendChild(closeIcon);

    // text description heading
    const tableHeader = document.createElement('div');
    tableHeader.classList.add('flex');
    container.appendChild(tableHeader);
    const columns = [{ class: 'w-1/4', text: '' }, { class: 'w-2/5', text: 'Description' }, { class: 'w-2/12', text: 'QTY' }, { class: 'w-2/12', text: 'Unit Price' }];
    columns.forEach(col => { const div = document.createElement('div'); div.classList.add(col.class); if (col.text) div.textContent = col.text; tableHeader.appendChild(div); });

    // text description2
    const tableRow = document.createElement('div');
    tableRow.classList.add('flex');
    container.appendChild(tableRow);
    const rowItems = [{ class: 'w-1/4', text: 'image' }, { class: 'w-2/5', text: 'DM750 Educational Microscope with Integrated Wireless Camera' }, { class: 'w-2/12', text: '1' }, { class: 'w-2/12', text: 'CA$11,637.00' }];
    rowItems.forEach(col => { const div = document.createElement('div'); div.classList.add(col.class); if (col.text) div.textContent = col.text; tableRow.appendChild(div); });



    // Checkout Button
    const checkoutButton = document.createElement('button');
    checkoutButton.classList.add('btn-primary-purple', 'rounded-full', 'px-6', 'btn', 'btn-lg', 'font-medium', 'w-full');
    checkoutButton.textContent = 'Checkout';
    container.appendChild(checkoutButton);
    main.append(slideout);
  });


}

