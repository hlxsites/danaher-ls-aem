


export default async function decorate(block) {
    console.log("block", block);
    block?.parentElement?.parentElement?.removeAttribute('class');
     block?.parentElement?.parentElement?.removeAttribute('style');
  const pdp_tab_wrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0'
  });
    pdp_tab_wrapper.classList.add('pdppp');
  block.innerHTML = '';
  block.appendChild(pdp_tab_wrapper);
}