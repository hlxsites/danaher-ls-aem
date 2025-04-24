import {
    span, img, div, a, input, button, hr, p
} from '../../scripts/dom-builder.js';
import { addProducts } from './addproducts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { updateCartItemQunatity, cartItemValue } from '../../utils/utils.js';
import { makePublicUrl, imageHelper, generateUUID } from '../../scripts/scripts.js';
// import { updateCartValue } from '../../utils/utils.js';

export const cartItemsContainer = (cartItemValue) =>{
    
   
    const updateCart = (itemId, type, value) => {
        const splitItemId = itemId.split('-');
        const item = {
            itemId : splitItemId[1] ,
            value: value,
            type: type
        }
        updateCartItemQunatity(item);
    }
    const modalCloseButton = button(
        {        
          class: 'w-10 h-10 pr-11',
          
        },
        span({
            id:`delteItem-${cartItemValue.id}`,
          class: "icon icon-icons8-delete cart-delete",
          
          
        })
      );
      modalCloseButton.addEventListener("click", (event)=>{
        const itemId = event.target.id || event.target.closest('span').id;
        // console.log(`Clicked on item with ID: ${itemId}`);
        updateCart(itemId, "delete-item", "")
      });
      const modalInput =   input({
        id: `item-${cartItemValue.id}`,
        class:"w-[3.5rem] h-10 pl-4 bg-white font-medium rounded-md text-black border-solid border-2 inline-flex justify-center items-center",
        type:"number",
        name:"item-quantity",
        value:cartItemValue.quantity,       

    });
    modalInput.addEventListener("change", (event) =>{
        const itemId = event.target.id || event.target.closest('span').id;
        // console.log(`Clicked on item with ID: ${itemId}`);
        updateCart(itemId, "quantity-added", event.target.value)
        
    });
    const image = imageHelper("https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg", cartItemValue.name, {
            href: makePublicUrl("https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg"),
            title: cartItemValue.name,
            class: 'justify-center',
    });
    const itemContainer = div({   
        class: "flex w-[958px] justify-between items-center"
    },
       div(
            { class: 'w-[73px] h-[93px] flex flex-col justify-center items-center cursor-pointer' },
           image),
        div({
            class: "xl:w-1/4"
        },
            div({
                class: ""
            }, cartItemValue.name),
            div({
                class: " text-gray-500 text-base font-extralight"
            }, `SKU: ${cartItemValue.sku}`),
        ),
        div({
            class: ""
        },
        // button({
        //     class:"w-10 h-10 btn bg-white font-medium rounded-md text-black border-solid border-2",
        //     id:"item-quantity",
        //     value:cartItemValue.id
        //  }, cartItemValue.quantity)),
       modalInput
        ),
        div({
            class: "text-right text-black text-base font-bold"
        }, cartItemValue.price),
        modalCloseButton
    );

    decorateIcons(itemContainer)
    return itemContainer;
} 

export const divider = (val) => { return hr({
    class: `w-[958px] border-black-${val}`
}) }

export const updateCart = (newQuantity, newItem) => {
    const quantityElement = document.getElementById("product-Quantity");
    const cartContainer = document.getElementById("cartItemContainer");
   
    if (cartContainer) {
        cartContainer.replaceWith(cartItem(newItem)); // Replace the old cart with the updated one
    }
    if (quantityElement) {
      quantityElement.innerHTML = ` ${newQuantity} Items`;      
      
    }
  }

export const cartItem = (newItem = null) => {
    const totalProductQuantity = localStorage.getItem("totalProductQuantity");     
    const cartItemUpdate = localStorage.getItem("cartItem");
    
    const cartItemContainer = div({
        class: "w-8/12",
        id:"cartItemContainer"
    });
    
    cartItemContainer.append(divider(300));

    let sciex = div({
        class: "px-4 py-3 inline-flex justify-between items-center"
    }, div({
        class:"w-24 justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug"
    },"SCIEX"),
    div({
        class:"w-[50rem] justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug"
    },"SCIEX"),
    div({
        class: "justify-start text-black text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
        id: "product-Quantity"
    }, `${totalProductQuantity} Items` 
    )
);


    cartItemContainer.append(divider(300));
    cartItemContainer.append(sciex);
    cartItemContainer.append(divider(200));
    cartItemValue.map((item)=>{
        cartItemContainer.append(cartItemsContainer(item));
        cartItemContainer.append(divider(200));
    });

    const dividerMain = hr({
        class: `w-[1358px] border-black-400`
    })

    if (newItem) {
        cartItemContainer.append(cartItemsContainer(newItem));
        cartItemContainer.append(divider(200));
      }

    cartItemContainer.append(divider(300));
    cartItemContainer.append(addProducts());
    cartItemContainer.append(dividerMain);
   
    return cartItemContainer;
}