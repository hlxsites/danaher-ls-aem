import { mycart } from './mycart.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';

export default async function decorate(block) {
  console.log(' cartlanding : ');
  
  showPreLoader();
  const myCartContainer = await mycart();
  removePreLoader();
  block.append(myCartContainer);
}
