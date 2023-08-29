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
import { render } from './render';
import pathsCfg from '../../../../paths.yaml';
import transformerCfg from '../../../importer/import';

export async function cli(host, path, auth) {
    const fetchCfg = { authorization: auth };
    const { md, html, error } = await render(host, path, { fetchCfg, pathsCfg, transformerCfg });
    if (error) {
      console.log(error);
    } else {
      console.log(md.md.trim());
      console.log(html);
    }
  }
  