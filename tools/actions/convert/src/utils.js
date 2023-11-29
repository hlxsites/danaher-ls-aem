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

import { visit } from 'unist-util-visit';
import {
  pipeline,
  transformMdast,
  DEFAULT_TRANSFORMERS,
} from 'crosswalk-converter';

function appendDotHtml({ converterCfg }) {
  let { origin, liveUrls = [] } = converterCfg || {};
  if (!Array.isArray(liveUrls)) liveUrls = [liveUrls];
  if (!liveUrls.length) liveUrls.push(origin);
  origin = new URL(origin);
  liveUrls = liveUrls.filter((url) => !!url).map((url) => new URL(url));

  return (tree) => {
    visit(tree, ['link'], (node) => {
      const { url: urlStr } = node;
      if (urlStr) {
        if (urlStr.startsWith('#')) return;

        const url = urlStr.startsWith('/') ? new URL(urlStr, origin) : new URL(urlStr);
        if (url.pathname.indexOf('.') > 0 || url.pathname.endsWith('/')) return;

        if (url.hostname === origin.hostname
          || liveUrls.some((liveUrl) => url.hostname === liveUrl.hostname)) {
          node.url = `${urlStr}.html`;
          // replace also the text content if it equals the urlStr
          const textNode = node.children[0];
          if (textNode && textNode.type === 'text' && textNode.value === urlStr) {
            textNode.value = node.url;
          }
        }
      }
    });
  };
}

export default function createPipeline() {
  return pipeline()
    .use(transformMdast, { transformers: [...DEFAULT_TRANSFORMERS, appendDotHtml] });
}
