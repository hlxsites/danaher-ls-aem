import { mycart } from './mycart.js';

export default async function decorate(block) {
  const myCartContainer = await mycart();
  block.append(myCartContainer);
}
