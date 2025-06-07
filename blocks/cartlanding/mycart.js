import { div } from '../../scripts/dom-builder.js';
import cartItem from './cartItem.js';
import emptyCart from './emptyCart.js';
// import price from './price.js';
import { recommendedProducts } from './recommendedproducts.js';
import {
  getBasketDetails,
  checkoutSummary,
} from '../../scripts/cart-checkout-utils.js';

export const prodQuantity = (totalProductQuantity) => div(
  {
    class:
        'inline-flex justify-start text-black text-base font-bold  leading-snug gap-4',
    id: 'totalProduct-Quantity',
  },
  div(
    {
      class: 'justify-start text-black text-base font-normal  leading-snug ',
    },
    'Add to order template |',
  ),
  `${totalProductQuantity} Items`,
);

export const mycart = async () => {
  const basketDetail = await getBasketDetails();
  let totalProductQuantity;
  const basketData = JSON.parse(sessionStorage.getItem('basketData'));

  if (basketData) {
    totalProductQuantity = basketData.totalProductQuantity;
  }

  const myCartContainerWrapper = div({
    class: '',
    id: 'myCartContainerWrapper',
  });
  const myCartEmptyContainer = div({
    class: '',
    id: 'myCartEmptyContainer',
  });
  const myCartListContainer = div({
    class: 'flex w-full flex-col',
    id: 'myCartListContainer',
  });
  if (
    basketDetail.status === 'error'
    || basketDetail.data.totalProductQuantity === 0
  ) {
    if (myCartEmptyContainer.classList.contains('hidden')) {
      myCartEmptyContainer.classList.remove('hidden');
    } else {
      myCartListContainer.classList.add('hidden');
    }
  } else if (totalProductQuantity > 0) {
    if (myCartListContainer.classList.contains('hidden')) {
      myCartListContainer.classList.remove('hidden');
    } else {
      myCartEmptyContainer.classList.add('hidden');
    }
  }

  const emptyCartContainer = emptyCart();
  const containerWrapper = div({
    class: 'inline-flex justify-between gap-4',
  });
  const emptyDiv = div({
    class: 'h-[0px]',
  });
  containerWrapper.append(emptyCartContainer);
  myCartEmptyContainer.append(containerWrapper);
  myCartEmptyContainer.append(emptyDiv);
  myCartEmptyContainer.append(recommendedProducts());
  myCartContainerWrapper.append(myCartEmptyContainer);

  const container = div(
    {
      class: 'inline-flex items-start gap-4 max-w-[70%]',
    },
    div(
      {
        class:
          'w-[40rem] left-[60px] justify-start text-black text-4xl font-bold',
      },
      'My Cart',
    ),
    // prodQuantity(totalProductQuantity)
  );
  const cartWrapper = div({
    class: 'w-full inline-flex gap-[4rem]',
  });
  const containerListWrapper = div({
    class: 'inline-flex flex-col gap-2 max-w-[70%] justify-between',
    id: 'containerListWrapper',
  });
  const description = div(
    {
      class:
        'w-full break-normal justify-start text-black text-base font-extralight ',
    },
    'Welcome to your cart. Review your selections, make any last-minute adjustments, and prepare for a seamless checkout experience tailored just for you.',
  );
  myCartListContainer.append(container);
  myCartListContainer.append(
    div({
      class: 'h-[26px]',
    }),
  );
  containerListWrapper.append(description);
  // const priceContainer = await price();
  const priceContainer = await checkoutSummary();

  const cartItems = await cartItem();

  if (cartItems.hasChildNodes() === false) {
    myCartListContainer.classList.add('hidden');
    myCartEmptyContainer.classList.remove('hidden');
    containerListWrapper.append(cartItems);
  } else {
    myCartListContainer.classList.remove('hidden');
    myCartEmptyContainer.classList.add('hidden');
    containerListWrapper.append(cartItems);
  }
  cartWrapper.append(containerListWrapper);
  cartWrapper.append(priceContainer);
  myCartListContainer.append(cartWrapper);
  myCartListContainer.append(recommendedProducts());
  myCartContainerWrapper.append(myCartListContainer);
  return myCartContainerWrapper;
};
