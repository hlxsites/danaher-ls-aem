/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable class-methods-use-this */

// helix-importer-ui <-> node compatibility:
import {
  xfTransformers, xfAsyncTransformers, transformers, postTransformers,
} from './transformers/index.js';

export default {
  /**
   * Apply DOM pre processing
   * @param {HTMLDocument} document The document
   */
  preprocess: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    const {head} = document;
  },

  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: async ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    transformers.forEach(
      (fn) => fn.call(this, main, document, params, url),
    );

    // we only create the footer and header if not included via XF on a page
    const xf = main.querySelector('div.experiencefragment');
    if (!xf) {
      xfTransformers.forEach(
        (fn) => fn.call(this, main, document, params, url),
      );
      await Promise.all(xfAsyncTransformers.map((fn) => fn(main, document, params, url)));
    }

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer',
      'component',
      'div.social',
      'div.cloudservice.testandtarget',
    ]);

    // create the metadata block and append it to the main element
    postTransformers.forEach(
      (fn) => fn.call(this, main, document, params, url),
    );
    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
