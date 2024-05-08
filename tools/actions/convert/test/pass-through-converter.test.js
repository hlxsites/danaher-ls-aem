import assert from 'assert';
import fs from 'fs';
import path from 'path';
import nock from 'nock';
import { main } from '../src/index.js';
import converterCfg from '../../../../converter.yaml';

describe('Pass through Converter', () => {
  // eslint-disable-next-line no-undef
  const fixturesFolder = path.resolve(__testdir, 'fixtures');

  // use dummy author host to make test independent
  converterCfg.origin = 'https://author-dummy.adobeaemcloud.com';
  const inputHtml = fs.readFileSync(path.resolve(fixturesFolder, 'blog.html'), { encoding: 'utf-8' });
  const convertedHtml = fs.readFileSync(path.resolve(fixturesFolder, 'blog-converted.html'), { encoding: 'utf-8' });

  it('should not convert the page', (done) => {
    const requestPath = '/ls/us/en/products/centrifuges/topics/microcentrifuge-benefits';
    const outputHtml = inputHtml;
    const params = {
      __ow_path: requestPath,
    };

    nock(converterCfg.origin)
      .get(`${requestPath}.html?wcmmode=disabled`)
      .reply(200, inputHtml, { 'content-type': 'text/html' });

    main(params).then((result) => {
      assert.equal(result.body, outputHtml, 'result is not as expected');
      done();
    });
  });

  it('should convert the page', (done) => {
    const requestPath = '/ls/us/en/products/centrifuges';
    const outputHtml = convertedHtml;
    const params = {
      __ow_path: requestPath,
    };

    nock(converterCfg.origin)
      .get(`${requestPath}.html?wcmmode=disabled`)
      .reply(200, inputHtml, { 'content-type': 'text/html' });

    main(params).then((result) => {
      assert.equal(result.body.trim(), outputHtml.replaceAll('\r\n', '\n').trim(), 'result is not as expected');
      done();
    });
  });
});
