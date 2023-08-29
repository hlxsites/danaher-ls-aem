import assert from 'assert';
import unit from '../src/index.js';

describe('Index Tests', () => {
  
    describe('getMappedPath()', () => {

        const cfg = {
            mapping: [
                '/content/site/us/en:/',
                '/content/site/us/en/:/us/en/'
            ]
        }

        it('returns /content/site/us/en.html for /index.html', () => {
            assert.equal('/content/site/us/en.html', unit.getMappedPath('/index.html', cfg));
        })

    });

});