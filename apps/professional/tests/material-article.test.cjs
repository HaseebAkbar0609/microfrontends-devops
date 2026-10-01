const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const events = {};
const compiled = ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/features/material-storage/utils/materialStockEvents.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
vm.runInNewContext(compiled, { exports: events });

const base = { status: 'completed', unit: 'pcs', articleId: 'a', createdBy: 'Anna', depotId: 'hq' };
const receipt = { ...base, id: 'r', reference: 'INL-2026-0001', type: 'receipt', createdAt: '2026-08-22T09:00:00Z', quantity: 120, supplierOrderNo: 'LEV-45821' };
const withdrawal = { ...base, id: 'w', reference: 'UTT-2026-0001', type: 'withdrawal', createdAt: '2026-08-21T09:00:00Z', quantity: 40, linkType: 'project', linkId: 'p1' };
const adjustment = { ...base, id: 'j', reference: 'JUS-2026-0001', type: 'adjustment', createdAt: '2026-08-19T09:00:00Z', quantity: -2, reason: 'Inventering' };
const draft = { ...receipt, id: 'd', status: 'draft', createdAt: '2026-08-23T09:00:00Z' };

const list = () =>
  events.toStockEvents([adjustment, draft, receipt, withdrawal], { hq: 'Huvudlager' }, { p1: 'PRJ-2026-0147' });

test('history is newest first and leaves drafts out', () => {
  assert.deepEqual(Array.from(list(), (event) => event.id), ['r', 'w', 'j']);
});

test('receipts add, withdrawals take and adjustments keep their sign', () => {
  assert.deepEqual(Array.from(list(), (event) => event.quantityChange), [120, -40, -2]);
});

test('each event carries the detail its type has', () => {
  const [inbound, outbound, counted] = list();
  assert.equal(inbound.supplierOrderNo, 'LEV-45821');
  assert.equal(inbound.linkReference, null);
  assert.equal(outbound.linkReference, 'PRJ-2026-0147');
  assert.equal(outbound.linkType, 'project');
  assert.equal(outbound.depotName, 'Huvudlager');
  assert.equal(counted.reason, 'Inventering');
  assert.equal(counted.supplierOrderNo, null);
});

test('markup and gross margin match the Figma example', () => {
  // Inköpspris 85, Utpris 129: Påslag 51,8 %, Bruttomarginal 34,1 %.
  assert.equal(Math.round(events.markupPercent(85, 129) * 10) / 10, 51.8);
  assert.equal(Math.round(events.grossMarginPercent(85, 129) * 10) / 10, 34.1);
});

test('markup and margin are left out when there is nothing to divide by', () => {
  assert.equal(events.markupPercent(0, 129), null);
  assert.equal(events.grossMarginPercent(85, 0), null);
});
