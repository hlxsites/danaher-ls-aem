import {
  div, h1, p, button, hr, img,
} from '../../scripts/dom-builder.js';

export default function emptyCart() {
  const container = div({
    class: 'inline-flex flex-col justify-center w-full',
  });

  // Browse button with event listener
  const browseButton = button(
    {
      class: 'btn btn-lg font-medium btn-primary-purple rounded-full px-6 m-0',
      id: 'browse-product',
    },
    'Browse Products',
  );
  browseButton.addEventListener('click', () => {
    window.location.href = 'https://stage.lifesciences.danaher.com/us/en/products.html';
  });

  // Cart Empty Message Section
  const cartMessage = div(
    {
      class: 'inline-flex flex-col justify-start items-center gap-4',
    },
    img(
      {
        class: '',
        src: '/icons/shopping-cart.png',
      },

    ),
    h1(
      {
        class:
          'w-full text-center justify-start text-gray-900 text-4xl font-normal  leading-[48px]',
      },
      'Your Cart is Empty',
    ),
    p(
      {
        class:
          'w-full text-center justify-start text-gray-900 text-xl font-normal  leading-7',
      },
      'Explore our top products or a wide range of options for your workflow solutions',
    ),
    div(
      {
        class: 'inline-flex justify-between gap-4',
      },
      browseButton,
    ),
    hr({
      class: 'w-full border-black-500',
    }),
  );

  // Append everything to the container
  container.appendChild(cartMessage);
  return container;
}
