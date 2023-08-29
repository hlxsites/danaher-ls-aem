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

import assert from 'assert';
import { getMappedPath } from '../src/index.js';

describe('Index Tests', () => {
    describe('getMappedPath()', () => {
        [
            ['/index.html', '/content/danaher/ls/us/en.html'],
            ['/us/en/expert.html', '/content/danaher/ls/us/en/expert.html'],
            ['/fragments/footer/master.html', '/content/experience-fragments/danaher/us/en/site/footer/master.html'],
            ['/fragments/header/master.html', '/content/experience-fragments/danaher/us/en/site/header/master.html']
        ].forEach(([given, expected]) => {
            it(`returns ${expected} for ${given}`, () => {
                assert.equal(expected, getMappedPath(given));
            });
        });
    });
});