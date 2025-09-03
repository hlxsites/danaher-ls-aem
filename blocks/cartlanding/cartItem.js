import { div } from '../../scripts/dom-builder.js';
// eslint-disable-next-line import/no-cycle
import {
  logoDiv,
  divider,
  cartItemsContainer,
} from '../../scripts/cart-checkout-utils.js';
import { getProductDetailObject } from './cartSharedFile.js';

export const cartItem = async () => {
  let getProductDetailsObject;
  const params = new URLSearchParams(window.location.search);

  if (params.get('orderId')) {
    getProductDetailsObject = JSON.parse(sessionStorage.getItem('cartItemsDetails'));
  } else {
    const productObject = await getProductDetailObject();
    getProductDetailsObject = productObject.data;
  }

  const cartItemContainer = div({
    class: 'w-full sm:p-6 p-[0px] outline outline-1 outline-offset-[-1px] outline-gray-200 bg-white ',
    id: 'cartItemContainer',
  });
  const cartListContainer = div({
    class: '',
    id: 'cartListContainer',
  });
  if (getProductDetailsObject?.length > 0) {
    // console.log("cartItem Value", getProductDetailsObject.data);

    // cartListContainer.append(divider(300));
    getProductDetailsObject.forEach((itemToBeDisplayed) => {
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
        cartItemDisplayContainer.append(divider(200));
        cartItemDisplayContainer.append(cartItemsContainer(item));
      });
      cartListContainer.append(cartItemDisplayContainer);
      // cartListContainer.append(divider(300));
    });

    // addProductListContainer.append(addProducts());
    // addProductListContainer.append(dividerMain);
    cartItemContainer.append(cartListContainer);
    // cartItemContainer.append(addProductListContainer);
    return cartItemContainer;
  }
  return cartItemContainer;
};

export default cartItem;
