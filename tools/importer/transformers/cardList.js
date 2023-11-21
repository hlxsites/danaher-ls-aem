/* global WebImporter */
const createCardList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  if (url) {
    let blockName;
    if (url.endsWith('/blog.html')) blockName = 'Card List (blog)';
    else if (url.endsWith('/news.html')) blockName = 'Card List (news)';
    else if (url.endsWith('/application.html')) blockName = 'Card List (application)';

    if (blockName) {
      const block = [[blockName], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      main.append(table);
    }
  }
};
export default createCardList;
