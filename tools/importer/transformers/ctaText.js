/* global WebImporter */
const ctaText = (ctaTxt, document) => {
  const ctaEl = ctaTxt.querySelector('p');
  if (ctaEl) {
    const divEl = document.createElement('div');
    const anc = document.createElement('a');
    const hrefEl = ctaEl?.querySelector('a')?.getAttribute('href');
    anc.href = hrefEl;
    divEl.append(ctaEl?.textContent);
    divEl.append(anc);
    const cells = [
      ['CTA Text'], [divEl],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    ctaTxt.innerHTML = '';
    ctaTxt.append(block);
  }
};

const createCTAText = (main, document) => {
  const ctaTextEl = main.querySelectorAll('div#cta-text');
  [...ctaTextEl].forEach((ctaTxt) => {
    ctaText(ctaTxt, document);
  });
};

export default createCTAText;
