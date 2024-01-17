class CustomImage extends HTMLElement {
  shadow;

  result;

  initialized = false;

  get field() {
    return this.getAttribute('field');
  }

  // eslint-disable-next-line class-methods-use-this
  createOptimizedPicture(
    src,
    alt = '',
    eager = false,
    breakpoints = [{ media: '(min-width: 600px)', width: '300' }, { width: '300' }],
  ) {
    const url = new URL(src);

    const picture = document.createElement('picture');
    // webp
    breakpoints.forEach((br) => {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('type', 'image/webp');
      source.setAttribute('srcset', `${url.toString()}?$danaher-mobile$&fmt=webp&wid=${br.width}`);
      picture.appendChild(source);
    });

    // fallback
    breakpoints.forEach((br, i) => {
      if (i < breakpoints.length - 1) {
        const source = document.createElement('source');
        if (br.media) source.setAttribute('media', br.media);
        source.setAttribute('srcset', `${url.toString()}?$danaher-mobile$&wid=${br.width}`);
        picture.appendChild(source);
      } else {
        const productImage = document.createElement('img');
        productImage.setAttribute('loading', eager ? 'eager' : 'lazy');
        productImage.setAttribute('alt', alt);
        picture.appendChild(productImage);
        productImage.setAttribute('src', `${url.toString()}?$danaher-mobile$&wid=${br.width}`);
      }
    });

    return picture;
  }

  async connectedCallback() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.shadow = this.attachShadow({ mode: 'closed' });

    try {
      const { resultContext } = await import(
        // eslint-disable-next-line import/no-unresolved
        'https://static.cloud.coveo.com/atomic/v2/index.esm.js'
      );
      this.result = await resultContext(this);
      this.render();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    const value = this.result.raw[this.field];
    const image = Array.isArray(value) ? value[0] : value;

    this.shadow.innerHTML = `
        <style>
          img {
              width: 100%;
              height: 100%;
              object-fit: contain;
          }
        </style>`;

    this.shadow.append(this.createOptimizedPicture(image, this.result.title));
  }
}

customElements.define('custom-image', CustomImage);
