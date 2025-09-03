import {
  div, img,
} from '../../scripts/dom-builder.js';

// eslint-disable-next-line import/prefer-default-export
export const orderItems = (response) => {
  const lineItemIds = response.data.lineItems;
  const includedLineItems = response.included.lineItems;

  const groupedByManufacturer = {};

  lineItemIds.forEach((lineItemId) => {
    const lineItem = includedLineItems[lineItemId];
    if (!lineItem) return;

    const { productData } = lineItem;
    const { manufacturer } = productData;

    const product = {
      lineItemId,
      displayName: lineItem.displayName,
      sku: productData.sku,
      quantity: lineItem.quantity.value,
      manufacturer,
    };

    if (!groupedByManufacturer[manufacturer]) {
      groupedByManufacturer[manufacturer] = [];
    }

    groupedByManufacturer[manufacturer].push(product);
  });

  const logoDiv = (itemToBeDisplayed) => {
    const logoDivInner = div(
      {
        class: 'self-stretch py-3 bg-gray-50 border-t border-b border-gray-300 inline-flex justify-start items-center gap-1',
      },
      div(
        {
          class: 'w-80 px-5 flex justify-start items-center gap-3',
        },
        div({
          class: 'justify-start text-black text-base font-bold leading-snug',
        }, itemToBeDisplayed[1][0].manufacturer),
      ),
      div({
        class: 'w-20 justify-start text-right text-black text-base font-bold leading-snug',
      }, 'QTY'),
      div({
        class: 'w-36 text-right justify-start text-black text-base font-bold leading-snug',
      }, 'Total'),
    );
    // logoDivContainer.append(logoDivInner);
    return logoDivInner;
  };

  const shippingDiv = () => {
    const shippingDivContainer = div(
      {
        class: 'self-stretch p-3 bg-violet-50 inline-flex justify-start items-start gap-3',
      },
      div({
        class: 'justify-start text-black text-sm font-normal leading-tight',
      }, 'Est Ship Date'),
      div({
        class: 'justify-start text-black text-base font-bold leading-snug',
      }, '01/01/2025'),

    );
    return shippingDivContainer;
  };
  const unitPriceDiv = (cartItemValue) => {
    // eslint-disable-next-line max-len
    if (cartItemValue.quantity.value * cartItemValue.productData.listPrice.value !== cartItemValue.quantity.value * cartItemValue.productData.salePrice.value) {
      return div(
        {
          class: 'w-52 inline-flex flex-col justify-start items-end',
        },
        div(
          {
            class:
              'self-stretch text-right justify-start text-gray-500 text-base font-extralight line-through leading-snug',
          },
          `$${cartItemValue.quantity.value * cartItemValue.productData.listPrice.value}`,
        ),
        div(
          {
            class:
              'self-stretch text-right justify-start text-black text-base font-bold leading-snug',
          },
          `$${cartItemValue.quantity.value * cartItemValue.productData.salePrice.value}`,
        ),
      );
    }

    return div(
      {
        class: 'w-[150px] justify-start text-black text-base font-semibold',
      },
      div(
        {
          class:
            'unit-price w-[150px] text-right justify-start text-black text-base',
        },
        `$${cartItemValue.quantity.value * cartItemValue.productData.salePrice.value}`,
      ),
    );
  };
  const cartItemDiv = (cartItemValue) => {
    const itemsscontainer = div(
      {
        class:
         'self-stretch pb-4 relative border-b border-gray-300 inline-flex justify-start items-center',
        id: cartItemValue.id,
      },
      div(
        {
          class: 'w-80 flex justify-start items-center gap-3.5 ',
        },
        div(
          {
            class: 'w-28 p-2 flex justify-start items-center gap-3 ',
          },
          div(
            {
              class: 'p-2.5 bg-white border border-solid border-gray-300 flex justify-start items-center gap-2.5',
            },
            img({
              class: 'w-16 self-stretch relative',
              src: cartItemValue.productData.images.length !== 0 ? cartItemValue.productData.images[0].effectiveUrl : 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble',
            }),
          ),
        ),
        div(
          {
            class: 'w-48 inline-flex flex-col justify-start items-start',
            // id: `product-Quantity-${opcoBe[0]}`,
          },
          div(
            {
              class: 'self-stretch justify-start text-black text-base font-bold leading-snug',
            },
            cartItemValue.productData.name,
          ),
          div(
            {
              class:
               'self-stretch justify-start text-gray-500 text-sm font-normal leading-tight ',
            },
            cartItemValue.productData.sku,
          ),

        ),
      ),
      div(
        {
          class: 'w-20 text-right justify-start text-black text-base font-bold leading-snug',
        },
        cartItemValue.quantity.value,
      ),
      unitPriceDiv(cartItemValue),
    );
    //  decorateIcons(itemsscontainer);
    return itemsscontainer;
  };

  const cartItemDisplayContainer = div({
    class: 'self-stretch bg-white flex flex-col justify-start items-start',

  });
  Object.entries(groupedByManufacturer).forEach((itemToBeDisplayed) => {
    const { lineItems } = response.included;
    const manufacturerName = itemToBeDisplayed[0];
    const lineItemsArray = Object.values(lineItems);
    const matchingLineItems = lineItemsArray.filter(
      (item) => item.productData.manufacturer === manufacturerName,
    );
    if (matchingLineItems.length > 0) {
      const cartItemDisplayWrapper = div({
        class: 'self-stretch flex flex-col justify-start items-start gap-3',
      });

      const logoDivDisplay = logoDiv(itemToBeDisplayed);
      cartItemDisplayWrapper.append(logoDivDisplay);
      const shippingDivDisplay = shippingDiv();
      cartItemDisplayWrapper.append(shippingDivDisplay);
      matchingLineItems.forEach((cartItem) => {
        cartItemDisplayWrapper.append(cartItemDiv(cartItem));
        cartItemDisplayContainer.append(cartItemDisplayWrapper);
      });
    }
  });
  return cartItemDisplayContainer;
};
