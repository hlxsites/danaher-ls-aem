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

function rewriteUrl(content, url) {
  const { host } = content;
  if (!url || !url.startsWith('/')) {
    return url;
  }

  return `${host}${url.substring(1)}`;
}

/**
 * Rewrites all A and IMG urls
 * @param {PipelineState} state
 */
export default async function rewriteUrls({content}) {
  const { hast } = content;

  const els = {
    img: 'src',
  };

  visit(hast, (node) => {
    if (node.type !== 'element') {
      return CONTINUE;
    }
    const attr = els[node.tagName];
    if (attr) {
      node.properties[attr] = rewriteUrl(content, node.properties[attr]);
    }
    return CONTINUE;
  });
}