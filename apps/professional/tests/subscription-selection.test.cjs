const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../src/features/admin/subscription/services/subscriptionSelection.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject });
const { buildSubscriptionSelection } = exportsObject;
const price = (id, interval = 'monthly') => ({ id, interval, is_active: true });
const base = { id: 'start', plan_key: 'start', is_license: false, prices: [price('base-m'), price('base-y', 'yearly')] };
const pro = { id: 'pro', plan_key: 'pro', is_license: true, prices: [price('pro-m'), price('pro-y', 'yearly')] };
const worker = { id: 'worker', plan_key: 'worker', is_license: true, prices: [price('worker-m'), price('worker-y', 'yearly')] };
const plans = [base, pro, worker];
const current = { stripe_subscription_id: 'sub-original', items: [
  { subscription_plan: base, subscription_plan_price: base.prices[0], stripe_subscription_item_quantity: 1 },
  { subscription_plan: pro, subscription_plan_price: pro.prices[0], stripe_subscription_item_quantity: 2 },
] };
const select = (mode, quantities = {}, interval = 'monthly') =>
  JSON.parse(JSON.stringify(buildSubscriptionSelection(current, plans, mode, 'start', interval, quantities)));

test('additional quantities preserve the base and existing licenses', () => {
  const result = select('licenses', { pro: 1, worker: 2 });
  assert.equal(result.subscription_id, 'sub-original');
  assert.deepEqual(result.items, [
    { subscription_plan_id: 'pro', subscription_plan_price_id: 'pro-m', quantity: 3 },
    { subscription_plan_id: 'worker', subscription_plan_price_id: 'worker-m', quantity: 2 },
    { subscription_plan_id: 'start', subscription_plan_price_id: 'base-m', quantity: 1 },
  ]);
});
test('license purchase cannot switch billing interval', () => {
  assert.equal(select('licenses', { worker: 1 }, 'yearly').items.at(-1).subscription_plan_price_id, 'base-m');
});
test('zero additions preserve existing quantities', () => {
  assert.equal(select('licenses', { pro: 0 }).items[0].quantity, 2);
});
test('subscription editor uses final quantities and permits a scheduled reduction', () => {
  assert.equal(select('subscription', { pro: 1 }).items[0].quantity, 1);
  assert.equal(select('subscription', { pro: 0 }).items.length, 1);
});
test('billing interval change keeps existing licenses at the matching new prices', () => {
  assert.deepEqual(select('subscription', {}, 'yearly').items.map(item => item.subscription_plan_price_id), ['pro-y', 'base-y']);
});
test('no changes preserves full selection', () => {
  assert.equal(select('subscription').items.length, 2);
  assert.equal(select('subscription').items[0].quantity, 2);
});
test('invalid quantities and missing prices fail closed', () => {
  for (const quantity of [-1, NaN, 1.5, 10001]) assert.throws(() => select('licenses', { pro: quantity }));
  assert.throws(() => select('subscription', {}, 'quarterly'));
  assert.throws(() => select('licenses', { pro: 10000 }));
});
