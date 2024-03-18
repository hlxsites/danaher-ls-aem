/* global WebImporter */
const c2aText = (ctaTxt, document) => {
  const ctaEl = ctaTxt.querySelector('p');
  if (ctaEl) {
    const divEl = document.createElement('div');
    const anc = document.createElement('a');
    const hrefEl = ctaEl?.querySelector('a')?.getAttribute('href');
    anc.href = hrefEl;
    divEl.append(ctaEl?.textContent);
    divEl.append(anc);
    const cells = [
      ['Call to action (link-text)'], [divEl],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    ctaTxt.innerHTML = '';
    ctaTxt.append(block);
  }
};

const createCallToActionText = (main, document) => {
  const ctaTextEl = main.querySelectorAll('div#calltoaction-text');
  [...ctaTextEl].forEach((ctaTxt) => {
    c2aText(ctaTxt, document);
  });
};

export default createCallToActionText;
