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
/* eslint-env mocha */

import assert from 'assert';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import nock from 'nock';
import { render } from '../src/index.js';

async function test(spec, scope) {
  const html = await readFile(resolve(__testdir, 'fixtures', `${spec}.html`), 'utf-8');
  scope
    .get(`/${spec}.html`)
    .reply(200, html);
  const expected = await readFile(resolve(__testdir, 'fixtures', `${spec}-semantic.html`), 'utf-8');
  const actual = await render('http://www.example.com', `/${spec}.html`, {
    PUBLIC_DOMAIN: 'http://stage.lifesciences.danaher.com/',
    AEM_AUTHOR: 'https://author-p93411-e849602.adobeaemcloud.com/',
  });
  assert.strictEqual(actual.html.trim(), expected.trim());
}

describe('Converter Tests', () => {
  let scope;
  beforeEach(() => {
    scope = nock('http://www.example.com');
  });

  it('convert the footer html', async () => {
    test('footer', scope);
  });
  it('convert the header html', async () => {
    test('header');
  });
  it('convert the en html', async () => {
    test('en');
  });
});
