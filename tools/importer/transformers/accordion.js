/* global WebImporter */
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser
const createAccordion = (main, document) => {
  const accordion = main.querySelector('accordion');
  const cells = [];
  if (accordion) {
    const accordionHeader = document.createElement('div');
    accordionHeader.textContent = accordion?.getAttribute('accordionheader');
    try {
      // eslint-disable-next-line no-undef
      const accordionLists = JSON.parse(decodeHtmlEntities(accordion.getAttribute('accordionlist')));
      cells.push(['Accordion']);
      const definitionlists = accordionLists.map((list) => {
        const pEl = document.createElement('p');
        pEl.innerHTML = list.description;
        const divEl = document.createElement('div');
        const strogEl = document.createElement('h3');
        strogEl.innerHTML = list.title;
        divEl.append(strogEl);
        divEl.append(pEl);
        return [divEl];
      });
      if (accordionHeader.innerHTML) cells.push([accordionHeader.textContent]);
      cells.push(...definitionlists);
      const block = WebImporter.DOMUtils.createTable(cells, document);
      accordion.append(block);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing data layer JSON:', error);
    }
  }
};
export default createAccordion;
