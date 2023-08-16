/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   main: () => (/* binding */ main)
/* harmony export */ });
/*import fetch from 'node-fetch';
import jsdom from 'jsdom';
import * as WebImporter from '@adobe/helix-importer';
import md2html from './modules/md2html.js';

import { default as transformCfg } from './import.js';

async function render(url) {

  const resp = await fetch(url);

    if (!resp.ok) {
        return { statusCode: resp.status, body: resp.statusText }
    }

    const text = await resp.text();

  const { document } = new jsdom.JSDOM(text, { url }).window;
  const md = await WebImporter.html2md(url, document, transformCfg);
  const html = md2html(md.md.trim());
  return { md, html };
}*/

function main(params) {
  //const path =  params['__ow_path'] ? params['__ow_path'].substring(1) : '';
  // const { html } = await render(`https://lifesciences.danaher.com/${path}`);
  return { statusCode: 200, body: `html: ${path}!` };
}

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;