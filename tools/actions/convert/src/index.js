import fetch from 'node-fetch';
import jsdom from 'jsdom';
import * as WebImporter from '@adobe/helix-importer';
import md2html from './modules/md2html.js';

import { default as transformCfg } from './import.js';


async function render(base, url) {

  const resp = await fetch(url);

    if (!resp.ok) {
        return { statusCode: resp.status, body: resp.statusText }
    }

    const text = await resp.text();

  const { document } = new jsdom.JSDOM(text, { url }).window;
  const mdText = await WebImporter.html2md(url, document, transformCfg);
  console.log(mdText.md.trim());
  const out = md2html(mdText.md.trim());
  console.log(out);
}

render("/", "https://lifesciences.danaher.com/");
