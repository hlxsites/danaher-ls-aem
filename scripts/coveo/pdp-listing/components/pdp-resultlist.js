export async function buildProductTile(result, getCommerceBase, domHelpers) {
  const {
    div, img, h3, p, a, span, input, button,
  } = domHelpers;
  let product = {};

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    // Add more if needed
  };

  if (result.raw?.sku) {
    try {
      const response = await fetch(`${getCommerceBase()}/products/${result.raw.sku}`);
      product = await response.json();
    } catch (err) {
      // Ignore fetch errors — product info not mandatory
    }
  }

  const hasPrice = () => product?.salePrice?.value > 0;

  const showAddToCart = () =>
    // const addToCartAttr = product?.attributes?.find(
    //   (attr) => attr.name === 'show_add_to_cart' && attr.value === true,
    // );
    /* eslint-disable-next-line */
    (hasPrice() && true ? true : '');
  const formatCurrency = (value, currency) => {
    const symbol = currencySymbols[currency] || currency || 'USD';
    return value
      ? `${symbol}${value.toFixed(2)}`
      : '';
  };

  const unitOfMeasure = product?.packingUnit || 'EA';
  const minOrderQuantity = product?.minOrderQuantity ?? 1;
  const availability = product?.availability ? 'Available' : 'Check Back Soon';

  const link = a(
    {
      href: result.clickUri,
      class: 'mt-auto text-danaherpurple-500 text-base font-bold flex items-center gap-1',
    },
    // placeholder text only, will be replaced by innerHTML below
    'View details',
  );

  // Now set the innerHTML to text + inline SVG
  link.innerHTML = `
    View details
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 5.37932C12.6834 4.98879 13.3166 4.98879 13.7071 5.37932L17.7071 9.37932C18.0976 9.76984 18.0976 10.403 17.7071 10.7935L13.7071 14.7935C13.3166 15.1841 12.6834 15.1841 12.2929 14.7935C11.9024 14.403 11.9024 13.7698 12.2929 13.3793L14.5858 11.0864H3C2.44772 11.0864 2 10.6387 2 10.0864C2 9.53414 2.44772 9.08643 3 9.08643H14.5858L12.2929 6.79353C11.9024 6.40301 11.9024 5.76984 12.2929 5.37932Z" fill="#7523FF"/>
    </svg>
  `;

  return div(
    { class: 'flex flex-row bg-white border outline-gray-300 gap-7' },

    // Image Section
    div(
      { class: 'flex-none flex justify-center p-6' },
      img({
        src: result.raw.images?.[0] || '',
        alt: result.title || '',
        class: 'w-[100px] h-[100px] object-contain border rounded bg-gray-50',
      }),
    ),

    // Product Details Section
    div(
      { class: 'flex-1 flex flex-col py-6 gap-3' },
      h3({ class: 'font-bold text-lg m-0 truncate' }, result.title || ''),
      p(
        { class: 'text-gray-700 truncate text-base font-extralight' },
        result.raw.richdescription || result.raw.description || '',
      ),
      link,
    ),

    // Pricing & Action Section
    div(
      { class: 'flex p-6 flex-col items-end gap-2 self-stretch  bg-gray-100 w-[331px]' },

      // Price
      h3(
        {
          class: hasPrice()
            ? 'text-black text-right text-xl font-normal leading-[32px] m-0'
            : 'text-xl font-bold text-gray-500 m-0',
        },
        hasPrice()
          ? formatCurrency(product.salePrice?.value, product.salePrice?.currencyMnemonic)
          : 'Request for Price',
      ),

      // Availability (Placeholder for Phase 2)
      div(
        { class: 'text-black text-base font-extralight text-gray-600 flex w-full flex-row justify-between items-start mt-2' },
        'Availability',
        span({ class: 'font-bold text-green-700 text-black text-right text-base font-extralight' }, availability),
      ),

      // Unit of Measure
      div(
        { class: 'text-black text-base font-extralight text-gray-600 flex w-full flex-row justify-between items-start' },
        'Unit of Measure',
        span({ class: 'font-bold text-black text-right text-base font-extraligh' }, unitOfMeasure),
      ),

      // Minimum Order Quantity
      div(
        { class: 'text-black text-base font-extralight text-gray-600 flex w-full flex-row justify-between items-start mb-2' },
        'Min. Order Qty',
        span({ class: 'font-bold text-black text-right text-base font-extraligh' }, `${minOrderQuantity}`),
      ),

      // Buttons
      div(
        { class: 'flex gap-3' },
        input({
          type: 'number',
          min: 1,
          value: '1',
          class: 'border rounded w-14 text-center text-sm',
        }),
        showAddToCart()
          && button(
            {
              class:
                'px-8 py-2 border border-danaherpurple-500 rounded-full text-sm bg-danaherpurple-500 text-white text-base font-normal leading-[22px]',
            },
            'Buy',
          ),
        button(
          {
            class:
              'px-8 py-2 border border-danaherpurple-500 text-danaherpurple-500 text-base font-normal bg-white rounded-full text-sm hover:bg-purple-500',
          },
          'Quote',
        ),
      ),
    ),
  );
}

export async function renderResults({
  results, getCommerceBase, domHelpers, resultsGrid,
}) {
  const { div } = domHelpers;
  resultsGrid.innerHTML = '';

  if (!results.length) {
    resultsGrid.append(
      div({ class: 'text-center text-gray-400 py-11' }, 'No products found'),
    );
    return;
  }

  const tiles = await Promise.all(
    results.map((r) => buildProductTile(r, getCommerceBase, domHelpers)),
  );

  const frag = document.createDocumentFragment();
  tiles.forEach((tile) => frag.append(tile));

  resultsGrid.innerHTML = '';
  resultsGrid.append(frag);
}
