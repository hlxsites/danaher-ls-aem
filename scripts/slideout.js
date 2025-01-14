import {
  div, p, button, img,
} from './dom-builder.js';

// Showing products that has been added to the cart from json
// function jsonIterate(json, slideout) {
//   json.forEach((item) => {
//     const contentBox = div({ class: 'flex pb-6 mb-6 border-b pb-4' });
//     contentBox.append(
//       div(
//         { class: 'w-1/6' },
//         img({ class: 'h-24 w-24 bg-white', src: item.img, alt: 'productImg' }),
//       ),
//       div(
//         { class: 'w-1/2' },
//         div({ class: 'font-bold ml-2' }, item.description),
//         div({ class: 'text-xs ml-2' },
// 'SKU: dm750-educational-microscope-with-integrated-wireless-camera'),
//       ),
//       div({ class: 'w-1/12 text-center' }, item.qty),
//       div({ class: 'w-1/4 text-center font-bold' }, item.unitprice),
//     );
//     slideout.appendChild(contentBox);
//   });
// }

// Showing products that has been added to the cart from json

function jsonIterate(json, slideout) {
  json.forEach((item) => {
    const contentBox = div({ class: 'flex pb-6 mb-6 border-b pb-4' });
    contentBox.append(
      div(
        { class: 'w-1/6' },
        img({ class: 'h-24 w-24 bg-white', src: item.img, alt: 'productImg' }),
      ),
      div(
        { class: 'w-1/2' },
        div({ class: 'font-bold ml-2' }, item.title),
        div({ class: 'text-xs ml-2' }, item.description),
      ),
      div({ class: 'w-1/12 text-center' }, item.quantity),
      div({ class: 'w-1/4 text-center font-bold' }, item.unitprice),
    );
    slideout.appendChild(contentBox);
  });
}

function toggleClass() {
  document.querySelector('.slideout').classList.toggle('on');
  document.querySelector('.overlay').classList.toggle('active');
}

export default function addtoCartSlideout(main, json) {
  // creating structure of slideout
  document.querySelector('.slideout')?.remove();
  const slideout = div({ class: 'slideout p-4 overflow-y-scroll w-1/2 lg:w-2/5 md:w-11/12 bg-white fixed top-0 z-50 h-full' });
  const overlay = div({ class: 'overlay fixed z-20 top-0 left-0 w-full h-full backdrop-opacity-60 invisible opacity-0 bg-black bg-opacity-60 transition-opacity duration-500' });

  const slideoutHeading = div(
    { class: '' },
    div(
      { class: 'flex justify-between pb-4' },
      p({ class: 'text-lg font-bold' }, 'Item added to your cart'),
      // close Icon
      img({ class: 'closeIconStyle h-5 w-5 cursor-pointer', src: '/icons/close.svg', alt: 'closeIcon' }),
    ),
    // Heading
    div(
      { class: 'flex' },
      div({ class: 'w-1/6' }, ''),
      div({ class: 'text-xs w-1/2 ml-2' }, 'Description'),
      div({ class: 'text-xs w-1/12 text-center' }, 'QTY'),
      div({ class: 'text-xs w-1/4 text-center' }, 'Unit Price'),
    ),
  );
  slideout.append(slideoutHeading);

  jsonIterate(json, slideout);

  // Checkout Button
  const checkoutButton = button({ class: 'btn-primary-purple rounded-full px-6 btn btn-lg font-medium w-full mt-5' }, 'Checkout');
  slideout.appendChild(checkoutButton);
  main.append(slideout);
  main.append(overlay);

  // Dismiss slideout with close Icon
  const imgElement = document.querySelector('.closeIconStyle');
  imgElement.addEventListener('click', toggleClass);
  toggleClass();
}
