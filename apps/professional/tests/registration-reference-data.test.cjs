const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(pages) {
  const calls = [];
  const toasts = [];
  const axios = { get: async (...args) => {
    calls.push(JSON.parse(JSON.stringify(args)));
    const response = pages[calls.length - 1];
    if (response instanceof Error) throw response;
    assert.ok(response, 'Unexpected lookup request');
    return { data: response };
  } };
  const source = fs.readFileSync(path.resolve(__dirname, '../src/api-actions/common/common.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require(name) {
    if (name === '@/lib/axiosInstance') return { __esModule: true, default: axios };
    if (name === '@/lib/toast') return { showToast: (...args) => toasts.push(args) };
    if (name === '@/constants/api') return {
      API_PATH: { LOCATION: { COUNTRIES: '/location/countries' }, TEAMS: { PROFESSIONAL_CATEGORIES_LIST: '/teams/professionals/categories/list' } },
      getErrorMessageByCode: code => code,
    };
    throw new Error(`Unexpected import: ${name}`);
  } });
  return { api: exports, calls, toasts };
}

const country = (id, name = id) => ({ id, name, code: id });

test('loads every country page so Sweden is not omitted after the first page', async () => {
  const { api, calls } = load([
    { data: [country('AU'), country('DE')], total_pages: 2 },
    { data: [country('SE', 'Sweden')], total_pages: 2 },
  ]);
  const result = await api.getCountriesAction();
  assert.equal(result.success, true);
  assert.deepEqual(Array.from(result.data, item => item.id), ['AU', 'DE', 'SE']);
  assert.deepEqual(calls.map(call => call[1].params), [{ page: 1, page_size: 100 }, { page: 2, page_size: 100 }]);
});

test('an empty seeded-data response remains empty and never creates fake IDs', async () => {
  const { api, calls } = load([{ data: [], total_pages: 0 }]);
  const result = await api.getCountriesAction();
  assert.equal(result.success, true);
  assert.equal(result.data.length, 0);
  assert.equal(calls.length, 1);
});

test('deduplicates country IDs across page boundaries', async () => {
  const { api } = load([
    { data: [country('AU')], total_pages: 2 },
    { data: [country('AU'), country('SE')], total_pages: 2 },
  ]);
  assert.equal((await api.getCountriesAction()).data.length, 2);
});

test('a later page failure is an error rather than a silently truncated success', async () => {
  const { api, toasts } = load([{ data: [country('AU')], total_pages: 2 }, new Error('network')]);
  const result = await api.getCountriesAction();
  assert.equal(result.success, false);
  assert.equal(result.data, null);
  assert.equal(toasts.length, 1);
});

test('bounds malformed pagination instead of making unbounded requests', async () => {
  for (const total_pages of [-1, 1.5, 100000]) {
    const { api, calls } = load([{ data: [country('AU')], total_pages }]);
    assert.equal((await api.getCountriesAction()).success, false);
    assert.equal(calls.length, 1);
  }
});

test('does not return an incomplete success for empty intermediate pages', async () => {
  const { api } = load([{ data: [country('AU')], total_pages: 2 }, { data: [], total_pages: 2 }]);
  assert.equal((await api.getCountriesAction()).success, false);
});

test('supports a non-paginated country envelope', async () => {
  const { api } = load([{ data: [country('SE')] }]);
  assert.equal((await api.getCountriesAction()).data[0].id, 'SE');
});

test('supports an empty non-paginated envelope', async () => {
  const { api } = load([{ data: [] }]);
  const result = await api.getCountriesAction();
  assert.equal(result.success, true);
  assert.equal(result.data.length, 0);
});

test('category requests use the backend page_size parameter and preserve pagination', async () => {
  const { api, calls } = load([{ data: [{ id: 'electrical', name: 'Electrical' }], total_items: 65, current_page: 2, page_size: 50 }]);
  const result = await api.getCategoriesAction({ page: 2, limit: 50 });
  assert.deepEqual(calls[0][1].params, { page: 2, page_size: 50 });
  assert.equal(result.data.page, 2);
  assert.equal(result.data.limit, 50);
  assert.equal(result.data.total, 65);
});
