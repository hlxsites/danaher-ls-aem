/* global WebImporter */
const createProductCategoryList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  const placeholder = main.querySelector('div#related-articles');
  if (placeholder) {
    let blockName = 'Related Articles';
    if (url && url.includes('/us/en/products/brands/')) blockName = 'related-articles (opco-home)';
    const block = [[blockName], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createProductCategoryList;
