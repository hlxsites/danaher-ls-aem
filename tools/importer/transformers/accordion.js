/* global WebImporter */
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser

function getAccordion(accordion, document, cells) {
  if (accordion) {
    const accordionHeader = document.createElement('h2');
    accordionHeader.textContent = accordion.getAttribute('accordionheader');
    try {
      // eslint-disable-next-line no-undef
      const accordionLists = JSON.parse(decodeHtmlEntities(accordion.getAttribute('accordionlist')));
      const definitionlists = accordionLists.map((list) => {
        const elements = [];
        const divEl = document.createElement('div');
        if (list.image) {
          const imgEl = document.createElement('img');
          imgEl.src = list.image;
          imgEl.alt = list.imageAlt ? list.imageAlt : list.title;
          elements.push([imgEl]);
        }

        const strogEl = document.createElement('h3');
        strogEl.innerHTML = list.title;
        const pEl = document.createElement('p');
        pEl.innerHTML = list.description;
        divEl.append(strogEl);
        divEl.append(pEl);
        elements.push([divEl]);
        return elements;
      });
      if (accordionHeader.textContent) cells.push([accordionHeader]);
      cells.push(...definitionlists);
      const block = WebImporter.DOMUtils.createTable(cells, document);
      accordion.append(block);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing data layer JSON:', error);
    }
  }
}

const createAccordion = (main, document) => {
  const cells = [['Accordion']]; // Changed 'let' to 'const'
  const accordions = main.querySelectorAll('accordion');
  accordions.forEach((accordionEl) => { // Added parentheses around arrow function argument
    getAccordion(accordionEl, document, cells);
  });
};
export default createAccordion;
