import { div, span, a, img } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import { userOrderDetails } from '../dashboard/dashboardutils.js';

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const orderId = new URLSearchParams(window.location.search).get('orderId');
  console.log('orderId', typeof orderId);
  const userOrderDetailsResponse = await userOrderDetails(orderId);
  console.log("userOrderDetailsResponse", userOrderDetailsResponse);
  console.log("manufacturer", userOrderDetailsResponse.data.lineItems[0]);
  // Assuming `response` is the full JSON object you provided
const response = userOrderDetailsResponse;

const lineItemIds = response.data.lineItems;
const includedLineItems = response.included.lineItems;

const groupedByManufacturer = {};

lineItemIds.forEach(lineItemId => {
    const lineItem = includedLineItems[lineItemId];
    if (!lineItem) return;

    const productData = lineItem.productData;
    const manufacturer = productData.manufacturer;

    const product = {
        lineItemId: lineItemId,
        displayName: lineItem.displayName,
        sku: productData.sku,
        quantity: lineItem.quantity.value,
        manufacturer: manufacturer
    };

    if (!groupedByManufacturer[manufacturer]) {
        groupedByManufacturer[manufacturer] = [];
    }

    groupedByManufacturer[manufacturer].push(product);
});

console.log(groupedByManufacturer);
const logoDiv = (itemToBeDisplayed) => {
  console.log("itemsss", itemToBeDisplayed[1])
  // const logoDivContainer = div({
  //   class: ""
  // });
  const logoDivInner = div({
    class:"self-stretch py-3 bg-gray-50 border-t border-b border-gray-300 inline-flex justify-start items-center gap-1"
  },
  div({
    class:"w-80 px-5 flex justify-start items-center gap-3"
  },
  div({
    class:"justify-start text-black text-base font-bold leading-snug"
  }, itemToBeDisplayed[1][0].manufacturer)
),
div({
    class:"w-20 justify-start text-right text-black text-base font-bold leading-snug"
  }, "QTY"),
  div({
    class:"w-36 text-right justify-start text-black text-base font-bold leading-snug"
  }, "Total")
);
// logoDivContainer.append(logoDivInner);
return logoDivInner;
}

const shippingDiv = () => {
  const shippingDivContainer = div({
    class: "self-stretch p-3 bg-violet-50 inline-flex justify-start items-start gap-3"
  },
  div({
    class: "justify-start text-black text-sm font-normal leading-tight"
  }, "Est Ship Date"),
  div({
    class: "justify-start text-black text-base font-bold leading-snug"
  }, "01/01/2025")

  );
  return shippingDivContainer;
}
const unitPriceDiv = (cartItemValue) => {
    if (cartItemValue.productData.listPrice.value !== cartItemValue.productData.salePrice.value) {
      return div(
        {
          class: 'w-52 inline-flex flex-col justify-start items-end',
        },
        div(
          {
            class:
              'self-stretch text-right justify-start text-gray-500 text-base font-extralight line-through leading-snug',
          },
          `$${cartItemValue.productData.listPrice.value}`,
        ),
        div(
          {
            class:
              'self-stretch text-right justify-start text-black text-base font-bold leading-snug',
          },
          `$${cartItemValue.productData.salePrice.value}`,
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
        `$${cartItemValue.productData.salePrice.value}`,
      ),
    );
  };
const cartItemDiv = (cartItemValue) => {
  console.log("cartItemValue", cartItemValue)
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
       cartItemValue.quantity.value
     ),
     unitPriceDiv(cartItemValue),
   );
  //  decorateIcons(itemsscontainer);
   return itemsscontainer;
}

const cartItemDisplayContainer = div({
    class: 'self-stretch bg-white flex flex-col justify-start items-start',
    
  });
Object.entries(groupedByManufacturer).forEach((itemToBeDisplayed)=>{
  console.log("itemToBeDisplayed", itemToBeDisplayed)
  const lineItems = userOrderDetailsResponse.included.lineItems;
  const manufacturerName = itemToBeDisplayed[0];
  const lineItemsArray = Object.values(lineItems);
  const matchingLineItems = lineItemsArray.filter(item => item.productData.manufacturer === manufacturerName);
  console.log("matchingLineItems", matchingLineItems);
  if (matchingLineItems.length > 0) {
     let cartItemDisplayWrapper = div({
        class: 'self-stretch flex flex-col justify-start items-start gap-3'
      });
    
    const logoDivDisplay = logoDiv(itemToBeDisplayed);
    cartItemDisplayWrapper.append(logoDivDisplay);
    const shippingDivDisplay = shippingDiv();
    cartItemDisplayWrapper.append(shippingDivDisplay);
    matchingLineItems.forEach((cartItem)=>{
     
    cartItemDisplayWrapper.append(cartItemDiv(cartItem));
    cartItemDisplayContainer.append(cartItemDisplayWrapper);
    })
    
  }

  
});

  const date = new Date(userOrderDetailsResponse.data.creationDate);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;
    // const formattedAmount = parseFloat(orderTotal).toLocaleString('en-US', {
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // });
  const orderDetailsWrapper = div({
    class: 'w-[70%] inline-flex flex-col justify-start items-start gap-5 ',
  });
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
          'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const goBackToOrderStatusLink = a(
    {
      class: 'inline-flex justify-start items-start gap-2',
      href: '/us/en/e-buy/orderstatus',
    },
    div(
      {
        class:
              'w-[24px] h-[24px] relative overflow-hidden cursor-pointer',
      },
      span({
        class:
              'icon icon-arrow-left cursor-pointer pointer-events-none w-[24px] h-[24px] fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
    div({
      class: 'justify-start text-violet-600 text-base font-bold leading-snug',
    }, 'Go Back to Order Status'),
  );

  const orderDetailTitleDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    div({
      class: 'self-stretch justify-start text-black font-bold font-normal text-[32px] leading-10',
    }, 'Order Details'),
    div({
      class: 'self-stretch justify-start text-black text-base font-extralight leading-snug',
    }, 'Your order details, all in one place—from items to shipping and everything in between.'),
  );
  const orderDetailsContainer = div({
    class: 'w-full inline-flex gap-5',
  });
  const orderDetail = div({
    class: 'w-[70%] p-6 bg-white border-t border-l border-r border-b border-gray-300 inline-flex flex-col justify-start items-center gap-6',
  });
  const addressDetail = div({
    class: 'w-[30%] border-t border-l border-r border-b border-gray-300 p-5 bg-white inline-flex flex-col justify-start items-start gap-6',
  }, 'Address');

   const formattedAmount = (orderTotal) => {
    const amount = parseFloat(orderTotal).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return amount;
   }
    
  const orderSummary = div(
    {
      class:
      'self-stretch p-6 bg-violet-50 inline-flex flex-col justify-center items-start gap-5 overflow-hidden',
    },
    div(
      {
        class: 'self-stretch inline-flex justify-start items-start gap-2',
      },
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-start gap-2',
        },
        div(
          {
            class:
            'self-stretch justify-start text-black text-2xl font-normal leading-loose',
          },
          `Order # - ${userOrderDetailsResponse.data.documentNumber}`,
        ),
        div(
          {
            class:
            'self-stretch justify-start text-black text-base font-extralight leading-snug',
          },
          `Ordered on ${formattedDate} 10:00 am`,
        ),
      ),
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-center items-end gap-2',
        },
        div(
          {
            class:
            'self-stretch text-right justify-start text-black text-2xl font-normal leading-loose',
          },
          `$${formattedAmount(userOrderDetailsResponse.data.totals.grandTotal.gross.value)}`
        ),
        div(
          {
            class:
            'px-2.5 py-2 bg-green-50 inline-flex justify-center items-center',
          },
          div(
            {
              class:
              "text-center justify-start text-green-700 text-xs font-medium font-['Inter'] leading-none",
            },
            'Approved',
          ),
        ),
      ),
    ),
  );

  const orderItemTitle = div({
    class: "self-stretch inline-flex justify-start items-start gap-5"
  },
  div({
    class: "justify-start font-bold text-black text-xl font-normal leading-7"
  }, "Order Items")
);
  orderDetail.append(orderSummary);
  orderDetail.append(orderItemTitle);
  orderDetail.append(cartItemDisplayContainer);
  orderDetailsContainer.append(orderDetail);
  orderDetailsContainer.append(addressDetail);
  orderDetailsWrapper.append(goBackToOrderStatusLink);
  orderDetailsWrapper.append(orderDetailTitleDiv);
  orderDetailsWrapper.append(orderDetailsContainer);
  // orderDetailsWrapper.append(orderItemTitle);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, orderDetailsWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}
