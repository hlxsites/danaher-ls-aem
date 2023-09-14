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

import { CONTINUE, visit } from 'unist-util-visit';
import { mapOutbound } from '../mapping.js';

function rewriteUrl(content, url, tagName) {
  const { aemURL, publicURL } = content;

  if (!url || (!url.startsWith('/') && !url.startsWith(publicURL))) {
    return url;
  }

  let attr = url;
  if (url.startsWith(publicURL) && tagName === 'a') {
    attr = `${mapOutbound(url.substring(publicURL.length - 1))}.html`;
  }

  return tagName === 'img' ? `${aemURL}${attr.substring(1)}` : attr;
}

/**
 * Rewrites all A and IMG urls
 * @param {PipelineState} state
 */
export default async function rewriteUrls({ content }) {
  const { hast } = content;

  const els = {
    img: 'src',
    a: 'href',
  };

  visit(hast, (node) => {
    if (node.type !== 'element') {
      return CONTINUE;
    }
    const attr = els[node.tagName];
    if (attr) {
      node.properties[attr] = rewriteUrl(content, node.properties[attr], node.tagName);
    }
    return CONTINUE;
  });
}
