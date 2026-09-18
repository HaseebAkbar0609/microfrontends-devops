const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const exportsObject = {};
const compiled = ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/middleware.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
vm.runInNewContext(compiled, {
  exports: exportsObject,
  require(name) {
    if (name === 'next/server') return { NextResponse: {
      next: () => ({ kind: 'next' }),
      redirect: url => ({ kind: 'redirect', pathname: url.pathname }),
    } };
    if (name === '@/constants/api') return { appConstants: {
      LOCAL_REQUIRES_SUBSCRIPTION_COOKIE_NAME: 'subscription',
      LOCAL_SESSION_HINT_COOKIE_NAME: 'session',
    } };
    throw new Error(`Unexpected import: ${name}`);
  },
});

function request(pathname, subscription = '1', session = '1') {
  const nextUrl = new URL(pathname, 'https://example.test');
  nextUrl.clone = () => new URL(nextUrl);
  return { nextUrl, cookies: { get: key => ({ value: key === 'subscription' ? subscription : session }) } };
}

for (const route of ['/auth/callback', '/auth/callback/redeem', '/subscription/success', '/subscription/success/return']) {
  test(`checkout gating preserves ${route}`, () => {
    assert.equal(exportsObject.middleware(request(route)).kind, 'next');
  });
}

for (const route of ['/admin/subscription', '/admin/subscription?tab=payment', '/module/business/offer/commissions']) {
  test(`unpaid users can recover their existing payment at ${route}`, () => {
    assert.equal(exportsObject.middleware(request(route)).kind, 'next');
  });
}

test('unpaid users remain in the checkout funnel', () => {
  assert.equal(exportsObject.middleware(request('/home')).pathname, '/manage-plans');
});

test('existing subscribers can open the separate subscription editor', () => {
  assert.equal(exportsObject.middleware(request('/admin/subscription/change?mode=licenses', '0')).kind, 'next');
});

test('legacy explicit change links stay reachable for existing subscribers', () => {
  assert.equal(exportsObject.middleware(request('/manage-plans?change=1', '0')).kind, 'next');
});

test('a paid user is not sent back to a first-purchase flow', () => {
  assert.equal(exportsObject.middleware(request('/manage-plans', '0')).pathname, '/home');
});
