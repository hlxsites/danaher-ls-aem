/* global WebImporter */
const embedScript = (main, document) => {
  const scriptEl = main.querySelector('div.script');
  if (scriptEl) {
    const iFrame = scriptEl.querySelector('iframe');
    if (iFrame) {
      const anc = document.createElement('a');
      anc.textContent = iFrame.getAttribute('title');
      anc.href = iFrame.getAttribute('src');

      const cells = [
        ['embed'],
        [anc],
      ];
      const block = WebImporter.DOMUtils.createTable(cells, document);
      scriptEl.innerHTML = '';
      scriptEl.append(block);
    }
  }
};
export default embedScript;
