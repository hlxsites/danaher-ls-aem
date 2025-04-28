// import decorate from "../blocks/cartlandingpage/cartlandingpage.js";
// import mycart from "../blocks/mycart/mycart.js";
import { updateCartQuantity } from "../blocks/cartlanding/mycart.js";
import { updateCart, deleteCartItem} from "../blocks/cartlanding/cartItem.js";
import { updateCartButton } from "../blocks/cartlanding/recommendedproducts.js";

export let cartItemsValue = [{
    id:1,
    src:"https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg",
    name:"Neutral Capillary 50 µm ID x 67 cm",
    sku:"477441",
    quantity:"2",
    price:"$200.40"
},
{
    id:2,
    src:"https://placehold.co/91x85",
    name:"DNA Capillary",
    sku:"477477",
    quantity:"50",
    price:"$138.40"
},
{
    id:3,
    src:"https://placehold.co/91x85",
    name:"N-CHO Capillary",
    sku:"477601",
    quantity:"2",
    price:"$138.57"
}];

export let recommendedProduct = [{
    id:1,
    src:"https://placehold.co/91x85",
    name:"Neutral Capillary 50 µm ID x 67 cm",
    sku:"477441",
    quantity:"2",
    price:"$200.40"
},
{
    id:2,
    src:"https://placehold.co/91x85",
    name:"DNA Capillary",
    sku:"477487",
    quantity:"10",
    price:"$338.40"
},
{
    id:3,
    src:"https://placehold.co/91x85",
    name:"DNA-1 Capillary",
    sku:"477467",
    quantity:"20",
    price:"$238.40"
},
{
    id:4,
    src:"https://placehold.co/91x85",
    name:"DNA-2 Capillary",
    sku:"477479",
    quantity:"30",
    price:"$128.40"
},
{
    id:5,
    src:"https://placehold.co/91x85",
    name:"DNA-3 Capillary",
    sku:"477476",
    quantity:"100",
    price:"$148.40"
},
{
    id: 6,
    src:"https://placehold.co/91x85",
    name:"N-CHO Capillary",
    sku:"477601",
    quantity:"2",
    price:"$138.57"
},
{
    id:7,
    src:"https://placehold.co/91x85",
    name:"Neutral Capillary 50 µm ID x 67 cm",
    sku:"477441",
    quantity:"2",
    price:"$200.40"
},
{
    id:8,
    src:"https://placehold.co/91x85",
    name:"DNA Capillary",
    sku:"477487",
    quantity:"10",
    price:"$338.40"
},
{
    id:9,
    src:"https://placehold.co/91x85",
    name:"DNA-1 Capillary",
    sku:"477467",
    quantity:"20",
    price:"$238.40"
},
{
    id:10,
    src:"https://placehold.co/91x85",
    name:"DNA-2 Capillary",
    sku:"477479",
    quantity:"30",
    price:"$128.40"
},
{
    id:11,
    src:"https://placehold.co/91x85",
    name:"DNA-3 Capillary",
    sku:"477476",
    quantity:"100",
    price:"$148.40"
},
{
    id: 12,
    src:"https://placehold.co/91x85",
    name:"N-CHO Capillary",
    sku:"477601",
    quantity:"2",
    price:"$138.57"
}];

export const updateCartItemQunatity = (item) => {
    // console.log("item to be updated", item);
    if(item.type == "delete-item"){
        console.log("DELETE ITEM FROM BASKET API CALLLED HERE WITH: ",  item);
        const totalProductQuantity = localStorage.getItem("totalProductQuantity");
        let prodQuantity = Number(totalProductQuantity)-1;
        localStorage.setItem("totalProductQuantity", prodQuantity);
        updateCartQuantity(prodQuantity);
        deleteCartItem(prodQuantity, Number(item.itemId))
        
    }
    else {
        console.log("UPDATE SINGLE ITEM QUANTITY API CALLED HERE WITH: ", item)
    }

}

export const addItemToCart = (item) => {
    console.log("item to be updated", item);
     let newItem = {
            id:4,
            src:"https://placehold.co/91x85",
            name:"DNA Capillary",
            sku:"477477",
            quantity:"10",
            price:"$158.40"
    };
    const totalProductQuantity = localStorage.getItem("totalProductQuantity");
    let prodQuantity = Number(totalProductQuantity)+1;
    localStorage.setItem("totalProductQuantity", prodQuantity);
    updateCartQuantity(prodQuantity);
    updateCart(prodQuantity, newItem);
    updateCartButton(item);
    return  localStorage.getItem("totalProductQuantity")

}