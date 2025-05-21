import {
  getAuthenticationToken,
  getApiData,
  postApiData,
  baseURL,
} from '../../scripts/common-utils.js';

// function to add item to basket
export const addItemToBasket = async (item) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const url = `${baseURL}/baskets/current/items?include=cross-sell`;
  const data = [
    {
      product: item.sku.value,
      calculated: true,
    },
  ];
  try {
    const response = await postApiData(
      url,
      JSON.stringify(data),
      defaultHeader,
    );
    if (response) {
      return response;
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const productData = async (product) => {
  const itemQuantity = product.quantity.value;
  const lineItemId = product.id;
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    // Accept: "application/vnd.intershop.basket.v1+json",
  });
  const url = `${baseURL}/products/${product.product}`;
  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      if (response.status === 'success') {
        const product = response.data;
        product.itemQuantity = itemQuantity;
        product.lineItemId = lineItemId;
        const productDetailsObject = sessionStorage.getItem(
          'productDetailObject',
        );
        const array = productDetailsObject
          ? JSON.parse(productDetailsObject)
          : [];

        const { manufacturer } = product;
        if (!manufacturer) {
          console.error('Product must have a manufacturer field.');
          return;
        }

        let found = false;

        // Search for the existing manufacturer key
        for (const obj of array) {
          if (obj.hasOwnProperty(manufacturer)) {
            obj[manufacturer].push(product);
            found = true;
            break;
          }
        }

        // If manufacturer not found, create new entry
        if (!found) {
          const newEntry = {};
          newEntry[manufacturer] = [product];
          array.push(newEntry);
        }

        // Update sessionStorage
        sessionStorage.setItem('productDetailObject', JSON.stringify(array));

        // console.log("Arraayayyy: ", array);
        return {
          data: product,
          status: 'success',
        };
      }
      return {
        data: response.data,
        status: 'error',
      };
    }
    return { status: 'error', data: response.data };
  } catch (error) {
    console.log('error', error);
  }
};

// function to get list of all items from basket //
export const getAllItemsFromBasket = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const url = `${baseURL}/baskets/current/items?include=discounts`;
  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      if (response.status === 'success') {
        return {
          data: response.data.data,
          status: 'success',
        };
      }
      return {
        data: response.data,
        status: 'error',
      };
    }
    return { status: 'error', data: response.data };
  } catch (error) {
    console.log('error', error);
  }
};

// function to get or create if not there -  product detail object from the session

export const getProductDetailObject = async () => {
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
};
