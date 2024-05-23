import assert from 'assert';
import fs from 'fs';
import path from 'path';
import nock from 'nock';
import { main } from '../src/index.js';
import converterCfg from '../../../../converter.yaml';

describe('Pass through Converter', () => {
  // eslint-disable-next-line no-undef
  const passThroughFolder = path.resolve(__testdir, 'pass-through');
  converterCfg.origin = 'https://author-dummy.adobeaemcloud.com';
  const inputHtml = fs.readFileSync(path.resolve(passThroughFolder, 'simple.html'), { encoding: 'utf-8' });
  const convertedHtml = fs.readFileSync(path.resolve(passThroughFolder, 'simple-converted.html'), { encoding: 'utf-8' });
  const passThroughHtml = fs.readFileSync(path.resolve(passThroughFolder, 'simple-pass-through.html'), { encoding: 'utf-8' });

  async function runTest(requestPath, outputHtml) {
    const params = {
      __ow_path: requestPath,
    };

    nock(converterCfg.origin)
      .get(`${requestPath}.html?wcmmode=disabled`)
      .reply(200, inputHtml, { 'content-type': 'text/html' });

    const result = await main(params);
    assert.equal(result.body.trim(), outputHtml.replaceAll('\r\n', '\n').trim(), 'result is not as expected');
  }

  it('should pass through the page', async () => {
    await runTest('/ls/us/en/products/centrifuges/topics1/microcentrifuge-benefits', passThroughHtml);
  });

  it('should convert the page', async () => {
    await runTest('/ls/us/en/products/centrifuges', convertedHtml);
  });
});
