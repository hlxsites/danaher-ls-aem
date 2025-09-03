import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { baseURL } from '../../scripts/common-utils.js';
import { getApiData } from '../../scripts/api-utils.js';

export const orderDetails = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    // window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    Accept: 'application/vnd.intershop.order.v1+json',
  });
  const url = `${baseURL}orders?include=lineItems`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      const orderDetailResponse = response.data.data;
      return orderDetailResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
  }
};

export const requestedQuotes = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
  });
  const basketDataFromSession = JSON.parse(sessionStorage.getItem('basketData'));
  let userId;
  let customerNo;
  if (basketDataFromSession) {
    userId = basketDataFromSession.data.data.buyer.accountID;
    customerNo = basketDataFromSession.data.data.buyer.customerNo;
  } else {
    window.location.href = '/us/en/e-buy/login';
  }
  const url = `${baseURL}/customers/${customerNo}/users/${userId}/quoterequests?attrs=number,name,lineItems,creationDate,validFromDate,validToDate,rejected`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      if (response.data === 'Unauthorized! please try again.') {
        window.location.href = '/us/en/e-buy/login';
      }
      const quotesResponse = response.data.elements;
      return quotesResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
  }
};

export const userOrderDetails = async (orderId) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    // window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    Accept: 'application/vnd.intershop.order.v1+json',
  });
  const url = `${baseURL}orders/${orderId}?include=invoiceToAddress,commonShipToAddress,lineItems`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      const userOrderDetailResponse = response.data;
      return userOrderDetailResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
    // return { status: 'error', data: 'Something went wrong fetching order details.' };
  }
};

export const requestedQuotesDetails = async (quoteId) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    // Accept: 'application/vnd.intershop.order.v1+json',
  });
  const basketDataFromSession = JSON.parse(sessionStorage.getItem('basketData'));
  if (!basketDataFromSession) {
    window.location.href = '/us/en/e-buy/login';
  }
  const url = `${baseURL}/rfqcart/${quoteId}`;
  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      if (response.data === 'Unauthorized! please try again.') {
        window.location.href = '/us/en/e-buy/login';
      }
      const quotesResponse = response.data;
      return quotesResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
  }
};
