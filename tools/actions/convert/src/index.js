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

export function main(params) {
  //const path =  params['__ow_path'] ? params['__ow_path'].substring(1) : '';
  // const { html } = await render(`https://lifesciences.danaher.com/${path}`);
  return { statusCode: 200, body: `html: ${path}!` };
}
