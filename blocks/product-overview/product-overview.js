import { getProductResponse } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const response = getProductResponse();
  block.classList.add(...'text-lg leading-7 overview xl:w-3/4 href-text v-html text-danahergray-700'.split(' '));
  if (response?.length > 0) {
    block.innerHTML = response[0].raw ? response[0].raw.richlongdescription : '';
  }
}
