const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(response = {}) {
  const calls = [];
  const axios = Object.fromEntries(['get', 'post'].map(method => [method, async (...args) => {
    calls.push({ method, args: JSON.parse(JSON.stringify(args)) });
    if (response instanceof Error) throw response;
    return { data: { data: response } };
  }]));
  const source = fs.readFileSync(path.resolve(__dirname, '../src/features/offer/services/commissionService.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require(name) {
    assert.equal(name, '@/lib/axiosInstance');
    return { __esModule: true, default: axios };
  } });
  return { api: exports, calls };
}

test('accept uses business endpoint and never submits a client amount/payer/status', async () => {
  const { api, calls } = load({ mapping_id: 'map', commission: { id: 'commission' } });
  await api.acceptOffer('project', 'quote');
  assert.deepEqual(calls, [{ method: 'post', args: ['/professionals/quotes/quote-management/accept', { project_id: 'project', quote_id: 'quote' }] }]);
});
test('preview is separate from mutation and uses server amount', async () => {
  const { api, calls } = load({ amount: '595.00', currency: 'sek', already_recorded: false });
  const preview = await api.previewOfferAcceptance('project', 'quote');
  assert.equal(preview.amount, '595.00');
  assert.equal(calls[0].args[0], '/professionals/quotes/quote-management/accept/preview');
});
test('missing quote/project identifiers never reach API', async () => {
  const { api, calls } = load();
  await assert.rejects(api.acceptOffer('project', ''), /IDENTIFIER_MISSING/);
  await assert.rejects(api.previewOfferAcceptance('', 'quote'), /IDENTIFIER_MISSING/);
  assert.equal(calls.length, 0);
});
test('empty or ambiguous acceptance is not reported as success', async () => {
  await assert.rejects(load({}).api.acceptOffer('project', 'quote'), /UNCONFIRMED/);
  await assert.rejects(load(new Error('network timeout')).api.acceptOffer('project', 'quote'), /network timeout/);
});
test('commission list has an explicit company scope and no empty-company request', async () => {
  const { api, calls } = load({ items: [] });
  await api.listCommissions('company');
  assert.equal(calls[0].args[1].headers['X-Company-ID'], 'company');
  await assert.rejects(api.listCommissions(''), /COMPANY_REQUIRED/);
  assert.equal(calls.length, 1);
});
test('malformed commission list is an error, not an empty state', async () => {
  await assert.rejects(load({}).api.listCommissions('company'), /LIST_UNAVAILABLE/);
});
test('recovery references only existing ledger id, no new checkout or intent parameters', async () => {
  const { api, calls } = load({ commission: { id: 'ledger' }, client_secret: null });
  await api.recoverCommission('ledger');
  assert.deepEqual(calls[0], { method: 'post', args: ['/professionals/quotes/quote-management/commissions/ledger/recover'] });
});
test('restore uses explicit history-preserving endpoint, not offered status', async () => {
  const { api, calls } = load();
  await api.restoreOffer('map');
  assert.deepEqual(calls[0], { method: 'post', args: ['/professionals/quotes/quote-listing/offer/map/restore'] });
});
