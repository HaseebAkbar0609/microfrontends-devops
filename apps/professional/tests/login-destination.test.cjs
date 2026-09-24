const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const exportsObject = {};
const compiled = ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/features/auth/utils/loginDestination.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
vm.runInNewContext(compiled, { exports: exportsObject });

test('pending Sales onboarding opens card setup after login', () => {
  assert.equal(exportsObject.loginDestination(null, false, true), '/admin/subscription?tab=payment');
  assert.equal(exportsObject.loginDestination(null, true, true), '/admin/subscription?tab=payment');
});

test('ordinary first purchase and paid login keep their existing destinations', () => {
  assert.equal(exportsObject.loginDestination(null, true, false), '/manage-plans');
  assert.equal(exportsObject.loginDestination(null, false, false), '/home');
});

test('an explicit safe return path wins over onboarding prompts', () => {
  assert.equal(exportsObject.loginDestination('/cases/123', true, true), '/cases/123');
});
