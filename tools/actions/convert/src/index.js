import fetch from 'node-fetch';
import jsdom from 'jsdom';
import * as WebImporter from '@adobe/helix-importer';
import md2html from './modules/md2html.js';
import { default as transformCfg } from './import.js';
import mapping from './mapping.yaml'

export function getFetchOptions(params) {
  const fetchopts = {
    headers: {
      'cache-control': 'no-cache',
    }
  };

  const headers = params['__ow_headers'];
  if (headers.authorization) {
    fetchopts.headers['Authorization'] = headers.authorization;
  } else {
    fetchopts.headers['Authorization'] = 'Basic ' + Buffer.from(params.AEM_USER + ":" + params.AEM_PASSWORD).toString('base64');
  }

  if (params.wcmmode) {
    fetchopts.wcmmode = params.wcmmode;
  }
  return fetchopts;
}

async function render(urlPath, fopts) {
  const { host } = mapping
  const url = fopts.wcmmode ? `${host}${urlPath}?` + new URLSearchParams({
    wcmmode: fopts.wcmmode
  }):`${host}${urlPath}`;
  const resp = await fetch(url, fopts);

  if (!resp.ok) {
      return { statusCode: resp.status, body: resp.statusText }
  }

  const text = await resp.text();
  const { document } = new jsdom.JSDOM(text, { url }).window;
  const md = await WebImporter.html2md(url, document, transformCfg);
  const html = md2html(md, host);
  return { md, html };
}

export async function main(params) {
  const path =  params['__ow_path'] ? params['__ow_path'].substring(1) : '';
  const fopts = getFetchOptions(params);
  const { html } = await render(path, fopts);
  return { statusCode: 200, body: html };
}

export async function cli(path, auth, wcmmode) {
  path =  path ? path : '';
  const params = {
    __ow_headers : {
      authorization: auth
    },
    'wcmmode': wcmmode
  }
  const fopts = getFetchOptions(params);
  const { md, html } = await render(path, fopts);
  console.log(html);
}
