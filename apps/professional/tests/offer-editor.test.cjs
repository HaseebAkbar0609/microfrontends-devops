const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(response = {}) {
  const calls = [];
  const axios = Object.fromEntries(['get', 'post'].map(method => [method, async (...args) => {
    calls.push({ method, args });
    if (response instanceof Error) throw response;
    return { data: { data: response } };
  }]));
  const file = '../src/features/offer/services/offerFormService.ts';
  const compiled = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, FormData, require(name) {
    assert.equal(name, '@/lib/axiosInstance'); return { __esModule: true, default: axios };
  } });
  return { api: exports, calls };
}
const context = { quote: null, project: { id: 'project', project_name: 'Original', project_address: 'Address', project_type: 'b2c' } };
const plain = value => JSON.parse(JSON.stringify(value));

for (const variant of ['b2c', 'express', 'rent']) test(`${variant}: draft and send preserve all form fields and identity`, () => {
  const { api, calls } = load();
  const fields = { ...api.initialOfferFields(context, variant), total: '1000,50', hourly_rate: '500', start: '2026-09-18', end: '2026-09-19', specifications: 'Specs', work: 'Work', material: 'Material', personnel: '2 workers', payment_terms: '30 days', rot: true };
  const media = [{ media_id: 'file', type: 'required', file_url: 'not-sent', file_name: 'test.pdf' }];
  const draft = api.buildOfferPayload('project', fields, media, false);
  assert.equal(draft.total_quote_price, 1000.5);
  assert.equal(draft.send_quote, false);
  assert.equal(draft.offer_details.variant, variant);
  assert.equal(draft.offer_details.hourly_rate, variant === 'rent' ? 500 : null);
  assert.equal(draft.work_start_date, Date.parse('2026-09-18'));
  assert.equal(draft.payment_terms, '30 days');
  assert.equal(draft.is_tax_deducted, true);
  assert.deepEqual(plain(draft.media), [{ media_id: 'file', type: 'required' }]);
  assert.equal('company_id' in draft, false);
  assert.equal('status' in draft, false);
  const existing = { id: 'quote', type: 'overall', vat: 25, rot_discount: 30, items: [] };
  const send = api.buildOfferPayload('project', fields, media, true, existing);
  assert.equal(send.id, 'quote'); assert.equal(send.vat, 25); assert.equal(send.rot_discount, 30);
  assert.equal(send.send_quote, true);
  assert.equal(calls.length, 0, 'preview/payload construction never makes requests');
});
test('rehydrates saved snapshot without rewriting original customer project', () => {
  const { api } = load();
  const quote = { total_quote_price: 123, offer_details: { variant: 'rent', project_name: 'Edited offer', hourly_rate: 20 }, work_start_date: Date.parse('2026-09-18'), payment_terms: 'Terms' };
  const fields = api.initialOfferFields({ ...context, quote }, 'b2c');
  assert.equal(fields.variant, 'rent'); assert.equal(fields.project_name, 'Edited offer');
  assert.equal(fields.hourly_rate, '20'); assert.equal(fields.total, '123'); assert.equal(fields.start, '2026-09-18');
  assert.equal(context.project.project_name, 'Original');
});
test('invalid totals, dates and missing names stop before API', () => {
  const { api, calls } = load();
  const fields = { ...api.initialOfferFields(context, 'b2c'), total: '100' };
  for (const total of ['', '0', '-10', 'Infinity', 'NaN', '1e9', '1.999']) assert.throws(() => api.buildOfferPayload('project', { ...fields, total }, [], true));
  assert.ok(api.validateOffer({ ...fields, start: '2026-02-30' }).start);
  assert.ok(api.validateOffer({ ...fields, start: '2026-10-01', end: '2026-09-01' }).end);
  assert.ok(api.validateOffer({ ...fields, project_name: ' ' }).project_name);
  assert.ok(api.validateOffer({ ...fields, variant: 'rent', hourly_rate: '0' }).hourly_rate);
  assert.equal(calls.length, 0);
});
test('loads real project context and saves through quote management, no navigation-only success', async () => {
  const { api, calls } = load(context);
  assert.equal((await api.loadOfferContext('project')).project.id, 'project');
  assert.equal(calls[0].args[0], '/professionals/quotes/quote-management/details');
  assert.equal(calls[0].args[1].params.project_id, 'project');
  const saved = load({ id: 'quote', project_id: 'project', professional_status: 'offered' });
  await saved.api.saveOffer({ project_id: 'project', send_quote: true });
  assert.equal(saved.calls[0].args[0], '/professionals/quotes/quote-management/create');
});
test('wrong project context, ambiguous save and network failure do not report success', async () => {
  await assert.rejects(load(context).api.loadOfferContext('foreign'), /UNAVAILABLE/);
  await assert.rejects(load({}).api.saveOffer({ project_id: 'project' }), /UNCONFIRMED/);
  await assert.rejects(load({ id: 'quote', project_id: 'foreign' }).api.saveOffer({ project_id: 'project' }), /UNCONFIRMED/);
  await assert.rejects(load(new Error('offline')).api.saveOffer({ project_id: 'project' }), /offline/);
});
test('attachments validate size and extension before upload, never trust filename as ID', async () => {
  const { api, calls } = load({ id: 'server-file' });
  for (const file of [{ name: 'test.exe', size: 1 }, { name: 'test.pdf', size: 0 }, { name: 'test.pdf', size: 20 * 1024 * 1024 }]) await assert.rejects(api.uploadOfferFile(file), /INVALID_OFFER_FILE/);
  assert.equal(calls.length, 0);
  const file = new File(['test'], 'quote.pdf', { type: 'application/pdf' });
  assert.equal((await api.uploadOfferFile(file)).media_id, 'server-file');
  assert.equal(calls[0].args[0], '/media/upload');
});
