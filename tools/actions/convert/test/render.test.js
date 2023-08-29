import assert from 'assert';
import { getMappedPath } from '../src/render.js';

describe('Render Tests', () => {
    describe('getMappedPath()', () => {
        [
            ['/index.html', '/content/site/us/en.html'],
            ['/us/en/expert.html', '/content/site/us/en/expert.html'],
            ['/fragments/footer/master.html', '/content/experience-fragments/danaher/us/en/site/footer/master.html'],
            ['/fragments/header/master.html', '/content/experience-fragments/danaher/us/en/site/header/master.html']
        ].forEach(([given, expected]) => {
            it(`returns ${expected} for ${given}`, () => {
                assert.equal(expected, getMappedPath(given, {
                    mappings: [
                        '/content/site/us/en:/',
                        '/content/site/us/en/:/us/en/',
                        '/content/experience-fragments/danaher/us/en/site/:/fragments/',
                    ]
                }));
            });
        });
    });
});
