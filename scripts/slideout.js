import {
  div, p, button, img
} from '../../scripts/dom-builder.js';

export function createCartSlideout(main, json) {
// creating structure of slideout some
  const slideout = div({ class: 'slideout p-4' });
  const slideoutHeading = div({ class: '' },
    div({ class: 'flex justify-between pb-4' },
      p({ class: 'text-lg font-bold' }, 'Item added to your cart'),
      img({ class: 'closeIconStyle', src: '/icons/close.svg', alt: 'closeIcon' })
    ),
    //Heading
    div({ class: 'flex' },
      div({ class: 'w-1/6' }, ''),
      div({ class: 'text-xs w-1/2 ml-2' }, 'Description'),
      div({ class: 'text-xs text-center	w-1/12' }, 'QTY'),
      div({ class: 'text-xs w-1/4 text-center' }, 'Unit Price')
    )
  );
  slideout.append(slideoutHeading);

  jsonIterate(json, slideout);

  // Checkout Button
  const checkoutButton =  button({ class: 'btn-primary-purple rounded-full px-6 btn btn-lg font-medium w-full mt-5' }, 'Checkout');
  slideout.appendChild(checkoutButton);
  main.append(slideout);

  //Dismiss slideout with close Icon
  const imgElement = document.querySelector('.closeIconStyle');
  imgElement.addEventListener('click', toggleClass);
  toggleClass();
}

function toggleClass() {
    document.querySelector('.slideout').classList.toggle('on');
}

//Showing products that has been added to the cart from json
function jsonIterate(json, slideout) {
  json.forEach((item) => {
    const contentBox = div({ class: 'flex pb-6 mb-6 border-b pb-4' });
    contentBox.append(
      div({ class: 'w-1/6' },
        img({ class: 'productImageStyle', src: item.img, alt: 'productImg' })
      ),
      div({ class: 'w-1/2' },
        div({ class: 'font-bold ml-2' }, item.description),
        div({ class: 'text-xs ml-2' }, 'SKU: dm750-educational-microscope-with-integrated-wireless-camera')
      ),
      div({ class: 'w-1/12 text-center' }, item.qty),
      div({ class: 'w-1/4 text-center font-bold' }, item.unitprice)
    );
    slideout.appendChild(contentBox);
  });
}