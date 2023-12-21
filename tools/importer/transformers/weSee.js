/* global WebImporter */
const createWeSee = (main, document) => {
  const weSee = main.querySelector('wesee');
  if (weSee) {
    weSee.after(WebImporter.DOMUtils.createTable([['We See'], ['']], document), document.createElement('hr'));
  }
};
export default createWeSee;
