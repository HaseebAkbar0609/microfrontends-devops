const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const exportsObject = {};
vm.runInNewContext(ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/lib/billingReturnPath.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText, { exports: exportsObject, URL });
const { billingReturnPath } = exportsObject;

test('billing email preserves the existing commission identifier', () => {
  const target = '/module/business/offer/commissions?commission=664d0aee-032b-552f-9fd0-ecaf9da4aa62';
  assert.equal(billingReturnPath(target), target);
});

test('billing return strips secrets, arbitrary parameters and fragments', () => {
  assert.equal(billingReturnPath('/admin/subscription?tab=payment&client_secret=private#fragment'), '/admin/subscription?tab=payment');
  assert.equal(billingReturnPath('/module/business/offer/commissions?commission=invalid&returnTo=https://elsewhere.test'), '/module/business/offer/commissions');
});

test('billing return cannot become an external redirect or unrelated page', () => {
  for (const value of [null, '', '//elsewhere.test', '/\\elsewhere.test', 'https://elsewhere.test', 'javascript:alert(1)', '/home', '/admin/subscription/other']) {
    assert.equal(billingReturnPath(value), null, String(value));
  }
});
