import {mycart} from "./mycart.js";


export default async function decorate(block) {
  let myCartContainer = await mycart()
  block.append(myCartContainer);
}