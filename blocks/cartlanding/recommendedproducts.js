import { div, button, input, span, img } from "../../scripts/dom-builder.js";
import { addItemToCart, recommendedProduct } from "../../utils/utils.js";
// import { prodQuantity } from "../mycart/mycart.js";

const cartItemsContainer= (recommendedProduct) =>{
    // console.log("recommendedProduct", recommendedProduct.id)
    const addToCartButton =  button({
        id:`${recommendedProduct.id}`,
        class:"btn btn-lg font-medium btn-primary-purple rounded-full px-6"
     },"Add to Cart");

     addToCartButton.addEventListener("click", (event)=>{

        const itemId = event.target.id;        
        const res = addItemToCart(itemId);       
        
      });

    
    const itemContainer = div({
        class: "inline-flex flex-col justify-between"
    },
        // img({
        //     class: "category-image mb-2 h-48 w-full object-contain",
        //     src: recommendedProduct.src
        // }),
        div(
            { class: 'relative w-full h-full flex flex-col border rounded-md cursor-pointer transition z-10' },
            div(
              img({
                class: 'category-image mb-2 h-48 w-full object-contain', src: recommendedProduct.src, loading: 'lazy',
              }),
            )),
        div({
            class: ""
        },
            div({
                class: "description !px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20 py-4"
            }, recommendedProduct.name),
            div({
                class: " text-gray-500 text-base font-extralight"
            }, `SKU: ${recommendedProduct.sku}`),
        ),
        div({
            class: "w-24 h-10 left-[63px] top-[57px] bg-white"
        }),
        div({
            class: "w-48 h-7 justify-start"
        },
        span({
            class:"text-gray-900 text-2xl font-bold font-['TWK_Lausanne_Pan'] leading-loose"
        }, recommendedProduct.price),
        span({
            class:"text-gray-900 text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug"
        },"(USD)")),
        
        div({
            class: ""
        },
            div({
                class: "w-11 h-10 px-4 border-solid border-2 inline-flex  justify-between items-center"
            }, recommendedProduct.quantity),
        addToCartButton),
        
              
    );
    return itemContainer;
}

export const updateCartButton = (itemID) => {
    const addCartButton = document.getElementById(itemID);
    console.log("responseee", addCartButton)
    if (addCartButton) {
        addCartButton.innerHTML = "Added";
    }
}

export const recommendedProducts = () => {
    const recommContainer = div({
        class:"inline-flex flex-col"
    })
    const otherProducts = div({
            class: ""
        },
        div(
            {
              class: "w-[683px] mt-12 px-4 py-3 justify-start text-black text-3xl font-normal font-['TWK_Lausanne_Pan'] leading-10",
            },
            "Others also bought"
        )
    );
    recommContainer.append(otherProducts);
    const recomm = div({
        class: "inline-flex gap-4 top-[1358px]"
    });
    recomm.append(cartItemsContainer(recommendedProduct[0]));
    recomm.append(cartItemsContainer(recommendedProduct[1]));
    recomm.append(cartItemsContainer(recommendedProduct[2]));
    recomm.append(cartItemsContainer(recommendedProduct[3]));
    recomm.append(cartItemsContainer(recommendedProduct[4]));
    recomm.append(cartItemsContainer(recommendedProduct[5]));
    recommContainer.append(recomm);
    return recommContainer;
    
}