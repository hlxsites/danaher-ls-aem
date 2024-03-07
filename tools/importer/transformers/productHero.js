/* global WebImporter */

async function getProductTitle(url) {
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/products\/(family\/|sku\/)/)) {
    const urlStr = url.pathname.replace(/^\/content\/danaher\/ls/, '').replace(/\.html$/, '');
    const productMeta = await fetch('https://main--danaher-ls-aem--hlxsites.hlx.live/metadata-products.json')
    .then((response) => {
      return response.json();
    });
    const reqestedProduct = Array.from(productMeta.data).filter((product) => product.URL === urlStr);
    if(reqestedProduct.length === 1) {
      return reqestedProduct[0].title;
    }
  }
}

const createProductHero = async (main, document, param, url) => {
  const product = main.querySelector('product-page');
  if (product) {
    const btnText = product.getAttribute('rfqbuttontext');
    const productCells = [
      ['Product Hero'],
      [btnText],
    ];

    const title = document.createElement('h1');
    title.textContent = await getProductTitle(url);
    if(title.textContent) productCells.push([title]);
    if (btnText) {
      const block = WebImporter.DOMUtils.createTable(productCells, document);
      product.append(block, document.createElement('hr'));
    }
  }
};
export default createProductHero;
