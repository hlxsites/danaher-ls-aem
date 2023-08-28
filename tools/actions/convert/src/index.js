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
import { default as transformCfg } from '../../../importer/import.js';
import mapCfg from './mapping.yaml';

function getFetchOptions(params) {
  const fetchopts = {
    headers: {
      'cache-control': 'no-cache',
    }
  };

  const headers = params['__ow_headers'];
  if (headers.authorization) {
    fetchopts.headers['Authorization'] = headers.authorization;
  }

  if (params.wcmmode) {
    fetchopts.wcmmode = params.wcmmode;
  }
  return fetchopts;
}

function toHash(mapping) {
  return mapping.reduce((table, item) => {
    const mappingItem = item.split(":");
    table[mappingItem[1].substring(1)] = mappingItem[0].substring(1);
    return table;
  }, {});
}

async function render(host, path, fopts) {
  if (mapCfg.mappings) {
    const mapping = toHash(mapCfg.mappings);
    if(mapping[path]) {
      path = mapping[path];
    }
  }
  const url = fopts.wcmmode ? `${host}${path}?` + new URLSearchParams({
    wcmmode: fopts.wcmmode
  }): `${host}${path}`;
  const resp = await fetch(url, fopts);

  if (!resp.ok) {
      return { error: { code: resp.status, message: resp.statusText } }
  }

  const text = await resp.text();
  const { document } = new jsdom.JSDOM(text, { url }).window;
  const md = await WebImporter.html2md(url, document, transformCfg);
  const html = md2html(md, host);
  return { md, html };
}

export async function main(params) {
  const host = params.AEM_AUTHOR;
  const path = params['__ow_path'] ? params['__ow_path'].substring(1) : '';
  const fopts = getFetchOptions(params);
  const { html, error } = await render(host, path, fopts);
  if (error) {
    return { statusCode: error.code, body: error.message };
  } else {
    return { statusCode: 200, body: html };
  }
}

export async function cli(host, path, auth) {
  path =  path ? path : '';
  const params = {
    __ow_headers : {
      authorization: auth
    },
    'wcmmode': 'disabled'
  }
  const fopts = getFetchOptions(params);
  const { md, html, error } = await render(host, path, fopts);
  if (error) {
    console.log(error);
  } else {
    console.log(md.md.trim());
    console.log(html);
  }
}
