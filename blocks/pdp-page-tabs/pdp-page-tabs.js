import {
  a, div, p,
  span,
} from '../../scripts/dom-builder.js';
import { getPdpDetails } from '../../scripts/coveo/controller/controllers.js';
import { searchEngine } from '../../scripts/coveo/engine.js';

export default async function decorate(block) {
    console.log("block", block);
    block?.parentElement?.parentElement?.removeAttribute('class');
     block?.parentElement?.parentElement?.removeAttribute('style');
     await getPdpDetails('mica');
  searchEngine.subscribe(() => {
    const title = searchEngine.state.search.results[0]?.raw?.title;
    if (searchEngine.state.search.results[0])
      console.log(searchEngine.state.search.results[0]?.raw);
    const heading = block.querySelector('h1');
    if (heading && title?.trim() !== '') {
      heading.textContent = title;
    }
  });
  const pdp_tab_wrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0'
  });
    pdp_tab_wrapper.classList.add('pdppp');
    console.log("pdp_tab_wrapper", pdp_tab_wrapper);
  block.innerHTML = '';
  block.appendChild(pdp_tab_wrapper);
}