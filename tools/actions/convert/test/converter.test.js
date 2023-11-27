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
import assert from 'assert';
import { mapInbound } from 'crosswalk-converter/src/utill/mapping.js';
import converterCfg from '../../../../converter.yaml';
import mappingCfg from '../../../../paths.yaml';
import transform from '../../../importer/import.js';
import createPipeline from '../src/utils.js';

// custom toMocha function to handle request for header test
const toMocha = (pipe, opts = {}) => {
  const {
    fixturesFolder = __dirname,
    indivdualTest = it,
    silent = true,
    ...rest
  } = opts;

  if (silent) {
    pipe.logger = { log: () => {} };
  }

  return async function (fixtures) {
    if (!fixtures) {
      const fileNames = fs.readdirSync(fixturesFolder);
      // eslint-disable-next-line no-param-reassign
      fixtures = fileNames.filter((fileName) => fileName.endsWith('.html') && !fileName.endsWith('-converted.html'));
    }
    fixtures.forEach((args) => {
      if (!Array.isArray(args)) {
        // eslint-disable-next-line no-param-reassign
        args = [args];
      }
      // eslint-disable-next-line prefer-const
      let [given, expected] = args;
      if (!expected) {
        const extensionPos = given.lastIndexOf('.');
        // eslint-disable-next-line no-param-reassign
        expected = `${given.substring(0, extensionPos)}-converted${given.substring(extensionPos)}`;
      }
      indivdualTest(`conversts ${given} to ${expected}`, async () => {
        const givenHtml = await fs.promises.readFile(path.resolve(fixturesFolder, given), { encoding: 'utf-8' });
        const expectedHtml = await fs.promises.readFile(path.resolve(fixturesFolder, expected), { encoding: 'utf-8' });
        const requestPath = `/${given}`;

        // needed for the header test once
        if (given === 'header.html') {
          const megamenu = fs.readFileSync(path.resolve(fixturesFolder, 'megamenu_items_us.json'), { encoding: 'utf-8' });
          nock(converterCfg.origin)
            .get('/content/dam/danaher/system/navigation/megamenu_items_us.json')
            .reply(200, megamenu, { 'content-type': 'application/json' });
        }
        nock(converterCfg.origin).get(mapInbound(requestPath, mappingCfg)).reply(200, givenHtml);

        const { error, html } = await pipe.run(
          { path: requestPath },
          {},
          { mappingCfg, converterCfg, ...rest },
        );

        assert(!error, 'no error expected');
        assert.equal(html, expectedHtml.trim());
      });
    });
  };
}

describe('Converter', async () => {
  // eslint-disable-next-line no-undef
  const fixturesFolder = path.resolve(__testdir, 'fixtures');
  const testRunner = createPipeline().wrap(toMocha, {
    transform,
    converterCfg,
    mappingCfg,
    fixturesFolder,
  });
  await testRunner();
});
