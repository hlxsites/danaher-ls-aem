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

import path from 'path';
import nock from 'nock';
import fs from 'fs';
import { toMocha } from 'crosswalk-converter';
import converterCfg from '../../../../converter.yaml';
import mappingCfg from '../../../../paths.yaml';
import transform from '../../../importer/import.js';
import createPipeline from '../src/utils.js';

describe('Converter', async () => {
  // eslint-disable-next-line no-undef
  const fixturesFolder = path.resolve(__testdir, 'fixtures');

  // use dummy author host to make test independent
  converterCfg.origin = 'https://author-dummy.adobeaemcloud.com';

  const testRunner = createPipeline().wrap(toMocha, {
    transform,
    converterCfg,
    mappingCfg,
    fixturesFolder,
  });

  before(() => {
    const megamenu = fs.readFileSync(path.resolve(fixturesFolder, 'megamenu_items_us.json'), { encoding: 'utf-8' });
    nock(converterCfg.origin)
      .get('/content/dam/danaher/system/navigation/megamenu_items_us.json')
      .reply(200, megamenu, { 'content-type': 'application/json' });
  });

  await testRunner();
});
