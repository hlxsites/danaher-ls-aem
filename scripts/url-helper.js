/**
 * Returns the valid public url with or without .html extension
 * @param {string} url
 * @returns new string with the formatted url
 */
export function makePublicUrl(url) {
    const isProd = window.location.hostname.includes('lifesciences.danaher.com');
    try {
      const newURL = new URL(url, window.location.origin);
      if (isProd) {
        if (newURL.pathname.endsWith('.html')) {
          return newURL.pathname;
        }
        newURL.pathname += '.html';
        return newURL.pathname;
      }
      if (newURL.pathname.endsWith('.html')) {
        newURL.pathname = newURL.pathname.slice(0, -5);
        return newURL.pathname;
      }
      return newURL.pathname;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Invalid URL:', error);
      return url;
    }
  }
  