import {
  div
} from '../../scripts/dom-builder.js';
export const orderSummary = (userOrderDetailsResponse) => {
      const date = new Date(userOrderDetailsResponse.data.creationDate);
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
    
      const formattedDate = `${month}/${day}/${year}`;
      
    const formattedAmount = (orderTotal) => {
        const amount = parseFloat(orderTotal).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return amount;
      };
    
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
              `$${formattedAmount(userOrderDetailsResponse.data.totals.grandTotal.gross.value)}`,
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
    return orderSummary;
}