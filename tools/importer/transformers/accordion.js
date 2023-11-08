/* global WebImporter */
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser
const createAccordion = (main, document) => {
  const accordion = main.querySelector('accordion');
  const cells = [['Accordion']];
  if (accordion) {
    const accordionHeader = document.createElement('div');
    accordionHeader.textContent = accordion.getAttribute('accordionheader');
    // eslint-disable-next-line no-undef
    const accordionLists = JSON.parse(decodeHtmlEntities(accordion.getAttribute('accordionlist')));
    const definitionlists = accordionLists.map((list) => {
      const pEl = document.createElement('p');
      pEl.innerHTML = list.description;
      const divEl = document.createElement('div');
      const strogEl = document.createElement('strong');
      strogEl.innerHTML = list.title;
      divEl.append(strogEl);
      divEl.append(pEl);
      return [divEl];
    });
    if (accordionHeader.textContent) cells.push([accordionHeader]);
    cells.push(...definitionlists);
    const block = WebImporter.DOMUtils.createTable(cells, document);
    accordion.append(block);
  }
};
export default createAccordion;
