/* global WebImporter */
const createWeSee = (main, document) => {
  const weSee = main.querySelector('wesee');
  if (weSee) {
    const anc = document.createElement('a');
    anc.setAttribute('href', 'https://main--danaher-ls-aem--hlxsites.hlx.page/fragments/wesee.html');
    anc.textContent = 'WeSee';
    weSee.after(WebImporter.DOMUtils.createTable([['We See'], [anc]], document), document.createElement('hr'));
  }
};
export default createWeSee;
