// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { loadGTM } from './gtm.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// google tag manager
//if (!window.location.hostname.includes('localhost') && !document.location.hostname.includes('.hlx.page')) {
  loadGTM();
//}
