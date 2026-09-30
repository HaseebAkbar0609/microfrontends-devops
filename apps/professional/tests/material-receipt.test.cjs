const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const receipt = {};
const compiled = ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/features/material-storage/utils/materialReceipt.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
vm.runInNewContext(compiled, { exports: receipt });

// Spread / Array.from rebuild values in this realm, so strict deepEqual does not trip over the vm context's prototypes.
const plain = (entries) => Array.from(entries, (entry) => ({ ...entry }));

test('decimal input accepts Swedish and English notation and spaces', () => {
  assert.equal(receipt.parseDecimalInput('82,50'), 82.5);
  assert.equal(receipt.parseDecimalInput('82.50'), 82.5);
  assert.equal(receipt.parseDecimalInput(' 1 150 '), 1150);
  assert.equal(receipt.parseDecimalInput('1 150,5'), 1150.5);
  assert.equal(receipt.parseDecimalInput('0'), 0);
});

test('decimal input rejects negatives, text and half-typed numbers', () => {
  for (const value of ['', '-5', 'abc', '12kr', '1,2,3', '5.', ',5']) {
    assert.equal(receipt.parseDecimalInput(value), null, value);
  }
});

test('a receipt adds to the depot that already carries the article', () => {
  const entries = [
    { articleId: 'a', depotId: 'hq', inStock: 320, reserved: 40 },
    { articleId: 'a', depotId: 'van', inStock: 5, reserved: 0 },
  ];
  assert.deepEqual(plain(receipt.applyReceipt(entries, 'a', 'hq', 120)), [
    { articleId: 'a', depotId: 'hq', inStock: 440, reserved: 40 },
    { articleId: 'a', depotId: 'van', inStock: 5, reserved: 0 },
  ]);
  assert.equal(entries[0].inStock, 320, 'the input is not changed');
});

test('a receipt into a depot without the article adds it there', () => {
  const next = receipt.applyReceipt([{ articleId: 'a', depotId: 'hq', inStock: 1, reserved: 0 }], 'a', 'van', 0.3);
  assert.deepEqual(plain(next)[1], { articleId: 'a', depotId: 'van', inStock: 0.3, reserved: 0 });
});

test('decimal quantities do not drift', () => {
  const next = receipt.applyReceipt([{ articleId: 'a', depotId: 'hq', inStock: 0.1, reserved: 0 }], 'a', 'hq', 0.2);
  assert.equal(next[0].inStock, 0.3);
});

test('transaction references are padded per year', () => {
  assert.equal(receipt.formatTransactionReference('INL', 2026, 7), 'INL-2026-0007');
  assert.equal(receipt.formatTransactionReference('INL', 2026, 12345), 'INL-2026-12345');
});
