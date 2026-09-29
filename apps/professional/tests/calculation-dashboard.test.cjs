const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const plain = value => JSON.parse(JSON.stringify(value));

function load(file, response, fail = false) {
  const calls = [];
  const axios = Object.fromEntries(['get', 'post', 'put', 'delete'].map(method => [method, async (...args) => {
    calls.push({ method, args }); if (fail) throw new Error('network'); return { data: response };
  }]));
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/features/calculation/' + file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, { exports, require(name) {
    if (name === '@/lib/axiosInstance') return { __esModule: true, default: axios };
    if (name === '@/constants/api') return { API_PATH: { CALCULATIONS: { DASHBOARD: '/professionals/calculations/dashboard', CREATE: '/professionals/calculations', LIST: '/professionals/calculations', BASE: '/professionals/calculations', GET: id => '/professionals/calculations/'+id, UPDATE: id => '/professionals/calculations/'+id } } };
    if (name === '@/api-actions/offers') return {};
    if (name === 'zod') return require('zod');
    throw new Error(name);
  } });
  return { api: exports, calls };
}
function empty() {
  return { summary: { total: 0, status_counts: { not_started: 0, in_progress: 0, completed: 0 }, values: [], missing_value_count: 0 },
    sections: [], recentActivity: [], upcomingItems: [], monthlyCounts: [],
    metadata: { company_id: 'company-a', user_id: 'actor-a', generated_at: 1800000000000, source: 'professional_calculations' } };
}

test('aggregate uses one current-company request, forwards cancellation and accepts real empty data', async () => {
  const { api, calls } = load('api/calculationDashboard.ts', { success: true, data: empty() });
  const signal = new AbortController().signal;
  assert.deepEqual(plain(await api.getCalculationDashboard('company-a', 'actor-a', signal)), empty());
  assert.equal(calls.length, 1);
  assert.equal(calls[0].args[0], '/professionals/calculations/dashboard');
  assert.equal(calls[0].args[1].headers['X-Company-ID'], 'company-a');
  assert.equal(calls[0].args[1].signal, signal);
});

test('saved detail has no fabricated contacts and failed reads/writes never report success', async () => {
  const { api } = load('api/calculationDetailApi.ts', { success: true, data: { id: 'record', calc_no: 'K-REAL', project_name: 'Saved' } });
  const detail = await api.getCalculationDetailAPIAction('record');
  assert.equal(detail.projekteringNamn, 'Saved');
  assert.equal(detail.bestellareMail, '');
  assert.equal(detail.kontaktFornamn, '');
  assert.equal(detail.documents.length, 0);
  const failed = load('api/calculationDetailApi.ts', {}, true).api;
  await assert.rejects(failed.getCalculationDetailAPIAction('record'));
  await assert.rejects(failed.updateCalculationDetailAPIAction('record', {}));
  await assert.rejects(failed.deleteCalculationDocumentAPIAction('record', 'doc'));
});

for (const [label, mutate] of [
  ['company', d => { d.metadata.company_id = 'foreign'; }],
  ['actor', d => { d.metadata.user_id = 'foreign'; }],
  ['negative count', d => { d.summary.total = -1; }],
  ['unknown source', d => { d.metadata.source = 'mock'; }],
  ['invalid amount', d => { d.summary.values = [{ currency: 'SEK', total: 'NaN', average: '0', count: 1 }]; }],
]) test('rejects ' + label + ' instead of showing stale or fabricated data', async () => {
  const data = empty(); mutate(data);
  await assert.rejects(load('api/calculationDashboard.ts', { success: true, data }).api.getCalculationDashboard('company-a', 'actor-a'));
});

test('network and unsuccessful envelopes never become a zero-data success', async () => {
  await assert.rejects(load('api/calculationDashboard.ts', {}, true).api.getCalculationDashboard('company-a', 'actor-a'));
  await assert.rejects(load('api/calculationDashboard.ts', { success: false, data: empty() }).api.getCalculationDashboard('company-a', 'actor-a'));
});

test('create returns only the acknowledged persisted server identity', async () => {
  const success = load('api/createCalculation.ts', { success: true, data: { id: 'saved-id', calc_no: 'K-SAVED' } });
  assert.deepEqual(plain(await success.api.createCalculationAPIAction({ project_name: 'Real' })), { success: true, data: { id: 'saved-id', calcNo: 'K-SAVED' }, error: null });
  for (const response of [{}, { success: false }, { success: true, data: {} }]) {
    assert.equal((await load('api/createCalculation.ts', response).api.createCalculationAPIAction({})).success, false);
  }
  assert.equal((await load('api/createCalculation.ts', {}, true).api.createCalculationAPIAction({})).success, false);
});

test('optional amounts stay unknown; valid Swedish/decimal amounts, including zero, are parsed', () => {
  const { api } = load('utils/calculationAmount.ts');
  assert.equal(api.parseCalculationContractSum(''), undefined);
  assert.equal(api.parseCalculationContractSum('1 250,50 kr'), 1250.5);
  assert.equal(api.parseCalculationContractSum('0'), 0);
  for (const input of ['-1', 'NaN', 'Infinity', '1.001', '1e6', '9007199254740992']) assert.throws(() => api.parseCalculationContractSum(input));
});

test('overview renders an empty server list without a mock fallback and distinguishes missing amounts', async () => {
  const { api } = load('api/calculationOverview.ts', { success: true, data: [], total_items: 0, page_size: 10, current_page: 1, total_pages: 0 });
  assert.equal((await api.getCalculationOverviewListAPIAction()).data.length, 0);
  assert.equal(api.mapCalculationOverviewFromApi({ id: 'record', total_amount: null }).offertSumma, null);
  assert.equal(api.mapCalculationOverviewFromApi({ id: 'record', total_amount: '0.00' }).offertSumma, 0);
  await assert.rejects(load('api/calculationOverview.ts', { success: false }).api.getCalculationOverviewListAPIAction());
});

test('production dashboard and overview entry points do not import mock constants; query is actor/company scoped', () => {
  for (const file of ['components/CalculationDashboard.tsx', 'components/CalculationDashboardConfig.tsx', 'hooks/useCalculationOverview.ts']) {
    assert.doesNotMatch(fs.readFileSync(path.resolve(__dirname, '../src/features/calculation/' + file), 'utf8'), /DUMMY|[Mm]ock.*[Ii]mport|from .*Mock/);
  }
  const hook = fs.readFileSync(path.resolve(__dirname, '../src/features/calculation/hooks/useCalculationDashboard.ts'), 'utf8');
  assert.match(hook, /queryKey: \[CALCULATION_DASHBOARD_QUERY_KEY, companyId, userId\]/);
  assert.match(hook, /signal/);
});
