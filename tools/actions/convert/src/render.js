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

import fetch from 'node-fetch';
import jsdom from 'jsdom';
import * as WebImporter from '@adobe/helix-importer';
import md2html from './modules/md2html.js';

export function getMappedPath(path, cfg) {
  if (cfg.mappings) {
    const mappings = cfg.mappings
      .map((entry) => entry.split(":", 2))
      .reduce((table, [left, right]) => ({ ...table, [right]: left }), {});
    const preparedPath = path.replace('/index.html', '/.html');
    const mappedPath = Object.keys(mappings).reverse().find((mapping) => preparedPath.startsWith(mapping));
    if (mappedPath) {
      path = mappings[mappedPath] + preparedPath.substring(mappedPath.length);
    }
  }
  return path;
}

export async function render(host, path, ctx) {
  const { fetchCfg, transformCfg, pathsCfg } = ctx;
  const url = new URL(getMappedPath(path, pathsCfg), host);
  if (fetchCfg.wcmmode) {
    url.searchParams.set('wcmmode', fetchCfg.wcmmode);
  }
  const resp = await fetch(url, {
    headers: {
      authorization: fetchCfg.authorization,
      'cache-control': 'no-cache',
    }
  });

  if (!resp.ok) {
    return { error: { code: resp.status, message: resp.statusText } }
  }

  const text = await resp.text();
  const { document } = new jsdom.JSDOM(text, { url }).window;
  const md = await WebImporter.html2md(url, document, transformCfg);
  const html = md2html(md, host);
  return { md, html };
}
