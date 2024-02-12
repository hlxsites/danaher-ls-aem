/* global WebImporter */
const createStats = (main, document) => {
  const stats = main.querySelector('stats');
  if (stats) {
    const div = document.createElement('div');
    const title = stats.getAttribute('title');
    const description = stats.getAttribute('description');
    if (title) {
      const h2El = document.createElement('h2');
      h2El.textContent = title;
      div.append(h2El);
    }
    if (description) {
      const pEl = document.createElement('p');
      pEl.textContent = description;
      div.append(pEl);
    }
    const cells = [
      ['Stats'],
      [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    stats.append(block);
  }
};
export default createStats;
