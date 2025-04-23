import {
    div
  } from '../../scripts/dom-builder.js';
import { cartItem } from './cartItem.js';
import { price } from './price.js';
import { recommendedProducts } from './recommendedproducts.js';


export const prodQuantity = (totalProductQuantity) => {
  console.log("totalProductQuantity", totalProductQuantity)
    return div({
        class: "left-[818px] inline-flex flex  justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug gap-4",
        id: "totalProduct-Quantity"
      }, div({
        class: "justify-start text-black text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug ",
        
      }, "Add to order template |"), `${totalProductQuantity} Items`)
}

export const updateCartQuantity = (newQuantity) => {
  const quantityElement = document.getElementById("totalProduct-Quantity");
  if (quantityElement) {
    quantityElement.innerHTML = `Add to order template | ${newQuantity} Items`;
  }
}

export function mycart() {
    const myCartContainer = div({
        class:""
    });
 
      const totalProductQuantity = localStorage.getItem("totalProductQuantity");
      console.log("totalProductQuantity", totalProductQuantity)
    
      const container = div({
        class: "w-[1358px] flex items-start gap-4"
      }, div({
        class: "w-160 left-[60px]  justify-start text-black text-4xl font-bold"
      }, "My Cart"),
      prodQuantity(totalProductQuantity)
        );
      const description = div({
        class: "w-8/12 break-normal justify-start text-black text-base font-extralight "
      }, "Welcome to your cart. Review your selections, make any last-minute adjustments, and prepare for a seamless checkout experience tailored just for you.")
        
      const cartItems = cartItem();
      const priceContainer = price();
    
    
      const containerWrapper = div({
        class: "inline-flex justify-between gap-x-6 gap-y-12 "
      });
     
      myCartContainer.append(container);
      myCartContainer.append(description);
      containerWrapper.append(cartItems);
      containerWrapper.append(priceContainer);
      myCartContainer.append(containerWrapper);
      myCartContainer.append(recommendedProducts());
      return myCartContainer;
}