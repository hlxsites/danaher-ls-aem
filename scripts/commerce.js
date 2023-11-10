// eslint-disable-next-line import/no-cycle
import { getCookie } from './scripts.js';

export function getCommerceBase() {
  return window.DanaherConfig !== undefined ? window.DanaherConfig.intershopDomain + window.DanaherConfig.intershopPath : 'https://shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-';
}

/**
 * Returns the user authorization used for commerce API calls
 */
export function getAuthorization() {
  const authHeader = new Headers();
  if (localStorage.getItem('authToken')) {
    authHeader.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
  } else if (getCookie('ProfileData')) {
    const { customer_token: apiToken } = getCookie('ProfileData');
    authHeader.append('authentication-token', apiToken);
  } else if (getCookie('apiToken')) {
    const apiToken = getCookie('apiToken');
    authHeader.append('authentication-token', apiToken);
  }
  return authHeader;
}

/**
   * Returns the user logged in state based cookie
   */
export function isLoggedInUser() {
  return getCookie('rationalized_id');
}
