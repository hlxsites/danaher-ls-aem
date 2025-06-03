import {
  span,
  img,
  div,
  input,
  button,
  hr,
} from './dom-builder.js';
import { updateCartItemQuantity } from '../blocks/cartlanding/cartSharedFile.js';
import { showPreLoader, removePreLoader } from './common-utils.js';
import { decorateIcons } from './lib-franklin.js';
import { makePublicUrl, imageHelper } from './scripts.js';

export const cartItemsContainer = (cartItemValue) => {
  const modifyCart = async (type, element, value) => {
    showPreLoader();
    if (type === 'delete-item') {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQuantity(item);
      if (response === 'success') {
        removePreLoader();
      } else {
        alert(response);
        removePreLoader();
      }
    } else {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        value,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQuantity(item);
      if (response === 'success') {
        removePreLoader();
        element.blur(); // Removes focus from the input
      } else {
        // alert(response);
        removePreLoader();
        element.blur(); // Removes focus from the input
      }
    }
  };
  const modalCloseButton = button(
    {
      class: 'w-10 h-10 pr-11 bg-white',
    },
    span({
      id: `delteItem-${cartItemValue.sku}`,
      class: 'icon icon-icons8-delete cart-delete',
    }),
  );
  modalCloseButton.addEventListener('click', () => {
    const inputElement = document.getElementById(cartItemValue.lineItemId);
    modifyCart('delete-item', inputElement, '');
  });
  const modalInput = input({
    // id: cartItemValue.lineItemId,
    class:
      'w-[3.5rem] h-10 pl-4 bg-white font-medium rounded-md text-black border-solid border-2 inline-flex justify-center items-center',
    type: 'number',
    min: cartItemValue.minOrderQuantity,
    max:
      cartItemValue.maxOrderQuantity === 0
        ? 99
        : cartItemValue.maxOrderQuantity,
    name: 'item-quantity',
    value: cartItemValue.itemQuantity,
  });
  modalInput.addEventListener('change', (event) => {
    const selectedDiv = document.getElementById(cartItemValue.lineItemId); // or any div reference
    console.log("selected div", selectedDiv);
    const inputElement = selectedDiv.querySelector('input');
    console.log("input element", inputElement);
    const productItem = inputElement.parentElement.parentElement;

    const enteredValue = event.target.value;
    if (enteredValue < Number(input.min)) {
      productItem.style.border = '2px solid red';
      alert(
        `Please enter a valid order quantity which should be greater then ${input.min} and less then ${input.max}`,
      );
    } else if (enteredValue > Number(input.max)) {
      productItem.style.border = '2px solid red';
      alert(
        `Please enter a valid order quantity which should be greater then ${input.min} and less then ${input.max}`,
      );
    } else {
      productItem.style.border = '';
      modifyCart('quantity-added', inputElement, event.target.value);
    }
    // modifyCart("quantity-added", event.target.value);
  });
  const image = imageHelper(
    'https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg',
    cartItemValue.productName,
    {
      href: makePublicUrl(
        'https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg',
      ),
      title: cartItemValue.productName,
      class: 'justify-center',
    },
  );
  const itemContainer = div(
    {
      class: 'flex w-full justify-between items-center',
      id: cartItemValue.lineItemId,
    },
    div(
      {
        class:
          'w-[73px] h-[93px] flex flex-col justify-center items-center cursor-pointer',
      },
      image,
    ),
    div(
      {
        class: 'w-96',
      },
      div(
        {
          class: '',
        },
        cartItemValue.productName,
      ),
      div(
        {
          class: ' text-gray-500 text-base font-extralight',
        },
        `SKU: ${cartItemValue.sku}`,
      ),
    ),
    div(
      {
        class: '',
      },
      modalInput,
    ),
    div(
      {
        class: 'w-11 text-right text-black text-base font-bold',
      },
      `$${cartItemValue.salePrice.value}`,
    ),
    modalCloseButton,
  );

  decorateIcons(itemContainer);
  return itemContainer;
};

export const logoDiv = (itemToBeDisplayed, opcoBe, imgsrc) => {
  const logoDivContainer = div(
    {},
    hr({
      class: 'w-full border-black-300',
    }),
    div(
      {
        class: 'w-full px-4 py-3 inline-flex justify-between items-center',
        id: imgsrc,
      },
      div(
        {
          class:
            "w-24 justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
        },
        img({
          class: '',
          src: `https://feature-em-t149--danaher-ls-aem--hlxsites.aem.page/icons/${imgsrc}.png`,
        }),
      ),
      div(
        {
          class:
            "w-[30rem] justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
        },
        opcoBe[0],
      ),
      div(
        {
          class:
            "justify-start text-black text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
          id: `product-Quantity-${opcoBe[0]}`,
        },
        `${itemToBeDisplayed[opcoBe].length} Items`,
      ),
    ),
    hr({
      class: 'w-full border-black-200',
    }),
  );
  return logoDivContainer;
};

export const divider = (val) => hr({
  class: `w-full border-black-${val}`,
});
