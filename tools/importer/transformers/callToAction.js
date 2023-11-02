/* global WebImporter */
const createCTA = (main, document) => {
  const ctaSection = main.querySelector('CTAsection');
  if (ctaSection) {
    const title = ctaSection.getAttribute('title');
    const btnText1 = ctaSection.getAttribute('btntext1');
    const rfqBtn1 = ctaSection.getAttribute('rfqbtn1');
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    if (h2) {
      div.append(h2);
    }
    const btn = document.createElement('button');
    btn.textContent = btnText1;
    if (rfqBtn1 && btn.textContent) {
      div.append(btn);
    }
    const cells = [
      ['CTASection'],
      [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    ctaSection.append(block);
  }
};
export default createCTA;