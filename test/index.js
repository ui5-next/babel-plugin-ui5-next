const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { transformFileSync } = require("@babel/core")

const config = require("./babelrc")

function trim(str) {
  return str.replace(/[^\x00-\x7F]/g, "")
}

describe('Next-generation syntax for SAP UI5', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath, config).code;
      const expectedPath = path.join(fixtureDir, 'expected.js');
      if (fs.existsSync(expectedPath)) {
        const expected = fs.readFileSync(expectedPath).toString()
        expect(trim(actual)).toStrictEqual(trim(expected))
      } else {
        fs.writeFileSync(expectedPath, actual)
        assert.ok(true);
      }
    });
  });
});

describe('Next-generation typescript syntax for SAP UI5', () => {
  const fixturesDir = path.join(__dirname, 'ts-fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      let actualPath = path.join(fixtureDir, 'actual.tsx');
      if (!fs.existsSync(actualPath)) {
        actualPath = path.join(fixtureDir, 'actual.ts');
      }
      const actual = transformFileSync(actualPath, config).code;
      const expectedPath = path.join(fixtureDir, 'expected.js');
      if (fs.existsSync(expectedPath)) {
        const expected = fs.readFileSync(expectedPath).toString()
        expect(trim(actual)).toStrictEqual(trim(expected))
      } else {
        fs.writeFileSync(expectedPath, actual)
        assert.ok(true);
      }
    });
  });
});

