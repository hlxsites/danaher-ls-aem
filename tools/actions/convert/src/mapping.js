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

import pathsCfg from '../../../../paths.yaml';


export function mapOutbound(path, cfg = pathsCfg) {
  if (cfg.mappings) {
    // remove .html extension, if any;
    if (path.endsWith('.html')) {
      path = path.substring(0, path.length - 5);
    }
    for (const mapping of cfg.mappings.reverse()) {
      const [from, to] = mapping.split(':', 2);
      if (path.startsWith(from)) {
        // mapping from folder or single page?
        if (from.endsWith('/')) {
          // folder, e.g. /content/site/us/en/:/us/en/
          // mapping to folder
          if (to.endsWith('/')) {
            return to + path.substring(from.length);
          }
          // else, ignore folder => single page as this is not reversible
        } else {
          // single page
          // mapping to folder or single page, exact match only
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
    for (const mapping of cfg.mappings.reverse()) {
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
          if ((to.endsWith('/') && path.endsWith('/index')) || to === path) {
            return from + extension;
          }
        }
      }
    }
    // restore extension 
    path = path + extension;
  }
  return path;
}