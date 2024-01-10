import { getAuthorization, getCommerceBase } from '../../scripts/commerce.js';

const baseURL = getCommerceBase();
/* eslint-disable no-console */
export default class ProductTile extends HTMLElement {
  sku;

  result;

  product;

  showPartList = false;

  specifications = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  hasPrice() {
    return this.product?.salePrice && this.product?.salePrice?.value > 0;
  }

  bundlepreviewJson() {
    return this.result?.raw?.bundlepreviewjson
      ? JSON.parse(this.result?.raw?.bundlepreviewjson) : [];
  }

  getSpecifications() {
    if (this.result?.raw?.specificationsjson) {
      const specifications = JSON.parse(this.result?.raw?.specificationsjson);
      const trimmedSpecifications = {};
      let keys = Object.keys(specifications);
      const filteredSpecification = keys.filter((key) => specifications[key]?.at(0)?.length > 0)
        .reduce((obj, key) => {
          obj[key] = specifications[key];
          return obj;
        }, {});
      keys = Object.keys(filteredSpecification);
      if (keys.length > 3) {
        this.specifications = keys.slice(0, 3).forEach((key) => {
          trimmedSpecifications[key] = specifications[key];
        });
        this.specifications = trimmedSpecifications;
      } else {
        this.specifications = filteredSpecification;
      }
    }
    return this.specifications;
  }

  // eslint-disable-next-line class-methods-use-this
  formatCurrency(value, currencyCode) {
    if (value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode?.toUpperCase() || 'USD',
      }).format(value);
    }
    return '';
  }

  async connectedCallback() {
    const { resultContext } = await import(
      // eslint-disable-next-line import/no-unresolved
      'https://static.cloud.coveo.com/atomic/v2/index.esm.js'
    );
    this.result = await resultContext(this);
    this.sku = this.result.raw.sku;
    await this.getProduct();
    this.getSpecifications();
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Attach a click event listener to the button
    const button = this.shadowRoot.querySelector('.add-to-quote');
    button?.addEventListener('click', this.onButtonClick.bind(this));
    const bundleDetails = this.shadowRoot.querySelector('.bundle-details');
    bundleDetails?.addEventListener('click', () => {
      this.showPartList = !this.showPartList;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onButtonClick() {
    this.addToQuote();
  }

  async getProduct() {
    try {
      if (this.sku) {
        const product = await fetch(`${baseURL}/products/${this.sku}`);
        this.product = product;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addToQuote() {
    try {
      const authHeader = getAuthorization();
      if (authHeader && (authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
        const quote = await fetch(`${baseURL}/rfqcart/-`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...Object.fromEntries(authHeader) },
          body: JSON.stringify({
            quantity: {
              type: 'Quantity',
              value: 1,
              unit: 'N/A',
            },
            productSKU: this.sku,
            image: this.image,
            brand: this.opco,
            productDescription: this.description,
            referrer: window.location.href,
            referrerTitle: document.title.replace('| Danaher Lifesciences', '').replace('| Danaher Life Sciences', '').trim(),
            country: this.country,
          }),
        });
        this.quote = quote;
        if (this.quote.status === 200) {
          const responseJson = await this.quote.json();
          const addedProduct = responseJson?.items?.slice(-1)?.at(0);
          const { default: getToast } = await import('../../scripts/toast.js');
          await getToast('quote-toast', addedProduct);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          @import url('/styles/coveo-custom/product-tile.css');
        </style>
        <div class="tile-wrapper ${this.showPartList ? 'no-border' : 'border-bottom'}">
        <div class="flex-wrapper ${!this.result?.raw?.objecttype || this.result?.raw?.objecttype === 'Family' ? 'family-width' : ''}
                                 ${this.result?.raw?.objecttype === 'Product' || this.result?.raw?.objecttype === 'Bundle' ? 'product-width' : ''}">
          <div class="image-container">
            <atomic-result-image field="images" aria-hidden="true"></atomic-result-image>
          </div>
          <div class="${this.result?.raw?.objecttype === 'Family' ? 'family-description' : 'description'}">
            ${this.result?.raw?.objecttype === 'Product' || this.result?.raw?.objecttype === 'Bundle' ? `
              <atomic-field-condition if-defined="opco">
                <atomic-result-text class="brand-info" field="opco"></atomic-result-text>
              </atomic-field-condition>
            ` : ''}
            <atomic-result-title class="title">
              <atomic-result-link href-template="\${clickUri}"></atomic-result-link>
            </atomic-result-title>
            <div class="sku-text">
              ${this.result?.raw?.objecttype === 'Product' || this.result?.raw?.objecttype === 'Bundle' ? `
                <atomic-field-condition if-defined="sku">
                  <p><atomic-result-text class="att-value" field="sku"></atomic-result-text></p>
                </atomic-field-condition>
              ` : ''}
            </div>
            ${this.result?.raw?.objecttype === 'Family' || this.result?.raw?.objecttype === 'Bundle' ? `
              <div class="product-description ${this.result?.raw?.objecttype === 'Family' ? 'family' : ''}">
                ${this.result?.raw?.richdescription}
              </div>
              ${this.result?.raw?.objecttype === 'Bundle' ? `
                <div class="full-specification">
                  <atomic-result-link href-template="\${clickUri}#specification">
                    <span>See Full Specifications</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="icon" data-di-res-id="2763394-7ac7125b" data-di-rand="1704742889810"><path fill-rule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clip-rule="evenodd"></path></svg>
                  </atomic-result-link>
                </div>
              ` : ''}
            ` : ''}
            ${this.result?.raw?.objecttype === 'Product' ? `
              <div class="a">
              ${Object.entries(this.specifications).map(([index, content]) => `
                <div class="b">
                  <div class="c">
                    <div class="d">
                      ${index}:
                    </div>
                  </div>
                  <div class="e">
                    <div class="d">
                      ${typeof content !== 'object' ? content : content.toString().replaceAll(',', ', ')}
                    </div>
                  </div>
                </div>
              `).join('')}
              </div>
              <div class="full-specification">
                <atomic-result-link href-template="\${clickUri}#specification">
                  <span>See Full Specifications</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="icon" data-di-res-id="2763394-7ac7125b" data-di-rand="1704742889810"><path fill-rule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clip-rule="evenodd"></path></svg>
                </atomic-result-link>
              </div>
            ` : ''}
          </div>
        </div>
        <atomic-field-condition class="family-wrapper" must-match-objecttype="Family">
          <div class="middle-align">
            <atomic-result-link href-template="\${clickUri}">
              <button class="btn btn-outline-brand">Learn More</button>
            </atomic-result-link>
          </div>
        </atomic-field-condition>
        ${this.result?.raw?.objecttype === 'Product' || this.result?.raw?.objecttype === 'Bundle' ? `
          <div class="action-wrapper">
            <div class="middle-align">
              <div class="add-to-cart-wrapper">
                <div class="price-block">
                  <h3 class="price-text ${!this.hasPrice() ? 'no-price' : ''}">
                    ${this.hasPrice() ? `${this.formatCurrency(this.product.salePrice?.value, this.product.salePrice?.currencyMnemonic)}` : 'Request for Price'}
                    ${this.hasPrice() ? '<pre class="price-currency">(USD)</pre>' : ''}
                  </h3>
                </div>
                <div class="price-attribute">
                  <p class="price-attribute-text">Unit of Measure:</p>
                  <p class="price-attribute-value">
                    ${this.product?.minOrderQuantity ? `${this.product.minOrderQuantity}` : '1'}/${this.product?.packingUnit ? `${this.product.packingUnit}` : 'EA'}
                  </p>
                </div>
                <div class="price-attribute">
                  <p class="price-attribute-text">Min. Order Qty:</p>
                  <p class="price-attribute-value">${this.product?.minOrderQuantity ? `${this.product?.minOrderQuantity}` : '1'}</p>
                </div>
                <div class="add-to-cart-cta ${this.hasPrice() ? 'flex-between' : 'flex-end'}">
                  ${this.hasPrice() ? `
                    <input name="qty" type="text" class="quantity-input" autocomplete="off"/>
                    <button class="btn px-6 py-3 btn-outline-brand">Add to Cart</button>
                  ` : ''}
                  <button class="btn px-6 py-3 btn-outline-brand add-to-quote"> Add to Quote </button>
                </div>
                ${this.bundlepreviewJson()?.length > 0 ? `
                  <a href="#" class="danaherpurple bundle-details flex">
                    ${this.showPartList ? 'Hide' : 'Show'} Product Details 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="bundle-icon ${this.showPartList ? 'rotate' : ''}"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd"></path></svg>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
      ${this.showPartList ? 'show' : 'hide'}
      ${this.showPartList ? `
        <div class="gray-background padding-x-3">
          <div class="flex-justify-between bundle-heading">
            <span class="bundle-title">Products</span>
            <span class="bundle-qty">QTY</span>
          </div>
        </div>
        ${Object.entries(this.bundlepreviewJson()).map(([bundle]) => `
          <div class="flex-justify-between border-bottom">
            <div class="flex-wrapper">
              <div class="bundle-image-container">
                <img :src="${bundle?.image}" :title="${bundle?.title}" class="bundle-image"/>
              </div>
              <div class="description">
                <span class="bundle-p-title">${bundle?.title}</span>
                <div class="sku-text">
                  <p>${bundle?.sku}</p>
                </div>
              </div>
            </div>
            <div class="bundle-qty">
              ${bundle?.quantity}
            </div>
          </div>
        `).join('')}` : ''}`;
  }
}
