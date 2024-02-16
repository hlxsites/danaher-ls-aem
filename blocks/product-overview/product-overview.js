import { getProductResponse } from '../../scripts/commerce.js';

export default async function decorate(block) {
  const response = await getProductResponse();
  if (response?.length > 0) {
    block.innerHTML = response[0].raw?.richlongdescription ? response[0].raw.richlongdescription : '';
    block.classList.add(...'text-lg leading-7 overview xl:w-3/4 href-text v-html text-danahergray-700'.split(' '));
    block.querySelectorAll('h4, p, li').forEach((item) => {
      item?.classList?.add('pt-2.5');
    });
    block.querySelectorAll('ul').forEach((item) => {
      item?.classList?.add(...'list-disc pl-12'.split(' '));
    });
  }
}
