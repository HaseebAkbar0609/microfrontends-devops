const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");

// Both files import types only, so nothing needs mocking.
function load(file) {
  const context = { exports: {}, require: () => ({}) };
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}
const { selectAccessPoints, formatAssignedAt } = load("features/access/utils/accessList.ts");
const { ACCESS_POINTS_MOCK } = load("features/access/data/accessPoints.mock.ts");

const base = { search: "", status: null, type: null, sortBy: null, sortOrder: "asc", page: 1, pageSize: 50 };
const row = (id, over = {}) => ({
  id, idNumber: `NYK-${id}`, objectRef: null, name: id, type: "keys", city: "Stockholm",
  assignees: [], lastAssignedAt: null, status: "active", archived: false, ...over,
});
const names = (page) => page.rows.map((r) => r.name);

test("archived rows never show, and status and type filters combine", () => {
  const rows = [
    row("a"), row("b", { archived: true }), row("c", { status: "scheduled" }),
    row("d", { type: "tag" }), row("e", { status: "scheduled", type: "tag" }),
  ];
  assert.deepEqual(names(selectAccessPoints(rows, base)), ["a", "c", "d", "e"]);
  assert.deepEqual(names(selectAccessPoints(rows, { ...base, status: "scheduled" })), ["c", "e"]);
  assert.deepEqual(names(selectAccessPoints(rows, { ...base, status: "scheduled", type: "tag" })), ["e"]);
});

test("search ignores case and matches id number, name, city and object", () => {
  const rows = [
    row("a", { name: "Förråd", city: "Järfälla" }),
    row("b", { name: "Kök", objectRef: "PROJ-0021" }),
    row("c", { name: "Serverrum", idNumber: "NYK-2025-011" }),
  ];
  const find = (search) => names(selectAccessPoints(rows, { ...base, search }));
  assert.deepEqual(find("  FÖRRÅD "), ["Förråd"]);
  assert.deepEqual(find("järf"), ["Förråd"]);
  assert.deepEqual(find("proj-0021"), ["Kök"]);
  assert.deepEqual(find("2025-011"), ["Serverrum"]);
  assert.deepEqual(find("zzz"), []);
});

test("sorting follows Swedish order and keeps rows without a value last in both directions", () => {
  const rows = [
    row("a", { assignees: ["Örjan"], lastAssignedAt: "2025-01-02T10:00:00" }),
    row("b", { assignees: [], lastAssignedAt: null }),
    row("c", { assignees: ["Åsa"], lastAssignedAt: "2025-03-01T10:00:00" }),
    row("d", { assignees: ["Zeke"], lastAssignedAt: "2025-02-01T10:00:00" }),
  ];
  const sort = (sortBy, sortOrder) => names(selectAccessPoints(rows, { ...base, sortBy, sortOrder }));
  assert.deepEqual(sort("assignedTo", "asc"), ["d", "c", "a", "b"]); // Z < Å < Ö in Swedish
  assert.deepEqual(sort("assignedTo", "desc"), ["a", "c", "d", "b"]);
  assert.deepEqual(sort("lastAssignedAt", "asc"), ["a", "d", "c", "b"]);
  assert.deepEqual(sort("lastAssignedAt", "desc"), ["c", "d", "a", "b"]);
});

test("rows with equal values keep their original order", () => {
  const rows = [row("a", { city: "X" }), row("b", { city: "X" }), row("c", { city: "A" })];
  assert.deepEqual(names(selectAccessPoints(rows, { ...base, sortBy: "city" })), ["c", "a", "b"]);
});

test("paging reports the true total and clamps a page that no longer exists", () => {
  const rows = Array.from({ length: 12 }, (_, i) => row(String(i + 1).padStart(2, "0")));
  const at = (page) => selectAccessPoints(rows, { ...base, pageSize: 5, page });
  assert.equal(at(1).totalItems, 12);
  assert.deepEqual(at(3).rows.map((r) => r.id), ["11", "12"]);
  assert.equal(at(99).page, 3); // e.g. the last row of the last page was archived
  assert.equal(at(0).page, 1);
  const none = selectAccessPoints([], { ...base, page: 4 });
  assert.deepEqual([none.rows.length, none.totalItems, none.page], [0, 0, 1]);
});

test("assigned time is formatted from the string, with no time zone shift", () => {
  assert.equal(formatAssignedAt("2025-12-12T08:30:00"), "2025-12-12 08:30");
  assert.equal(formatAssignedAt(null), null);
});

test("seed rows have unique ids, cover every status and type, and none starts archived", () => {
  assert.equal(new Set(ACCESS_POINTS_MOCK.map((r) => r.id)).size, ACCESS_POINTS_MOCK.length);
  assert.equal(new Set(ACCESS_POINTS_MOCK.map((r) => r.idNumber)).size, ACCESS_POINTS_MOCK.length);
  assert.deepEqual([...new Set(ACCESS_POINTS_MOCK.map((r) => r.status))].sort(), ["active", "inProgress", "scheduled"]);
  assert.deepEqual([...new Set(ACCESS_POINTS_MOCK.map((r) => r.type))].sort(), ["accessCard", "keys", "passCard", "tag"]);
  assert.ok(ACCESS_POINTS_MOCK.every((r) => !r.archived));
});
