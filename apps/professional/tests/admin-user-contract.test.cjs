const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// This pure form module has type-only imports. No browser or app runtime is started.
const source = fs.readFileSync(path.join(__dirname, "../src/features/admin/users/live/userForm.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const constantsSource = fs.readFileSync(path.join(__dirname, "../src/features/admin/users/live/admin.constants.ts"), "utf8");
const constantsContext = { exports: {} };
vm.runInNewContext(ts.transpileModule(constantsSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, constantsContext);
const context = { exports: {}, TextEncoder, require: name => { assert.equal(name, "./admin.constants"); return constantsContext.exports; } };
vm.runInNewContext(compiled, context);
const { defaults, validateUser, userPayload } = context.exports;
const plain = value => JSON.parse(JSON.stringify(value));
const user = { id: "member", first_name: "Test", last_name: "Owner", email: "qa@example.com", role: "owner", status: "active",
  groups: [{ id: "group" }], module_permissions: { reports: true }, department_id: "department", language_preference: "sv",
  editable_fields: ["first_name", "last_name", "email", "role", "department", "group_ids", "module_permissions", "phone_number", "auto_logout"] };
const related = { group_ids: ["group"], department: "department", module_permissions: { reports: true } };

test("unchanged edit preserves permissions and sends no writes", () => assert.deepEqual(plain(userPayload(defaults(user), related, user)), {}));
test("read-only response cannot mutate identity or role", () => assert.deepEqual(plain(userPayload({ ...defaults(user), role: "worker", email: "other@example.com" }, related, { ...user, editable_fields: [] })), {}));
test("group deselection changes only group IDs", () => assert.deepEqual(plain(userPayload(defaults(user), { ...related, group_ids: [] }, user)), { group_ids: [] }));
test("empty optional phone is null", () => assert.deepEqual(plain(userPayload(defaults(user), related, { ...user, phone_number: "+46701234567" })), { phone_number: null }));
const valid = { ...defaults(), first_name: "New", last_name: "User", email: "qa@example.com", password: "Synthetic-123", confirm_password: "Synthetic-123" };
test("valid creation includes password confirmation and invitation setting", () => {
  assert.deepEqual(plain(validateUser(valid)), {});
  assert.equal(userPayload(valid, {}).confirm_password, valid.password);
  assert.equal(userPayload(valid, {}).send_invitation, true);
});
for (const [field, value] of [["first_name", " "], ["last_name", "A".repeat(101)], ["email", "invalid"], ["phone_number", "bad"], ["confirm_password", "mismatch"], ["auto_logout", "1441"], ["auto_logout", "1.5"], ["personal_id", "x".repeat(256)]]) {
  test(`rejects invalid ${field}: ${String(value).slice(0, 10)}`, () => assert.ok(Object.keys(validateUser({ ...valid, [field]: value })).length));
}
test("password UTF-8 byte limit is enforced", () => assert.ok(validateUser({ ...valid, password: "\u00e4".repeat(40), confirm_password: "\u00e4".repeat(40) }).confirm_password));
test("pending read-only names do not block membership edit", () => assert.deepEqual(plain(validateUser(defaults({ ...user, first_name: "", last_name: "" }), { ...user, editable_fields: ["role"] })), {}));
