import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Next-generation syntax for SAP UI5', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath).code;
      const expectedPath = path.join(fixtureDir, 'expected.js');
      if (fs.existsSync(expectedPath)) {
        const expected = fs.readFileSync(expectedPath).toString()
        assert.equal(trim(actual), trim(expected));
      } else {
        fs.writeFileSync(expectedPath, actual)
        assert.ok(true);
      }
    });
  });
});
