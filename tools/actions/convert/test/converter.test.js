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
import { pipeline, toMocha } from 'crosswalk-converter';
import converterCfg from '../../../../converter.yaml';
import mappingCfg from '../../../../paths.yaml';
import transform from '../../../importer/import.js';

describe('Converter', async () => {
  // eslint-disable-next-line no-undef
  const fixturesFolder = path.resolve(__testdir, 'fixtures');
  const testRunner = pipeline().wrap(toMocha, {
    transform,
    converterCfg,
    mappingCfg,
    fixturesFolder,
  });

  await testRunner();
});


// async function test(spec) {
//   const html = await readFile(resolve(__testdir, 'fixtures', `${spec}.html`), 'utf-8');
//   nock('http://www.example.com')
//     .get(`/${spec}.html`)
//     .reply(200, html);
//   const expected = await readFile(resolve(__testdir, 'fixtures', `${spec}-semantic.html`), 'utf-8');
//   const actual = await render(`/${spec}.html`, {}, {
//     env: {
//       publicURL: 'https://stage.lifesciences.danaher.com/',
//       aemURL: 'http://www.example.com',
//     },
//   });
//   assert.strictEqual(actual.html.trim(), expected.replaceAll('\r\n', '\n').trim());
// }

// describe('Converter Tests', () => {
//   before(() => {
//     nock.disableNetConnect();
//   });

//   after(() => {
//     nock.enableNetConnect();
//   });

//   afterEach(() => {
//     nock.cleanAll();
//   });

//   it('convert the footer html', async () => {
//     await test('footer');
//   });
//   it('convert the header html', async () => {
//     const json = await readFile(resolve(__testdir, 'fixtures', 'megamenu_items_us.json'), 'utf-8');
//     nock('https://stage.lifesciences.danaher.com')
//       .get('/content/dam/danaher/system/navigation/megamenu_items_us.json')
//       .reply(200, json);
//     await test('header');
//   });
//   it('convert the en html', async () => {
//     await test('en');
//   });
//   it('convert the blog html', async () => {
//     await test('blog');
//     await test('blog2');
//     await test('blog3');
//     await test('blog4');
//     await test('blog5');
//     await test('blog6');
//   });
//   it('convert the news html', async () => {
//     await test('news');
//   });
//   it('convert the product html', async () => {
//     await test('product');
//   });
//   it('convert the blog hub html', async () => {
//     await test('blog-hub');
//   });
//   it('convert the product category html', async () => {
//     await test('product-category');
//     await test('product-category1');
//   });
//   it('convert the product topic html', async () => {
//     await test('product-topic');
//   });
//   it('convert the topic hub html', async () => {
//     await test('topic-hub');
//   });
//   it('convert the library hub html', async () => {
//     await test('library-hub');
//   });
//   it('convert the application html', async () => {
//     await test('application');
//   });
// });
