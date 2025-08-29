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
    <img src="/icons/arrow-narrow-right.svg" alt="arrow icon" width="20" height="21" />
  `;

  return div(
    { class: 'flex flex-row bg-white border outline-gray-300 gap-7 flex-wrap' },

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
      h3({ class: 'font-bold text-lg m-0' }, result.title || ''),
      p(
        { class: 'text-gray-700 text-base font-extralight' },
        result.raw.description || '',
      ),
      link,
    ),

    // Pricing & Action Section
    div(
      { class: 'flex p-6 flex-col items-end gap-2 self-stretch  bg-gray-100 md:w-[331px] w-full' },

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
