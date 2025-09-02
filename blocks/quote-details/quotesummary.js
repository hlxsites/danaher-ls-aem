import {
  div
} from '../../scripts/dom-builder.js';
export const  quoteSummary = (requestedQuotesDetailsResponse) => {
      const date = new Date(requestedQuotesDetailsResponse.creationDate);
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
    
      const formattedDate = `${month}/${day}/${year}`;
      const formattedWords = "Pending"
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const statusColor = (orderStatus) => {
      if (orderStatus === 'Approved') {
        return {
          text: 'px-2.5 py-2 self-stretch text-center justify-start text-green-700 bg-green-50 text-medium font-[400] leading-tight',
        };
      } if (orderStatus === 'Pending') {
        return {
          text: 'px-2.5 py-2 self-stretch text-center justify-start text-red-800 bg-red-100 text-medium font-[400] leading-tight',
        };
      } if (orderStatus === 'Shipped') {
        return {
          text: 'px-2.5 py-2 self-stretch text-center justify-start text-sky-800 bg-sky-50 text-medium font-[400] leading-tight',
        };
      } if (orderStatus === 'Invoiced') {
        return {
          text: 'px-2.5 py-2 self-stretch text-center justify-start text-gray-800 bg-gray-100 text-medium font-[400] leading-tight',
        };
      }
      return {
        text: 'px-2.5 py-2 self-stretch text-center justify-start text-green-700 bg-green-50 text-medium font-[400] leading-tight',
      };
    };
    const statusTextColor = statusColor("Pending");
      const  quoteSummary = div(
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
              `Request # - ${requestedQuotesDetailsResponse.number}`,
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
             
            ),
            div(
              {
                class:
                'px-2.5 py-2 inline-flex justify-center items-center',
              },
              div(
                {
                  class: statusTextColor.text,
                },
                formattedWords,
              ),
            ),
          ),
        ),
      );
    return  quoteSummary;
}