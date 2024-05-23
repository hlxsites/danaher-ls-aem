/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-relative-packages */

// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';
import {
  pipe,
  fetchContent,
  toRuntime,
} from 'crosswalk-converter';
import transform from '../../../importer/import.js';
import converterCfg from '../../../../converter.yaml';
import mappingCfg from '../../../../paths.yaml';
import { createPipeline } from './utils.js';

function skipConverter(path) {
  // skip the converter for pages like /en/products/acrobat/topics1/acrobat-dc.html
  const regex = /\/[^/]+\/[^/]+\/products\/[^/]+\/topics1\/[^/]+/;
  return regex.test(path);
}

function domParser(html, url) {
  return new JSDOM(html, { url }).window.document;
}

function updateLink(link, attribute, origin, liveUrls) {
  const urlStr = link.getAttribute(attribute);
  if (urlStr) {
    if (urlStr.startsWith('#')) return;

    const url = urlStr.startsWith('/') ? new URL(urlStr, origin) : new URL(urlStr);
    if (url.pathname.indexOf('.') > 0 || url.pathname.endsWith('/')) return;

    if (url.hostname === origin.hostname
      || liveUrls.some((liveUrl) => url.hostname === liveUrl.hostname)) {
      link.setAttribute(attribute, `${urlStr}.html`);
      // replace also the text content if it equals the urlStr
      if (link.textContent === urlStr) {
        link.textContent = `${urlStr}.html`;
      }
    }
  }
}

async function appendDotHtmlStep(state) {
  // eslint-disable-next-line prefer-const
  let { blob, contentType, originUrl } = state;
  let { origin, liveUrls = [] } = converterCfg || {};
  if (!Array.isArray(liveUrls)) liveUrls = [liveUrls];
  if (!liveUrls.length) liveUrls.push(origin);
  origin = new URL(origin);
  liveUrls = liveUrls.filter((url) => !!url).map((url) => new URL(url));

  if (contentType === 'text/html') {
    const document = domParser(blob, originUrl);
    const links = document.querySelectorAll('[href]');
    links.forEach((link) => {
      updateLink(link, 'href', origin, liveUrls);
    });
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (metaOgUrl) {
      updateLink(metaOgUrl, 'content', origin, liveUrls);
    }
    blob = document.documentElement.outerHTML;

    // eslint-disable-next-line no-param-reassign
    state = {
      ...state, originUrl, blob, contentType, contentLength: blob.length,
    };
  }
  return state;
}

export async function main(params) {
  // eslint-disable-next-line no-underscore-dangle
  const path = params.__ow_path;
  const pipeline = skipConverter(path)
    ? pipe()
      .use(fetchContent)
      .use(appendDotHtmlStep)
    : createPipeline();
  return pipeline.wrap(toRuntime, { transform, converterCfg, mappingCfg }).apply(this, [params]);
}
