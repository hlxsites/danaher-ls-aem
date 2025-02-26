/* eslint-disable */
import { loadScript } from '../../scripts/lib-franklin.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

export default async function decorate(block) {
  !(function () { window.semaphore = window.semaphore || [], window.ketch = function () { window.semaphore.push(arguments); }; const e = document.createElement('script'); e.type = 'text/javascript', e.src = 'https://global.ketchcdn.com/web/v3/config/danaher/danaher_test/boot.js', e.defer = e.async = !0, document.getElementsByTagName('head')[0].appendChild(e); }());
}
