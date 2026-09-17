const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function load(file, imports = {}) {
  const exports = {};
  const source = fs.readFileSync(path.resolve(__dirname, '../src', file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  vm.runInNewContext(code, { exports, require(name) {
    if (name in imports) return imports[name];
    if (name === 'react' || name === 'react/jsx-runtime') return require(name);
    throw new Error(`Unexpected import ${name}`);
  } });
  return exports;
}
const translations = load('utils/translation/adminLive.ts');

function renderGate(query, language = 'en') {
  const messages = translations[language + 'AdminLive'];
  const imports = {
    '@tanstack/react-query': { useQuery: () => query },
    'lucide-react': { KeyRound: () => null, Loader2: () => null, RefreshCw: () => null },
    '@/components/ui/button': { Button: props => React.createElement('button', props) },
    '@/context/AuthContext': { useAuthStatus: () => ({ company: { id: 'company' }, user: { id: 'staff' } }) },
    '@/utils/translation/translate': { useTranslate: () => key => messages[key] },
    '@/features/admin/subscription/services/subscriptionService': { getSubscriptionOverview() {} },
    '@/lib/axiosInstance': { ensureRefreshedAccessToken() {} },
    '@/lib/requiresSubscriptionCookie': { setRequiresSubscriptionCookie() {} },
    './license.constants': { STAFF_LICENSE_RECHECK_MS: 15000 },
    './ui': { State: () => React.createElement('p', null, 'request-error') },
  };
  const Gate = load('features/admin/users/live/StaffLicenseGate.tsx', imports).default;
  return renderToStaticMarkup(React.createElement(Gate, null, 'BUY-PERSONAL-SUBSCRIPTION'));
}

for (const language of ['en', 'sv']) {
  test(`${language}: unassigned staff see administrator guidance, never a purchase form`, () => {
    const html = renderGate({ data: { managed_license: true, license_required: true, status: { access_state: 'INACTIVE' } } }, language);
    assert.ok(html.includes(translations[language + 'AdminLive'].staffLicenseWaiting));
    assert.ok(html.includes(translations[language + 'AdminLive'].staffLicenseWaitingText));
    assert.ok(!html.includes('BUY-PERSONAL-SUBSCRIPTION'));
  });
}
test('assigned staff continue through the company license, not personal checkout', () => {
  const html = renderGate({ data: { managed_license: true, license_required: false, status: { access_state: 'ACTIVE' } } });
  assert.ok(html.includes('Continue to workspace'));
  assert.ok(!html.includes('BUY-PERSONAL-SUBSCRIPTION'));
});
test('expired assigned license displays unavailable rather than never assigned', () => {
  const html = renderGate({ data: { managed_license: true, license_required: false, status: { access_state: 'INACTIVE' } } });
  assert.ok(html.includes('License unavailable'));
  assert.ok(!html.includes('License not assigned yet'));
});
test('owner billing is unchanged', () => assert.ok(renderGate({ data: { managed_license: false } }).includes('BUY-PERSONAL-SUBSCRIPTION')));
test('loading and failed status never expose the purchase form', () => {
  for (const query of [{ isLoading: true }, { isError: true, error: new Error('offline') }]) {
    assert.ok(!renderGate(query).includes('BUY-PERSONAL-SUBSCRIPTION'));
  }
});
test('refresh requests use the same versioned API base as all authenticated requests', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../src/lib/axiosInstance.ts'), 'utf8');
  assert.ok(source.includes('baseURL: BASE_API_VERSION'));
  assert.ok(!source.includes('baseURL: getApiBaseURL()'));
});
