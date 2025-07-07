import { div, hr } from '../../scripts/dom-builder.js';
import addProducts from './addproducts.js';
import {
  logoDiv,
  divider,
  cartItemsContainer,
} from '../../scripts/cart-checkout-utils.js';
import { getProductDetailObject } from './cartSharedFile.js';

const cartItem = async () => {
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

export default cartItem;
