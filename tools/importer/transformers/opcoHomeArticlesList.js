/* global WebImporter */
const createOpcoHomeArticlesList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content?.replace(/\.html$/, '');
  const placeholder = main.querySelector('div#articles-opco-home');
  if (placeholder) {
    const pEl = document.createElement('p');
    pEl.textContent = placeholder?.innerHTML;
    let blockName = 'Articles list';
    if (url.endsWith('/us/en/new-lab')) blockName = 'Articles list (new-lab)';
    const block = [[blockName], [pEl.textContent]];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};

export default createOpcoHomeArticlesList;
