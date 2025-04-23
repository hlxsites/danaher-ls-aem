import mycart from "./mycart.js";


export default function decorate(block) {
  localStorage.setItem("totalProductQuantity", 3);
  block.append(mycart());
}