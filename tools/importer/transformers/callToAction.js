/* global WebImporter */
const createCTA = (main, document) => {
  const ctaSection = main.querySelector('CTAsection');
  if (ctaSection) {
    const cells = [];
    const title = ctaSection.getAttribute('title');
    const btnText1 = ctaSection.getAttribute('btntext1');
    const rfqBtn1 = ctaSection.getAttribute('rfqbtn1');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    cells.push(['CTASection']);
    if (h2) {
      cells.push([h2]);
    }
    const btn = document.createElement('button');
    btn.textContent = btnText1;
    if (rfqBtn1 && btn.textContent) {
      cells.push([btn]);
    }
    if (cells.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      ctaSection.append(block);
    }
  }
};
export default createCTA;
