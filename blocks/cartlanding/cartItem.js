import {
  span,
  img,
  div,
  a,
  input,
  button,
  hr,
  p,
} from "../../scripts/dom-builder.js";
import { addProducts } from "./addproducts.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import {
  makePublicUrl,
  imageHelper,
  generateUUID,
} from "../../scripts/scripts.js";
import { updateCartItemQuantity } from "./cartSharedFile.js";
import { getProductDetailObject } from "./cartSharedFile.js";
import { showPreLoader, removePreLoader } from "../../scripts/common-utils.js";
// import { updateCartValue } from '../../utils/utils.js';

export const logoDiv = (itemToBeDisplayed, opcoBe, imgsrc) => {
  console.log("logo div calledddddd")
  // const logoDiv = div({}, hr({
  //     class: `w-full border-black-300`,
  //   }),
  //   div(
  //     {
  //       class: "w-full px-4 py-3 inline-flex justify-between items-center",
  //       id: imgsrc,
  //     },
  //     div(
  //       {
  //         class:
  //           "w-24 justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
  //       },
  //       img({
  //         class: "",
  //         src: `/icons/${imgsrc}.png`,
  //       })
  //     ),
  //     div(
  //       {
  //         class:
  //           "w-[30rem] justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
  //       },
  //       opcoBe[0]
  //     ),
  //     div(
  //       {
  //         class:
  //           "justify-start text-black text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
  //         id: `product-Quantity-${opcoBe[0]}`,
  //       },
  //       `${itemToBeDisplayed[opcoBe].length} Items`
  //     )
  //   ),
  //   hr({
  //     class: `w-full border-black-200`,
  //   }))
  const logoDiv = div(
    {
      class:
        "w-full self-stretch py-3 bg-gray-100 border-t border-gray-300 inline-flex justify-start items-center gap-1",
    },
    div(
      {
        class: "w-28 px-5 flex justify-start items-center gap-3",
        id: imgsrc,
      },
      div(
        {
          class: "justify-start text-black text-base font-bold truncate",
        },
        opcoBe[0]
      )
    ),
    div(
      {
        class: "w-64 justify-start text-black text-base font-bold",
        id: `product-Quantity-${opcoBe[0]}`,
      },
      `${itemToBeDisplayed[opcoBe].length} Items`
    ),
    div(
      {
        class: "hidden sm:block w-24 justify-start text-black text-base font-bold",
      },
      "QTY"
    ),
    div(
      {
        class: "hidden sm:block w-48 justify-start text-black text-base font-bold",
      },
      "Unit Price"
    ),
    div(
      {
        class: "hidden sm:block w-[3rem] justify-start text-black text-base font-bold",
      },
      "Total"
    )
  );
  return logoDiv;
};

export const cartItemsContainer = (cartItemValue) => {
  console.log("cart item value", cartItemValue);
  const modifyCart = async (type, element, value) => {
    console.log(element);
    showPreLoader();
    if (type == "delete-item") {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        manufacturer: cartItemValue.manufacturer,
        type: type,
      };
      const response = await updateCartItemQuantity(item);
      if (response == "success") {
        const getProductDetailsObject = await getProductDetailObject();
        if (getProductDetailsObject) {
          const response = getProductDetailsObject.data.map(
            (itemToBeDisplayed) => {
              const opcoBe = Object.keys(itemToBeDisplayed);
              console.log("opcoBe", opcoBe.length);
              const str = `product-Quantity-${opcoBe[0]}`;
              const parts = str.split("-");
              const logodivId = document.getElementById(
                `product-Quantity-${opcoBe[0]}`
              );
              console.log(
                "${itemToBeDisplayed[opcoBe].length",
                itemToBeDisplayed[opcoBe[0]].length
              );
              logodivId.innerHTML = ` ${
                itemToBeDisplayed[opcoBe[0]].length
              } Items`;
            }
          );
        }
        removePreLoader();
      } else {
        alert(response);
        removePreLoader();
      }
    } else {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        value: value,
        manufacturer: cartItemValue.manufacturer,
        type: type,
      };
      const response = await updateCartItemQuantity(item);
      if (response == "success") {
        removePreLoader();
        element.blur(); // Removes focus from the input
      } else {
        alert(response);
        removePreLoader();
        element.blur(); // Removes focus from the input
      }
    }
  };
  const modalCloseButton = button(
    {
      class: "sm:w-[7.5rem] sm:h-[3.5rem] bg-white",
    },
    span({
      id: `delteItem-${cartItemValue.sku}`,
      class: "icon icon-icons8-delete cart-delete",
    })
  );
  modalCloseButton.addEventListener("click", (event) => {
    const input = document.getElementById(cartItemValue.lineItemId);
    console.log("Clicked on item with ID: ", input);
    modifyCart("delete-item", input, "");
  });
  const modalInput = input({
    // id: cartItemValue.lineItemId,
    class:
      "w-[3.5rem] h-10 pl-4 bg-white font-medium rounded-md text-black border-solid border-2 inline-flex justify-center items-center",
    type: "number",
    min: cartItemValue.minOrderQuantity,
    max:
      cartItemValue.maxOrderQuantity == 0 ? 99 : cartItemValue.maxOrderQuantity,
    name: "item-quantity",
    value: cartItemValue.itemQuantity,
  });
  modalInput.addEventListener("change", (event) => {
    const selectedDiv = document.getElementById(cartItemValue.lineItemId); // or any div reference
    const input = selectedDiv.querySelector("input");
    const productItem = input.parentElement.parentElement;
    console.log("productItem", input);

    const enteredValue = event.target.value;
    if (enteredValue < Number(input.min)) {
      console.log("minnn");
      productItem.style.border = "2px solid red";
      alert(
        `Please enter a valid order quantity which should be greater then ${input.min} and less then ${input.max}`
      );
    } else if (enteredValue > Number(input.max)) {
      console.log("max");
      productItem.style.border = "2px solid red";
      alert(
        `Please enter a valid order quantity which should be greater then ${input.min} and less then ${input.max}`
      );
    } else {
      productItem.style.border = "";
      modifyCart("quantity-added", input, event.target.value);
    }
    // modifyCart("quantity-added", event.target.value);
  });
  const image = imageHelper(
    "https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg",
    cartItemValue.productName,
    {
      href: makePublicUrl(
        "https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg"
      ),
      title: cartItemValue.productName,
      class: "justify-center",
    }
  );
  // const itemContainer = div(
  //   {
  //     class: "flex w-full justify-between items-center",
  //     id: cartItemValue.lineItemId,
  //   },
  //   div(
  //     {
  //       class:
  //         "w-[73px] h-[93px] flex flex-col justify-center items-center cursor-pointer",
  //     },
  //     image
  //   ),
  //   div(
  //     {
  //       class: "w-96",
  //     },
  //     div(
  //       {
  //         class: "",
  //       },
  //       cartItemValue.productName
  //     ),
  //     div(
  //       {
  //         class: " text-gray-500 text-base font-extralight",
  //       },
  //       `SKU: ${cartItemValue.sku}`
  //     )
  //   ),
  //   div(
  //     {
  //       class: "",
  //     },
  //     modalInput
  //   ),
  //   div(
  //     {
  //       class: "w-11 text-right text-black text-base font-bold",
  //     },
  //     `$${cartItemValue.salePrice.value}`
  //   ),
  //   modalCloseButton
  // );
  // const itemContainer = div(
  //   {
  //     class:
  //       "w-full self-stretch p-4 relative inline-flex justify-start items-center",
  //   },
  //   div(
  //     { class: "inline-flex justify-start items-center gap-3.5" },
  //     div(
  //       {
  //         class:
  //           "w-28 p-2.5 bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-start items-center gap-2.5",
  //       },
  //       // div(
  //       //   {
  //       //     class: "w-16 self-stretch relative overflow-hidden",
  //       //   },
  //         image
  //         // img({
  //         //   class: "w-20 h-28 left-[-4px] top-[-24px] absolute",
  //         //   src: `/images/wesee/dummy.png `,
  //         // })
  //       // )
  //     ),
  //     div(
  //       { class: "w-64 inline-flex flex-col justify-start items-start" },
  //       div(
  //         {
  //           class: "self-stretch justify-start text-black text-base font-bold",
  //         },
  //         cartItemValue.productName
  //       ),
  //       div(
  //         {
  //           class:
  //             "self-stretch justify-start text-gray-500 text-sm font-normal ",
  //         },
  //         cartItemValue.sku
  //       )
  //     )
  //   ),
  //   div(
  //     { class: "w-11 inline-flex flex-col justify-start items-start" },
  //     // div({
  //     //     class:"w-11 h-10 px-4 py-3 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] inline-flex justify-start items-center overflow-hidden"
  //     // },
  //     // div({
  //     //     class:"justify-start text-gray-700 text-base font-normal"
  //     // }, "2")
  //     modalInput
  //     // )
  //   ),
  //   div(
  //     { class: "w-44 inline-flex flex-col justify-start items-end" },
  //     div(
  //       {
  //         class:
  //           "self-stretch text-right justify-start text-black text-base font-bold",
  //       },
  //       `$${cartItemValue.salePrice.value}`
  //     ),
  //     div(
  //       {
  //         class:
  //           "self-stretch text-right justify-start text-gray-500 text-base",
  //       },
  //       " $100.00"
  //     )
  //   ),
  //   div(
  //     { class: "w-28 inline-flex flex-col justify-start items-end" },
  //     div(
  //       {
  //         class:
  //           "self-stretch text-right justify-start text-black text-base font-bold",
  //       },
  //       "$200.00"
  //     )
  //   ),
  //   div(
  //     { class: "w-6 h-6 left-[747px] top-[49px] absolute overflow-hidden" },
  //     modalCloseButton
  //   )
  // );
  const itemsscontainer = div(
    {
      class:
        "w-full py-3 border-t border-gray-300 inline-flex sm:flex-row flex-col justify-start items-center gap-1",
        id: cartItemValue.lineItemId,
    },
    div({
      class:"py-3 inline-flex gap-2 "
    },
    div(
      {
        class: "w-28 p-2 flex justify-start items-center gap-3 border border-solid border-gray-300",
      },
      div(
        {
          class: "justify-start text-black text-base font-bold truncate m-[5px]",
        },
        img({
            class: "w-full h-auto",
            src: cartItemValue.images ? cartItemValue.images[0].effectiveUrl : "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble" ,
        })
      )
    ),
    div(
      {
        class: "sm:w-64 w-[11rem] justify-start text-black text-base font-bold",
        // id: `product-Quantity-${opcoBe[0]}`,
      },
        div(
          {
            class: "w-full justify-start items-center text-black text-base font-bold",
          },
          cartItemValue.productName
        ),
        div(
          {
            class:
              "w-full justify-start items-center text-gray-500 text-sm font-normal ",
          },
          cartItemValue.sku
        )
      
    ),
  ),
    div({
      class: "sm:pl-[0px] pl-[13px] inline-flex justify-start items-center"
    }, div(
      {
        class: "w-24 justify-start text-black text-base font-bold",
      },
     modalInput
    ),
    div(
      {
        class: "sm:w-48 w-[5rem] justify-start text-black text-base font-bold",
      },
     div(
        {
          class:
            "w-full justify-start text-gray-500 text-base font-bold item line-through",
        },
        `$${cartItemValue.salePrice.value}`
      ),
      div(
        {
          class:
            "w-full justify-start text-black text-base",
        },
       `$${cartItemValue.salePrice.value}`
      )
    ),
    div(
      {
        class: "w-[59px] justify-start text-black text-base font-bold sm:m-[0px] m-[7px]",
      },
      `$${cartItemValue.salePrice.value}`
    ),
    modalCloseButton)
    
  
  );
  decorateIcons(itemsscontainer);
  return itemsscontainer;
};

export const sessionObject = async (
  type,
  quantity,
  lineItemId,
  manufacturer
) => {
  console.log(
    "type, quantity, lineItemId, manufacturer",
    type,
    quantity,
    lineItemId,
    manufacturer
  );
  const getProductDetailsObject = await getProductDetailObject();
  if (getProductDetailsObject) {
    console.log(getProductDetailsObject.data);
    const foundObject = getProductDetailsObject.data.find((obj) =>
      obj.hasOwnProperty(manufacturer)
    );

    if (foundObject) {
      console.log(`Found an object with the key`, foundObject);
      const result = foundObject[manufacturer].find(
        (obj) => obj.lineItemId === lineItemId
      );
      if (result) {
        console.log("resulttt", result);
        if (type == "delete-item") {
          const index = foundObject[manufacturer].indexOf(result);
          foundObject[manufacturer].splice(index, 1);
          console.log("resulttt", foundObject[manufacturer].length);
          if (foundObject[manufacturer].length == 0) {
            const manufacturerIndex =
              getProductDetailsObject.data.indexOf(foundObject);
            console.log("manufacturer index", manufacturerIndex);
            getProductDetailsObject.data.splice(manufacturerIndex, 1);
            sessionStorage.removeItem("productDetailObject");
            sessionStorage.setItem(
              "productDetailObject",
              JSON.stringify(getProductDetailsObject.data)
            );
            return "success";
          } else {
            console.log("index", foundObject[manufacturer]);
            const manufacturerIndex =
              getProductDetailsObject.data.indexOf(foundObject);
            console.log(
              "getProductDetailsObject.data.indexOf(foundObject)",
              getProductDetailsObject.data[manufacturerIndex][manufacturer]
            );
            getProductDetailsObject.data[manufacturerIndex][manufacturer] =
              foundObject[manufacturer];
            console.log(getProductDetailsObject);
            sessionStorage.removeItem("productDetailObject");
            sessionStorage.setItem(
              "productDetailObject",
              JSON.stringify(getProductDetailsObject.data)
            );
            return "success";
          }
        } else {
          result.itemQuantity = quantity;
          const index = foundObject[manufacturer].indexOf(result);
          foundObject[manufacturer][index] = result;
          console.log("resulttt", foundObject[manufacturer]);
          const manufacturerIndex =
            getProductDetailsObject.data.indexOf(foundObject);
          console.log(
            "getProductDetailsObject.data.indexOf(foundObject)",
            getProductDetailsObject.data[manufacturerIndex][manufacturer]
          );
          getProductDetailsObject.data[manufacturerIndex][manufacturer] =
            foundObject[manufacturer];
          console.log(getProductDetailsObject);
          sessionStorage.removeItem("productDetailObject");
          sessionStorage.setItem(
            "productDetailObject",
            JSON.stringify(getProductDetailsObject.data)
          );
          return "success";
        }
      }
    } else {
      console.log(`No object with the key' was found.`);
      return "No object with the key' was found";
    }
  }
};

export const updateProductQuantityValue = async (
  type,
  quantity,
  lineItemId,
  manufacturer
) => {
  if (type == "delete-item") {
    const quantityElement = document.getElementById(lineItemId);
    const opco = manufacturer.split(" ")[0];
    const response = await sessionObject(
      type,
      quantity,
      lineItemId,
      manufacturer
    );
    if (response) {
      console.log("sucess response")
      console.log("sucess response", quantityElement)
      quantityElement.remove();
      const manufacturerElement = document.getElementById(manufacturer);
      const manufacturerDiv = document.getElementById(opco);
      console.log("quantity element", manufacturerElement);
      console.log("manufacturerDiv", manufacturerDiv);
      const hr = manufacturerElement.querySelector("hr");
      console.log("hr", hr);
      console.log("child nodesssss", manufacturerElement.children.length);
      if (manufacturerElement.children.length == 1) {
        manufacturerDiv.parentElement.remove();
        manufacturerDiv.remove();
        hr.remove();
        manufacturerElement.remove();
      }
    }
    return response;
  } else {
    console.log("quantity n lineItemId", quantity, lineItemId);
    const quantityElement = document.getElementById(lineItemId);
    console.log("quantity element", quantityElement);
    const response = await sessionObject(
      type,
      quantity,
      lineItemId,
      manufacturer
    );
    return response;
  }
};

export const divider = (val) => {
  return hr({
    class: `w-full border-black-${val}`,
  });
};

export async function updateCart(newItem) {
  const getProductDetailsObject = await getProductDetailObject();
  if (getProductDetailsObject) {
    console.log("getProductDetailsObject", getProductDetailsObject);
    const response = getProductDetailsObject.data.map((itemToBeDisplayed) => {
      console.log("itemToBeDisplayed", itemToBeDisplayed);
      const opcoBe = Object.keys(itemToBeDisplayed);
      const imgsrc = opcoBe[0].split(" ")[0];
      if (newItem[0].data.manufacturer == opcoBe[0]) {
        const quantityElement = document.getElementById(
          `product-Quantity-${opcoBe[0]}`
        );
        const cartContainer = document.getElementById(opcoBe[0]);
        if (cartContainer) {
          cartContainer.append(cartItemsContainer(newItem[0].data)); // Add updated item
          quantityElement.innerHTML = ` ${itemToBeDisplayed[opcoBe].length} Items`;
          return cartContainer;
        } else {
          console.log("inside else");
          const cartItemContainer =
            document.getElementById("cartItemContainer");
          if (cartItemContainer.hasChildNodes() === false) {
            console.log("inside if");
            const cartListContainer = div({
              class: "w-full",
              id: "cartListContainer",
            });
            const addProductListContainer = div({
              class: "",
              id: "addProductListContainer",
            });
            const cartItemDisplayContainer = div({
              class: "",
              id: opcoBe[0],
            });

            let logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
            console.log("logoDivDisplay: 381", logoDivDisplay);
            // cartListContainer.append(divider(300));
            cartListContainer.append(logoDivDisplay);
            // cartListContainer.append(divider(200));
            itemToBeDisplayed[opcoBe].forEach((item) => {
              cartItemDisplayContainer.append(divider(200));
              cartItemDisplayContainer.append(cartItemsContainer(item));
              
            });

            cartListContainer.append(cartItemDisplayContainer);
            // cartListContainer.append(divider(300));
            console.log("cartItemDisplayContainer 181: ", cartItemContainer);
            const dividerMain = hr({
              class: `w-full border-black-400`,
            });

            addProductListContainer.append(addProducts());
            addProductListContainer.append(dividerMain);
            cartItemContainer.append(cartListContainer);
            // cartItemContainer.append(addProductListContainer);
            return cartItemContainer;
          } else {
            const cartListContainer =
              document.getElementById("cartListContainer");
            console.log("inside else", cartListContainer);
            const cartItemDisplayContainer = div({
              class: "w-full",
              id: opcoBe[0],
            });

            let logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
            console.log("logoDivDisplay 411", logoDivDisplay);
            // cartListContainer.append(divider(300));
            cartListContainer.append(logoDivDisplay);
            // cartListContainer.append(divider(200));
            itemToBeDisplayed[opcoBe].forEach((item) => {
              cartItemDisplayContainer.append(divider(200));
              cartItemDisplayContainer.append(cartItemsContainer(item));
              
            });
            cartListContainer.append(cartItemDisplayContainer);
            // cartListContainer.append(divider(300));
            return cartItemContainer;
          }
        }
      }
    });
    console.log("responseeee", response);
    if (response[0] == undefined) return response[1];
    else return response[0];
  }
}

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
