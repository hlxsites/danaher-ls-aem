/* global WebImporter */

async function getProductTitle(url, host) {
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/products\/(family\/|sku\/)/)) {
    const urlStr = url.pathname.replace(/^\/content\/danaher\/ls/, '').replace(/\.html$/, '');
    const productMeta = await fetch(`${host}e/metadata-products.json`)
      .then((response) => response.json());
    const reqestedProduct = Array.from(productMeta.data)
      .filter((product) => product.URL === urlStr);
    if (reqestedProduct.length === 1) {
      return reqestedProduct[0].title;
    }
  }
  return 0;
}

const createProductHero = async (main, document, param, url) => {
  const host = param.opts?.converterCfg?.liveUrls[0];
  const product = main.querySelector('product-page');
  if (product) {
    const btnText = product.getAttribute('rfqbuttontext');
    const productCells = [
      ['Product Hero'],
      [btnText],
    ];

    const title = document.createElement('h1');
    const titleVal = await getProductTitle(url, host);
    title.textContent = titleVal;
    if (titleVal) productCells.push([title]);
    if (btnText) {
      const block = WebImporter.DOMUtils.createTable(productCells, document);
      product.append(block, document.createElement('hr'));
    }
  }
};
export default createProductHero;
