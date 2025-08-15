import {
  div, button, hr, a, span,
} from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';

export const price = async () => {
  let userLoggedInStatus = false;
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  if (authenticationToken.access_token) {
    userLoggedInStatus = true;
  } else {
    userLoggedInStatus = false;
  }

  const priceContainerWrapper = div({
    class: 'inline-flex flex-col',
  });
  const priceContainer = div(
    {
      class: 'inline-flex flex-col gap-4',
    },
    div(
      {
        class: 'inline-flex justify-between',
      },
      div(
        {
          class: 'text-black text-base font-bold ',
        },
        'Subtotal',
      ),
      div(
        {
          class: ' text-right text-black text-base font-bold ',
        },
        '$5,657.49',
      ),
    ),
    div(
      {
        class: 'inline-flex justify-between',
      },
      div(
        {
          class: 'text-black text-base',
        },
        'Discount',
      ),
      div(
        {
          class: ' text-right text-black text-base',
        },
        '$434.34',
      ),
    ),
    div(
      {
        class:
          'w-80 text-right justify-start text-gray-500 text-xs font-normal',
      },
      '10% off first order',
    ),
    div(
      {
        class: 'inline-flex justify-between',
      },
      div(
        {
          class: 'w-20 justify-start text-black text-base font-extralight',
        },
        'Sales Tax*',
      ),
      div(
        {
          class:
            "text-right justify-start text-indigo-300 text-sm font-normal font-['Inter'] underline leading-tight",
        },
        'Tax exempt?',
      ),
      div(
        { class: 'self-stretch p-3 flex justify-start items-center' },
        a(
          {
            href: 'item.url',
            class: 'dhlsLink text-base font-bold leading-snug',
          },
          'View Details',
          // span({
          //   class:
          //     'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
          // }),
        ),
      ),
      div(
        {
          class:
            'w-40 text-right justify-start text-black text-base font-extralight',
        },
        '$92.60',
      ),
    ),
    div(
      {
        class: 'inline-flex justify-between',
      },
      div(
        {
          class: 'text-black text-base',
        },
        'Shipping',
      ),
      div(
        {
          class: ' text-right text-black text-base',
        },
        '$32.80',
      ),
    ),
    div({
      class: 'border-black-300',
    }),
    div(
      {
        class: 'inline-flex justify-between',
      },
      div(
        {
          class:
            'w-40 justify-start text-black text-xl font-bold leading-relaxed',
        },
        'Total (3 items)',
      ),
      div(
        {
          class: 'w-40 text-right justify-start text-black text-xl font-bold',
        },
        '$5287.47',
      ),
    ),
  );

  // const pricingTotal = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "text-black text-base font-bold ",
  //     },
  //     "Subtotal"
  //   ),
  //   div(
  //     {
  //       class: " text-right text-black text-base font-bold ",
  //     },
  //     "$5,657.49"
  //   )

  // );
  // const discount = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "text-black text-base",
  //     },
  //     "Discount"
  //   ),
  //   div(
  //     {
  //       class: " text-right text-black text-base",
  //     },
  //     "$434.34"
  //   )
  // );
  // const percentOff = div(
  //   {
  //     class: "w-80 text-right justify-start text-gray-500 text-xs font-normal",
  //   },
  //   "10% off first order"
  // );
  // const sales = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "w-20 justify-start text-black text-base font-extralight",
  //     },
  //     "Sales Tax*"
  //   ),
  //   div(
  //     {
  //       class:
  //         "text-right justify-start text-indigo-300 text-sm font-normal font-['Inter'] underline leading-tight",
  //     },
  //     "Tax exempt?"
  //   ),
  //   div(
  //     {
  //       class:
  //         "w-40 text-right justify-start text-black text-base font-extralight",
  //     },
  //     "$92.60"
  //   )
  // );
  // const shipping = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "text-black text-base",
  //     },
  //     "Shipping"
  //   ),
  //   div(
  //     {
  //       class: " text-right text-black text-base",
  //     },
  //     "$32.80"
  //   )
  // );

  const divider = hr({
    class: 'w-80 border-black-300',
  });

  const total = div(
    {
      class: 'inline-flex justify-between',
    },
    div(
      {
        class:
          'w-40 justify-start text-black text-xl font-bold leading-relaxed',
      },
      'Total (3 items)',
    ),
    div(
      {
        class: 'w-40 text-right justify-start text-black text-xl font-bold',
      },
      '$5287.47',
    ),
  );

  const checkoutButton = button(
    {
      class: 'font-medium rounded-full px-6',
    },
    'Checkout',
  );
  checkoutButton.addEventListener('click', () => {
    window.location.href = 'https://stage.lifesciences.danaher.com/us/en/eds-stage-test/checkout.html?ref=em1-t112-checkout-summary';
  });

  const disclaimer = div(
    {
      class:
        "w-80 p-6 justify-start text-gray-500 text-xs font-normal  leading-none",
    },
    '*estimated sales tax. Additional tax may apply upon actual calculation of order',
  );

  const loggedOutUserDiv = div(
    {
      class: 'inline-flex flex-col gap-4',
    },
    div(
      {
        class:
          "w-80 justify-start text-black text-3xl font-bold  leading-10",
      },
      'Let’s get started',
    ),

    button(
      {
        class: 'h-12 rounded-full px-6 dhlsBtn',
      },
      'Login / Create Account',
    ),
    button(
      {
        class: 'dhlsBtn btn btn-outline-primary border-solid border-purple rounded-full px-6',
      },
      'Checkout as Guest',
    ),
    hr({
      class: 'border-black-300',
    }),
    div({
      class: '',
    }),

  );

  if (userLoggedInStatus) {
    priceContainerWrapper.append(priceContainer);
    priceContainerWrapper.append(checkoutButton);
  } else {
    priceContainerWrapper.append(loggedOutUserDiv);
    priceContainerWrapper.append(priceContainer);
  }
  priceContainerWrapper.append(disclaimer);
  return priceContainerWrapper;
};
