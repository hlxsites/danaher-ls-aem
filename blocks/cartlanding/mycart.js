import { div } from "../../scripts/dom-builder.js";
import { cartItem } from "./cartItem.js";
import { emptyCart } from "./emptyCart.js";
import { recommendedProducts } from "./recommendedproducts.js";
import { addProducts } from "./addproducts.js";
import {
  getBasketDetails,
  checkoutSummary,
} from '../../scripts/cart-checkout-utils.js';

export const prodQuantity = (totalProductQuantity) => {
  return div(
    {
      class:
        "inline-flex justify-start text-black text-base font-bold gap-4",
      id: "totalProduct-Quantity",
    },
    div(
      {
        class:
          "justify-start text-black text-base font-normal",
      },
      "Add to order template |"
    ),
    `${totalProductQuantity} Items`
  );
};

export const updateCartQuantity = (newQuantity) => {
  const cartItems = document.querySelectorAll("#cartItemContainer");
  if (cartItems) {
    const myCartListContainer = document.getElementById("myCartListContainer");
    const myCartEmptyContainer = document.getElementById(
      "myCartEmptyContainer"
    );
    if (newQuantity == 0) {
      if (myCartListContainer) myCartListContainer.classList.add("hidden");
      if (myCartEmptyContainer) myCartEmptyContainer.classList.remove("hidden");
    } else {
      // const quantityElement = document.getElementById("totalProduct-Quantity");
      // if (quantityElement) {
      //   quantityElement.innerHTML = `Add to order template | ${newQuantity} Items`;
      // }

      if (myCartListContainer) myCartListContainer.classList.remove("hidden");
      if (myCartEmptyContainer) myCartEmptyContainer.classList.add("hidden");
    }
  }
  return { status: "success" };
};

export const mycart = async () => {
  let basketDetail = await getBasketDetails();
  if (basketDetail) console.log("basketdetaill", basketDetail);
  let totalProductQuantity;
  const basketData = JSON.parse(sessionStorage.getItem("basketData"));

  if (basketData) {
    totalProductQuantity = basketData.totalProductQuantity;
  }

  const myCartContainerWrapper = div({
    class: "dhls-container px-5 lg:px-10",
    id: "myCartContainerWrapper",
  });
  const myCartEmptyContainer = div({
    class: "",
    id: "myCartEmptyContainer",
  });
  const myCartListContainer = div({
    class: "flex w-full flex-col gap-4",
    id: "myCartListContainer",
  });
  if (
    basketDetail.status == "error" ||
    basketDetail.data.totalProductQuantity == 0
  ) {
    if (myCartEmptyContainer.classList.contains("hidden")) {
      myCartEmptyContainer.classList.remove("hidden");
    } else {
      myCartListContainer.classList.add("hidden");
    }
  } else if (totalProductQuantity > 0) {
    if (myCartListContainer.classList.contains("hidden")) {
      myCartListContainer.classList.remove("hidden");
    } else {
      myCartEmptyContainer.classList.add("hidden");
    }
  }

  const emptyCartContainer = emptyCart();
  const containerWrapper = div({
    class: "inline-flex justify-between gap-4",
  });
  const emptyDiv = div({
    class: "h-[0px]",
  });
  containerWrapper.append(emptyCartContainer);
  myCartEmptyContainer.append(containerWrapper);
  myCartEmptyContainer.append(emptyDiv);
  myCartEmptyContainer.append(recommendedProducts());
  myCartContainerWrapper.append(myCartEmptyContainer);

  const container = div(
    {
      class: "inline-flex items-start gap-4 max-w-[70%]",
    },
    div(
      {
        class:
          "w-[40rem] left-[60px] justify-start text-black text-4xl font-bold",
      },
      "My Cart"
    ),
    // prodQuantity(totalProductQuantity)
  );
  const cartWrapper = div({
    class: "w-full inline-flex lg:flex-row flex-col gap-[4rem]",
  });
  const containerListWrapper = div({
    class: "inline-flex flex-col gap-2 sm:max-w-[70%] max-w-[100%] ",
    id: "containerListWrapper",
  });
  const description = div(
    {
      class:
        "w-[737px] break-normal justify-start text-black text-base font-extralight ",
    },
    "Welcome to your cart. Review your selections, make any last-minute adjustments, and prepare for a seamless checkout experience tailored just for you."
  );
  myCartListContainer.append(container);
  myCartListContainer.append(description);
  myCartListContainer.append(
    div({
      class: "h-[26px]",
    })
  );
  
  // containerListWrapper.append(description);
  const priceContainer = await checkoutSummary();
  const searchBlock = await addProducts();
  const cartItems = await cartItem();

  if (cartItems.hasChildNodes() === false) {
    myCartListContainer.classList.add("hidden");
    myCartEmptyContainer.classList.remove("hidden");
    containerListWrapper.append(cartItems);
  } else {
    myCartListContainer.classList.remove("hidden");
    myCartEmptyContainer.classList.add("hidden");
    containerListWrapper.append(cartItems);
  }
  cartWrapper.append(containerListWrapper);
  cartWrapper.append(priceContainer);
  myCartListContainer.append(cartWrapper);
  myCartListContainer.append(
    div({
      class: "h-[26px]",
    })
  );
  myCartListContainer.append(searchBlock);
  myCartListContainer.append(recommendedProducts());
  
  myCartContainerWrapper.append(myCartListContainer);
  return myCartContainerWrapper;
};