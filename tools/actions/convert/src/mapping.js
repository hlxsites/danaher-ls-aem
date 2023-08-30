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
/* eslint-disable import/no-relative-packages */
/* eslint-disable no-param-reassign */

import pathsCfg from '../../../../paths.yaml';

export function mapOutbound(path, cfg = pathsCfg) {
  if (cfg.mappings) {
    // remove .html extension, if any;
    if (path.endsWith('.html')) {
      path = path.substring(0, path.length - 5);
    }
    const reversedMappings = cfg.mappings.reverse();
    for (let i = 0; i < reversedMappings.length; i += 1) {
      const mapping = reversedMappings[i];
      const [from, to] = mapping.split(':', 2);
      if (path.startsWith(from)) {
        // mapping from folder or single page?
        if (from.endsWith('/')) {
          // folder, e.g. /content/site/us/en/:/us/en/
          // mapping to folder
          if (to.endsWith('/')) {
            // special handling for the /index pages
            if (path.endsWith('/index')) {
              return to;
            }
            return to + path.substring(from.length);
          }
          // else, ignore folder => single page as this is not reversible
        } else {
          // single page
          // mapping to folder or single page, exact match only
          // eslint-disable-next-line no-lonely-if
          if (path === from) {
            return to;
          }
        }
      }
    }
  }
  return path;
}

export function mapInbound(path, cfg = pathsCfg) {
  if (cfg.mappings) {
    let extension = '';
    // remove .html extension;
    if (path.endsWith('.html')) {
      extension = '.html';
      path = path.substring(0, path.length - extension.length);
    }
    const reversedMappings = cfg.mappings.reverse();
    for (let i = 0; i < reversedMappings.length; i += 1) {
      const mapping = reversedMappings[i];
      const [from, to] = mapping.split(':', 2);
      if (path.startsWith(to)) {
        // mapping from folder or single page?
        if (from.endsWith('/')) {
          // folder, e.g. /content/site/us/en/:/us/en/
          // mapping to folder
          if (to.endsWith('/')) {
            return from + path.substring(to.length) + extension;
          }
          // else, ignore folder => single page as this is not reversible
        } else {
          // single page
          // mapping to a folder aka. /index, e.g. /content/site/us/en:/
          // mapping to a single page, aka. exect match, /content/site/us/en/page:/vanity
          // eslint-disable-next-line no-lonely-if
          if ((to.endsWith('/') && path.endsWith('/index')) || to === path) {
            return from + extension;
          }
        }
      }
    }
    // restore extension
    path += extension;
  }
  return path;
}
