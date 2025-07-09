import { div, hr } from '../../scripts/dom-builder.js';
import {addProducts} from './addproducts.js';
import {
  logoDiv,
  divider,
  cartItemsContainer,
} from '../../scripts/cart-checkout-utils.js';
import { getProductDetailObject } from './cartSharedFile.js';

export const cartItem = async () => {
  let getProductDetailsObject;
  if (window.location.href.includes('assay-kits')){
    getProductDetailsObject = JSON.parse(sessionStorage.getItem("cartItemsDetails"));
    console.log("getProductDetailsObject", getProductDetailsObject);
  }
  else {
    let productObject = await getProductDetailObject();
    getProductDetailsObject = productObject.data;
    console.log("getProductDetailsObject", getProductDetailsObject);
  }
 
  const cartItemContainer = div({
    class: "w-full sm:p-6 p-[0px] outline outline-1 outline-offset-[-1px] outline-gray-200",
    id: "cartItemContainer",
  });
  const cartListContainer = div({
    class: "",
    id: "cartListContainer",
  });
  const addProductListContainer = div({
    class: "",
    id: "addProductListContainer",
  });
  if (getProductDetailsObject.length > 0) {
    // console.log("cartItem Value", getProductDetailsObject.data);

    // cartListContainer.append(divider(300));
    getProductDetailsObject.forEach((itemToBeDisplayed) => {
      const opcoBe = Object.keys(itemToBeDisplayed);
      const imgsrc = opcoBe[0].split(" ")[0];
      console.log("itemToBeDisplayed[opcoBe] :", opcoBe[0].split(" ")[0]);
      const cartItemDisplayContainer = div({
        class: "",
        id: opcoBe[0],
      });

      let logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
      console.log("logoDivDisplay 461", logoDivDisplay);
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

    const dividerMain = hr({
      class: `w-full border-black-400`,
    });

    addProductListContainer.append(addProducts());
    addProductListContainer.append(dividerMain);
    cartItemContainer.append(cartListContainer);
    // cartItemContainer.append(addProductListContainer);
    return cartItemContainer;
  } else {
    return cartItemContainer;
  }
};

export default cartItem;
