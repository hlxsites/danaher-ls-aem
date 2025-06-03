import { getAuthenticationToken, updateBasketDetails, baseURL } from '../../scripts/common-utils.js';
import { deleteApiData, patchApiData } from '../../scripts/api-utils.js';

// function to get or create if not there -  product detail object from the session

export async function getProductDetailObject() {
  const productDetailsObject = sessionStorage.getItem('productDetailObject');

  if (productDetailsObject) {
    return {
      data: JSON.parse(productDetailsObject),
      status: 'success',
    };
  }
  sessionStorage.setItem('productDetailObject', JSON.stringify([]));
  return {
    data: JSON.parse(sessionStorage.getItem('productDetailObject')),
    status: 'success',
  };
}

export const sessionObject = async (
  type,
  quantity,
  lineItemId,
  manufacturer,
) => {
  const getProductDetailsObject = await getProductDetailObject();
  if (getProductDetailsObject) {
    const foundObject = getProductDetailsObject.data.find((obj) => {
      if (obj.prototype.hasOwnProperty.call(obj, manufacturer)) {
        return true;
      }
      return false;
      // return resObj;
    });

    if (foundObject) {
      const result = foundObject[manufacturer].find(
        (obj) => obj.lineItemId === lineItemId,
      );
      if (result) {
        if (type === 'delete-item') {
          const index = foundObject[manufacturer].indexOf(result);
          foundObject[manufacturer].splice(index, 1);
          if (foundObject[manufacturer].length === 0) {
            const manufacturerIndex = getProductDetailsObject.data.indexOf(foundObject);
            getProductDetailsObject.data.splice(manufacturerIndex, 1);
            sessionStorage.removeItem('productDetailObject');
            sessionStorage.setItem(
              'productDetailObject',
              JSON.stringify(getProductDetailsObject.data),
            );
            return 'success';
          }
          const manufacturerIndex = getProductDetailsObject.data.indexOf(foundObject);
          getProductDetailsObject.data[manufacturerIndex][manufacturer] = foundObject[manufacturer];
          sessionStorage.removeItem('productDetailObject');
          sessionStorage.setItem(
            'productDetailObject',
            JSON.stringify(getProductDetailsObject.data),
          );
          return 'success';
        }
        result.itemQuantity = quantity;
        const index = foundObject[manufacturer].indexOf(result);
        foundObject[manufacturer][index] = result;
        const manufacturerIndex = getProductDetailsObject.data.indexOf(foundObject);
        getProductDetailsObject.data[manufacturerIndex][manufacturer] = foundObject[manufacturer];
        sessionStorage.removeItem('productDetailObject');
        sessionStorage.setItem(
          'productDetailObject',
          JSON.stringify(getProductDetailsObject.data),
        );
        return 'success';
      }

      return 'error';
    }
    return "No object with the key' was found";
  }
  return 'no product details found';
};

export const updateProductQuantityValue = async (
  type,
  quantity,
  lineItemId,
  manufacturer,
) => {
  if (type === 'delete-item') {
    const quantityElement = document.getElementById(lineItemId);
    const opco = manufacturer.split(' ')[0];
    const response = await sessionObject(
      type,
      quantity,
      lineItemId,
      manufacturer,
    );
    if (response) {
      quantityElement.remove();
      const manufacturerElement = document.getElementById(manufacturer);
      const manufacturerDiv = document.getElementById(opco);
      if (manufacturerElement.children.length === 1) {
        manufacturerDiv.remove();
        manufacturerElement.remove();
      }
    }
    return response;
  }

  const response = await sessionObject(
    type,
    quantity,
    lineItemId,
    manufacturer,
  );
  return response;
};

export const updateCartQuantity = (newQuantity) => {
  const cartItems = document.querySelectorAll('#cartItemContainer');
  if (cartItems) {
    const myCartListContainer = document.getElementById('myCartListContainer');
    const myCartEmptyContainer = document.getElementById(
      'myCartEmptyContainer',
    );
    if (newQuantity === 0) {
      if (myCartListContainer) myCartListContainer.classList.add('hidden');
      if (myCartEmptyContainer) myCartEmptyContainer.classList.remove('hidden');
    } else {
      if (myCartListContainer) myCartListContainer.classList.remove('hidden');
      if (myCartEmptyContainer) myCartEmptyContainer.classList.add('hidden');
    }
  }
  return { status: 'success' };
};

export const updateCartItemQuantity = async (item) => {
  let totalProductQuantity;
  if (item.type === 'delete-item') {
    const authenticationToken = await getAuthenticationToken();
    if (!authenticationToken) {
      return { status: 'error', data: 'Unauthorized access.' };
    }
    const defaultHeader = new Headers({
      'Content-Type': 'Application/json',
      'Authentication-Token': authenticationToken.access_token,
      Accept: 'application/vnd.intershop.basket.v1+json',
    });
    const url = `${baseURL}/baskets/current/items/${item.lineItemId}`;
    try {
      const response = await deleteApiData(url, defaultHeader);
      if (response && response.status === 'success') {
        const basketDetails = await updateBasketDetails();
        // if basket exists add product and update the cart
        if (basketDetails) {
          totalProductQuantity = basketDetails.data.totalProductQuantity;
          if (totalProductQuantity === 0) {
            const qunatityUpdate = await updateProductQuantityValue(
              item.type,
              0,
              item.lineItemId,
              item.manufacturer,
            );
            if (qunatityUpdate) {
              const cartQuantityResponse = await updateCartQuantity(
                totalProductQuantity,
              );
              if (cartQuantityResponse) {
                return qunatityUpdate;
              }
              return 'error in cart quantity';
            }
            return 'error in cart quantity update';
          }
          const qunatityUpdate = await updateProductQuantityValue(
            item.type,
            0,
            item.lineItemId,
            item.manufacturer,
          );
          if (qunatityUpdate) {
            const cartQuantityResponse = await updateCartQuantity(
              totalProductQuantity,
            );
            if (cartQuantityResponse) return qunatityUpdate;
            return 'error in cart quantity';
          }
          return 'error in cart quantity update';
        }
        return 'basket details not fetched.';
      }
      return { status: 'error', data: response.data };
    } catch (error) {
      // console.log('error', error);
      return 'error';
    }
  } else {
    const authenticationToken = await getAuthenticationToken();
    if (!authenticationToken) {
      return { status: 'error', data: 'Unauthorized access.' };
    }
    const defaultHeader = new Headers({
      'Content-Type': 'Application/json',
      'Authentication-Token': authenticationToken.access_token,
      Accept: 'application/vnd.intershop.basket.v1+json',
    });
    const url = `${baseURL}/baskets/current/items/${item.lineItemId}`;

    try {
      const data = {
        quantity: {
          value: Number(item.value),
          unit: '',
        },
      };
      const response = await patchApiData(
        url,
        JSON.stringify(data),
        defaultHeader,
      );
      if (response && response.status === 'success') {
        const prodQuantity = response.data.data.quantity.value;
        const basketDetails = await updateBasketDetails();
        // if basket exists add product and update the cart
        if (basketDetails) {
          totalProductQuantity = basketDetails.data.totalProductQuantity;

          const qunatityUpdate = await updateProductQuantityValue(
            item.type,
            prodQuantity,
            item.lineItemId,
            item.manufacturer,
          );
          if (qunatityUpdate) {
            const cartQuantityResponse = await updateCartQuantity(
              totalProductQuantity,
            );
            if (cartQuantityResponse) return qunatityUpdate;
            return 'error in cart quantity';
          }
          return 'error in cart quantity update';
        }
        return 'basket details not fetched.';
      }
      return { status: 'error', data: response.data };
    } catch (error) {
      // console.log('error', error);
      return 'error';
    }
  }
};
