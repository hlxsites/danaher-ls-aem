import {
  span,
  img,
  div,
  input,
  button,
  hr,
} from '../../scripts/dom-builder.js';
import { addProducts } from './addproducts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { updateCartItemQunatity } from '../../utils/utils.js';
import {
  makePublicUrl,
  imageHelper,
} from '../../scripts/scripts.js';
import { getProductDetailObject } from './myCartService.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
// import { updateCartValue } from '../../utils/utils.js';

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

export const cartItemsContainer = (cartItemValue) => {
  const modifyCart = async (type, element, value) => {
    showPreLoader();
    if (type === 'delete-item') {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQunatity(item);
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
      const response = await updateCartItemQunatity(item);
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
    const input = document.getElementById(cartItemValue.lineItemId);
    modifyCart('delete-item', input, '');
  });
  const modalInput = input({
    // id: cartItemValue.lineItemId,
    class:
      'w-[3.5rem] h-10 pl-4 bg-white font-medium rounded-md text-black border-solid border-2 inline-flex justify-center items-center',
    type: 'number',
    min: cartItemValue.minOrderQuantity,
    max:
      cartItemValue.maxOrderQuantity === 0 ? 99 : cartItemValue.maxOrderQuantity,
    name: 'item-quantity',
    value: cartItemValue.itemQuantity,
  });
  modalInput.addEventListener('change', (event) => {
    const selectedDiv = document.getElementById(cartItemValue.lineItemId); // or any div reference
    const input = selectedDiv.querySelector('input');
    const productItem = input.parentElement.parentElement;

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
      modifyCart('quantity-added', input, event.target.value);
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

export const sessionObject = async (
  type,
  quantity,
  lineItemId,
  manufacturer,
) => {
  const getProductDetailsObject = await getProductDetailObject();
  if (getProductDetailsObject) {
    const foundObject = getProductDetailsObject.data.find((obj) => obj.hasOwnProperty(manufacturer));

    if (foundObject) {
      const result = foundObject[manufacturer].find(
        (obj) => obj.lineItemId === lineItemId,
      );
      if (result) {
        if (type === 'delete-item') {
          const index = foundObject[manufacturer].indexOf(result);
          foundObject[manufacturer].splice(index, 1);
          if (foundObject[manufacturer].length = 0) {
            const manufacturerIndex = getProductDetailsObject.data.indexOf(foundObject);
            getProductDetailsObject.data.splice(manufacturerIndex, 1);
            sessionStorage.removeItem('productDetailObject');
            sessionStorage.setItem(
              'productDetailObject',
              JSON.stringify(getProductDetailsObject.data),
            );
            return 'success';
          }
          const manufacturerIndex = getProductDetailsObject.data.indexOf(foundObject);
          getProductDetailsObject.data[manufacturerIndex][manufacturer] = foundObject[manufacturer];
          sessionStorage.removeItem('productDetailObject');
          sessionStorage.setItem(
            'productDetailObject',
            JSON.stringify(getProductDetailsObject.data),
          );
          return 'success';
        }
        result.itemQuantity = quantity;
        const index = foundObject[manufacturer].indexOf(result);
        foundObject[manufacturer][index] = result;
        const manufacturerIndex = getProductDetailsObject.data.indexOf(foundObject);
        getProductDetailsObject.data[manufacturerIndex][manufacturer] = foundObject[manufacturer];
        sessionStorage.removeItem('productDetailObject');
        sessionStorage.setItem(
          'productDetailObject',
          JSON.stringify(getProductDetailsObject.data),
        );
        return 'success';
      }
    } else {
      return "No object with the key' was found";
    }
  }
};

export const updateProductQuantityValue = async (
  type,
  quantity,
  lineItemId,
  manufacturer,
) => {
  if (type === 'delete-item') {
    const quantityElement = document.getElementById(lineItemId);
    const opco = manufacturer.split(' ')[0];
    const response = await sessionObject(
      type,
      quantity,
      lineItemId,
      manufacturer,
    );
    if (response) {
      quantityElement.remove();
      const manufacturerElement = document.getElementById(manufacturer);
      const manufacturerDiv = document.getElementById(opco);
      if (manufacturerElement.children.length = 1) {
        manufacturerDiv.remove();
        manufacturerElement.remove();
      }
    }
    return response;
  }
  const quantityElement = document.getElementById(lineItemId);
  const response = await sessionObject(
    type,
    quantity,
    lineItemId,
    manufacturer,
  );
  return response;
};

export const divider = (val) => hr({
  class: `w-full border-black-${val}`,
});

export async function updateCart(newItem) {
  const getProductDetailsObject = await getProductDetailObject();
  if (getProductDetailsObject) {
    const response = getProductDetailsObject.data.map((itemToBeDisplayed) => {
      const opcoBe = Object.keys(itemToBeDisplayed);
      const imgsrc = opcoBe[0].split(' ')[0];
      if (newItem[0].data.manufacturer === opcoBe[0]) {
        const quantityElement = document.getElementById(
          `product-Quantity-${opcoBe[0]}`,
        );
        const cartContainer = document.getElementById(opcoBe[0]);
        if (cartContainer) {
          cartContainer.append(cartItemsContainer(newItem[0].data)); // Add updated item
          quantityElement.innerHTML = ` ${itemToBeDisplayed[opcoBe].length} Items`;
          return cartContainer;
        }
        const cartItemContainer = document.getElementById('cartItemContainer');
        if (cartItemContainer.hasChildNodes() === false) {
          const cartListContainer = div({
            class: 'w-full',
            id: 'cartListContainer',
          });
          const addProductListContainer = div({
            class: '',
            id: 'addProductListContainer',
          });
          const cartItemDisplayContainer = div({
            class: '',
            id: opcoBe[0],
          });

          const logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
          // cartListContainer.append(divider(300));
          cartListContainer.append(logoDivDisplay);
          // cartListContainer.append(divider(200));
          itemToBeDisplayed[opcoBe].forEach((item) => {
            cartItemDisplayContainer.append(cartItemsContainer(item));
            cartItemDisplayContainer.append(divider(200));
          });

          cartListContainer.append(cartItemDisplayContainer);
          cartListContainer.append(divider(300));
          const dividerMain = hr({
            class: 'w-full border-black-400',
          });

          addProductListContainer.append(addProducts());
          addProductListContainer.append(dividerMain);
          cartItemContainer.append(cartListContainer);
          cartItemContainer.append(addProductListContainer);
          return cartItemContainer;
        }
        const cartListContainer = document.getElementById('cartListContainer');
        const cartItemDisplayContainer = div({
          class: 'w-full',
          id: opcoBe[0],
        });

        const logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
        // cartListContainer.append(divider(300));
        cartListContainer.append(logoDivDisplay);
        // cartListContainer.append(divider(200));
        itemToBeDisplayed[opcoBe].forEach((item) => {
          cartItemDisplayContainer.append(cartItemsContainer(item));
          cartItemDisplayContainer.append(divider(200));
        });
        cartListContainer.append(cartItemDisplayContainer);
        cartListContainer.append(divider(300));
        return cartItemContainer;
      }
    });
    if (response[0] === undefined) return response[1];
    return response[0];
  }
}

export const cartItem = async () => {
  const getProductDetailsObject = await getProductDetailObject();
  const cartItemContainer = div({
    class: 'w-full',
    id: 'cartItemContainer',
  });
  const cartListContainer = div({
    class: '',
    id: 'cartListContainer',
  });
  const addProductListContainer = div({
    class: '',
    id: 'addProductListContainer',
  });
  if (getProductDetailsObject.data.length > 0) {
    cartListContainer.append(divider(300));
    getProductDetailsObject.data.forEach((itemToBeDisplayed) => {
      const opcoBe = Object.keys(itemToBeDisplayed);
      const imgsrc = opcoBe[0].split(' ')[0];
      const cartItemDisplayContainer = div({
        class: '',
        id: opcoBe[0],
      });

      const logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
      // cartListContainer.append(divider(300));
      cartListContainer.append(logoDivDisplay);
      // cartListContainer.append(divider(200));
      itemToBeDisplayed[opcoBe].forEach((item) => {
        cartItemDisplayContainer.append(cartItemsContainer(item));
        cartItemDisplayContainer.append(divider(200));
      });
      cartListContainer.append(cartItemDisplayContainer);
      cartListContainer.append(divider(300));
    });

    const dividerMain = hr({
      class: 'w-full border-black-400',
    });

    addProductListContainer.append(addProducts());
    addProductListContainer.append(dividerMain);
    cartItemContainer.append(cartListContainer);
    cartItemContainer.append(addProductListContainer);
    return cartItemContainer;
  }
  return cartItemContainer;
};
