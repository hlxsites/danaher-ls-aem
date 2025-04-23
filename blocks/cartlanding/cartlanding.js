// import mycart from "./mycart.js";


export default function decorate(block) {
  console.log("CART")
  block.textContent = '';
  localStorage.setItem("totalProductQuantity", 3);
  // block.append(mycart());
}