// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// google tag manager
function loadGTM() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
      // googleTagManager
      (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
              'gtm.start':
                  new Date().getTime(), event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', 'GTM-KCBGM2N');
      `;
  document.head.prepend(scriptTag);
}

if (
  !window.location.hostname.includes('localhost') 
  && !document.location.hostname.includes('.hlx.page')
) {
  loadGTM();
}
