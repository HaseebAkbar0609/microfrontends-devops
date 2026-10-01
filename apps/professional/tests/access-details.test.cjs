const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");

// Translation keys are looked up by name only, so a proxy that returns the key stands in for them.
const keys = new Proxy({}, { get: (_, key) => key });
function load(file) {
  const context = { exports: {}, require: (name) => (name === "@/utils/translation/constants" ? { default: keys } : {}) };
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}
const { findAccessDetails, sortContacts } = load("features/access/utils/accessDetails.ts");
const { ACCESS_POINTS_MOCK } = load("features/access/data/accessPoints.mock.ts");
const { ACCESS_DETAILS_MOCK } = load("features/access/data/accessDetails.mock.ts");
const { accessDetailsUrl, accessDetailsTabs } = load("features/access/data/accessNav.config.ts");

// Values built inside the vm belong to another realm, so compare plain copies.
const plain = (value) => JSON.parse(JSON.stringify(value));
const row = { id: "r1", idNumber: "NYK-1", objectRef: "PROJ-1", name: "Head Office", type: "keys", city: "Solna",
  assignees: [], lastAssignedAt: null, status: "active", archived: false };
const extra = { address: "Storgatan 30", postalCode: "113 45", contacts: [] };
const contact = (id, name, email = "", mobile = "") => ({ id, name, email, mobile });

test("details join the list row with its extra fields", () => {
  const details = findAccessDetails("r1", [row], { r1: extra });
  assert.deepEqual(
    [details.id, details.idNumber, details.projectOrder, details.accessName, details.address, details.postalCode, details.city],
    ["r1", "NYK-1", "PROJ-1", "Head Office", "Storgatan 30", "113 45", "Solna"],
  );
});

test("an unknown id gives null, and a row with no extra fields still opens", () => {
  assert.equal(findAccessDetails("nope", [row], { r1: extra }), null);
  const bare = findAccessDetails("r1", [row], {});
  assert.deepEqual(plain([bare.address, bare.postalCode, bare.contacts]), ["", "", []]);
  assert.equal(findAccessDetails("r1", [{ ...row, objectRef: null }], {}).projectOrder, null);
});

test("contacts sort in Swedish order, empties go last both ways, and the input is untouched", () => {
  const list = [contact("a", "Örjan", "o@x.se"), contact("b", "Zeke", ""), contact("c", "Åsa", "a@x.se"), contact("d", "Zed", "z@x.se")];
  const ids = (field, order) => plain(sortContacts(list, field, order).map((c) => c.id));
  assert.deepEqual(ids("name", "asc"), ["d", "b", "c", "a"]); // Zed < Zeke < Å < Ö in Swedish
  assert.deepEqual(ids("name", "desc"), ["a", "c", "b", "d"]);
  assert.deepEqual(ids("email", "asc"), ["c", "a", "d", "b"]); // the contact with no email is last
  assert.deepEqual(ids("email", "desc"), ["d", "a", "c", "b"]);
  assert.deepEqual(plain(sortContacts(list, null, "asc")), list);
  assert.deepEqual(list.map((c) => c.id), ["a", "b", "c", "d"]);
});

test("details address and tabs follow the record id", () => {
  assert.equal(accessDetailsUrl("ap-001"), "/module/production/access/ap-001");
  assert.equal(accessDetailsUrl("a b/c"), "/module/production/access/a%20b%2Fc");
  const [info, access] = accessDetailsTabs("ap-001");
  assert.deepEqual([info.href, info.exact, info.labelKey], ["/module/production/access/ap-001", true, "accessTabInformation"]);
  assert.deepEqual([access.href, access.labelKey], ["/module/production/access/ap-001/access", "accessTabAccess"]);
  assert.notEqual(access.exact, true);
});

test("every list row has details, and contact ids are unique across the seed", () => {
  for (const point of ACCESS_POINTS_MOCK) assert.ok(findAccessDetails(point.id, ACCESS_POINTS_MOCK, ACCESS_DETAILS_MOCK), point.id);
  assert.deepEqual(plain(Object.keys(ACCESS_DETAILS_MOCK).filter((id) => !ACCESS_POINTS_MOCK.some((p) => p.id === id))), []);
  const contactIds = Object.values(ACCESS_DETAILS_MOCK).flatMap((d) => d.contacts.map((c) => c.id));
  assert.equal(new Set(contactIds).size, contactIds.length);
  assert.ok(Object.values(ACCESS_DETAILS_MOCK).some((d) => d.contacts.length === 0), "one record should show the empty table");
  assert.ok(Object.values(ACCESS_DETAILS_MOCK).flatMap((d) => d.contacts).every((c) => c.name && c.email));
});
