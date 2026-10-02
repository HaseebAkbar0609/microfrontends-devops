const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");

// Loads a .ts file and, for relative imports, the files it imports. Translation keys are not needed here.
function load(file) {
  const full = path.join(root, file);
  const context = {
    exports: {},
    require: (name) => (name.startsWith(".") ? load(path.relative(root, path.resolve(path.dirname(full), name + ".ts"))) : {}),
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(full, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}
const { validateInfo, validateContact, validateKey, addAccessTag, nextKeyId, nextAccessIds, formatLocalIso, buildAccessPoint } =
  load("features/access/utils/accessNew.ts");

// Values built inside the vm belong to another realm, so compare plain copies.
const plain = (value) => JSON.parse(JSON.stringify(value));
const info = (over = {}) => ({ objectRef: "", name: "Headoffice", address: "Storgatan 30", postalCode: "113 45", city: "Solna", ...over });
const form = (over = {}) => ({ type: "keys", regNo: "N3408454", startDate: "2026-01-01", returnDate: "2026-05-01", company: "Byggbolaget", person: "Kalle Andersson", ...over });

test("a complete information form has no errors, and the object link is optional", () => {
  assert.deepEqual(plain(validateInfo(info())), {});
  assert.deepEqual(plain(validateInfo(info({ objectRef: "PROJ-0021" }))), {});
});

test("information: blank fields are required, and postal codes must have five digits", () => {
  assert.deepEqual(plain(validateInfo(info({ name: "  ", address: "", city: " " }))), { name: "required", address: "required", city: "required" });
  assert.equal(validateInfo(info({ postalCode: "" })).postalCode, "required");
  for (const bad of ["1134", "113 456", "abc de", "11 345"]) assert.equal(validateInfo(info({ postalCode: bad })).postalCode, "postalCode", bad);
  for (const good of ["11345", "113 45", " 113 45 "]) assert.equal(validateInfo(info({ postalCode: good })).postalCode, undefined, good);
  assert.equal(validateInfo(info({ name: "x".repeat(256) })).name, "tooLong");
  assert.equal(validateInfo(info({ name: "x".repeat(255) })).name, undefined);
});

test("contact: person and email are required, the email must look right, and a person can be added once", () => {
  const draft = (over = {}) => ({ person: "Kalle Andersson", email: "kalle@example.com", mobile: "", ...over });
  assert.deepEqual(plain(validateContact(draft(), [])), {});
  assert.deepEqual(plain(validateContact(draft({ person: "", email: "" }), [])), { person: "required", email: "required" });
  for (const bad of ["kalle", "kalle@", "kalle@example", "ka lle@example.com"]) assert.equal(validateContact(draft({ email: bad }), []).email, "email", bad);
  assert.equal(validateContact(draft(), [{ id: "c1", name: "Kalle Andersson", email: "a@b.se", mobile: "" }]).person, "duplicate");
  assert.equal(validateContact(draft(), [{ id: "c1", name: "Anna Lindqvist", email: "a@b.se", mobile: "" }]).person, undefined);
  assert.equal(validateContact(draft({ mobile: "0".repeat(31) }), []).mobile, "tooLong");
});

test("key: everything is required, at least one place is needed, and the return date cannot be before the start", () => {
  assert.deepEqual(plain(validateKey(form(), ["Main Door"])), {});
  assert.deepEqual(plain(validateKey(form({ type: "", regNo: " ", startDate: "", returnDate: "", company: "", person: "" }), [])), {
    type: "required", regNo: "required", startDate: "required", returnDate: "required", accessTo: "noTags", company: "required", person: "required",
  });
  assert.equal(validateKey(form({ startDate: "2026-05-02", returnDate: "2026-05-01" }), ["x"]).returnDate, "dateOrder");
  assert.equal(validateKey(form({ startDate: "2026-05-01", returnDate: "2026-05-01" }), ["x"]).returnDate, undefined); // the same day is fine
  assert.equal(validateKey(form({ regNo: "x".repeat(31) }), ["x"]).regNo, "tooLong");
});

test("places the key opens: trimmed, added once ignoring case, and never blank", () => {
  assert.deepEqual(plain(addAccessTag([], "  Main Door ")), { tags: ["Main Door"] });
  assert.deepEqual(plain(addAccessTag(["Main Door"], "main DOOR")), { tags: ["Main Door"], error: "duplicate" });
  assert.deepEqual(plain(addAccessTag(["a"], "   ")), { tags: ["a"], error: "required" });
  assert.equal(addAccessTag([], "x".repeat(61)).error, "tooLong");
  const before = ["a"];
  addAccessTag(before, "b");
  assert.deepEqual(before, ["a"]); // the input is untouched
});

test("key numbers start at N001 and continue after the highest", () => {
  assert.equal(nextKeyId([]), "N001");
  assert.equal(nextKeyId([{ keyId: "N001" }, { keyId: "N002" }]), "N003");
  assert.equal(nextKeyId([{ keyId: "N009" }, { keyId: "N002" }]), "N010");
});

test("the next access continues the list's numbers and keeps its prefix", () => {
  const rows = [{ id: "ap-001", idNumber: "NYK-2025-001" }, { id: "ap-012", idNumber: "NYK-2025-012" }, { id: "ap-003", idNumber: "NYK-2025-003" }];
  assert.deepEqual(plain(nextAccessIds(rows)), { id: "ap-013", idNumber: "NYK-2025-013" });
  assert.deepEqual(plain(nextAccessIds([])), { id: "ap-001", idNumber: "NYK-2026-001" });
});

test("a local date-time is written without an offset", () => {
  assert.equal(formatLocalIso(new Date(2026, 9, 2, 9, 5, 7)), "2026-10-02T09:05:07");
  assert.equal(formatLocalIso(new Date(2026, 0, 1, 0, 0, 0)), "2026-01-01T00:00:00");
});

test("the finished access becomes a list row: first key's type, everyone who got a key once, no object means null", () => {
  const keys = [
    { id: "k1", keyId: "N001", type: "tag", regNo: "1", startDate: "2026-01-01", returnDate: "2026-02-01", accessTo: ["Door"], company: "A", person: "Kalle Andersson" },
    { id: "k2", keyId: "N002", type: "keys", regNo: "2", startDate: "2026-01-01", returnDate: "2026-02-01", accessTo: ["Gate"], company: "A", person: "Anna Lindqvist" },
    { id: "k3", keyId: "N003", type: "keys", regNo: "3", startDate: "2026-01-01", returnDate: "2026-02-01", accessTo: ["Gate"], company: "A", person: "Kalle Andersson" },
  ];
  const point = plain(buildAccessPoint(info({ name: " Headoffice ", city: " Solna " }), keys, { id: "ap-013", idNumber: "NYK-2025-013" }, "2026-10-02T09:00:00"));
  assert.deepEqual(point, {
    id: "ap-013", idNumber: "NYK-2025-013", objectRef: null, name: "Headoffice", type: "tag", city: "Solna",
    assignees: ["Kalle Andersson", "Anna Lindqvist"], lastAssignedAt: "2026-10-02T09:00:00", status: "active", archived: false,
  });
  assert.equal(buildAccessPoint(info({ objectRef: "OR501" }), keys, { id: "x", idNumber: "y" }, "now").objectRef, "OR501");
});
