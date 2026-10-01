const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const withdrawal = {};
const compiled = ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/features/material-storage/utils/materialWithdrawal.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
vm.runInNewContext(compiled, { exports: withdrawal });

test('an order or project charges the customer only when the invoice line box is ticked', () => {
  for (const linkType of ['order', 'project']) {
    assert.equal(withdrawal.isChargedToCustomer(linkType, true), true, linkType);
    assert.equal(withdrawal.isChargedToCustomer(linkType, false), false, linkType);
  }
});

test('an invoice always charges the customer and internal use never does', () => {
  assert.equal(withdrawal.isChargedToCustomer('invoice', false), true);
  assert.equal(withdrawal.isChargedToCustomer('internal', true), false);
});

test('material value is at sales price, or at purchase price for internal use', () => {
  // The Figma example: 40 st Gipsskiva at Utpris 129 kr.
  assert.equal(withdrawal.withdrawalValue('project', 40, 129, 85), 5160);
  assert.equal(withdrawal.withdrawalValue('invoice', 2.5, 54.9, 32.5), 137.25);
  assert.equal(withdrawal.withdrawalValue('internal', 40, 129, 85), 3400);
});

test('material value waits for a quantity and a price', () => {
  assert.equal(withdrawal.withdrawalValue('project', null, 129, 85), null);
  assert.equal(withdrawal.withdrawalValue('order', 40, null, 85), null);
  assert.equal(withdrawal.withdrawalValue('internal', 40, null, null), null);
});

test('only projects have work steps, and internal use links to nothing', () => {
  const rules = withdrawal.WITHDRAWAL_LINK_RULES;
  assert.deepEqual(
    ['order', 'project', 'invoice', 'internal'].filter((type) => rules[type].hasWorkStep),
    ['project'],
  );
  assert.equal(rules.internal.hasTarget, false);
  assert.equal(rules.internal.hasSalesPrice, false);
});
