const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");

function load(file) {
  const context = { exports: {}, require: () => ({}) };
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}
const { sortAccessItems, removeAccessItem, removeAccessHolder } = load("features/access/utils/accessItems.ts");
const { ACCESS_HOLDERS_MOCK } = load("features/access/data/accessItems.mock.ts");
const { ACCESS_POINTS_MOCK } = load("features/access/data/accessPoints.mock.ts");

// Values built inside the vm belong to another realm, so compare plain copies.
const plain = (value) => JSON.parse(JSON.stringify(value));
const item = (id, over = {}) => ({ id, nycId: id, regNo: "1", type: "keys", accessTo: "Door", startDate: "2026-01-01", endDate: "2026-05-01", status: "active", ...over });
const holder = (id, items) => ({ id, name: id, items });

test("items sort in Swedish order, empties go last both ways, and the input is untouched", () => {
  const list = [item("a", { accessTo: "Örjan" }), item("b", { accessTo: "" }), item("c", { accessTo: "Åsa" }), item("d", { accessTo: "Zed" })];
  const ids = (order) => plain(sortAccessItems(list, "accessTo", order).map((i) => i.id));
  assert.deepEqual(ids("asc"), ["d", "c", "a", "b"]); // Z < Å < Ö in Swedish
  assert.deepEqual(ids("desc"), ["a", "c", "d", "b"]);
  assert.deepEqual(plain(sortAccessItems(list, null, "asc")), list);
  assert.deepEqual(list.map((i) => i.id), ["a", "b", "c", "d"]);
});

test("numbers and dates sort naturally", () => {
  const list = [item("a", { nycId: "N10", startDate: "2026-03-01" }), item("b", { nycId: "N9", startDate: "2026-01-15" }), item("c", { nycId: "N100", startDate: "2025-12-31" })];
  assert.deepEqual(plain(sortAccessItems(list, "nycId", "asc").map((i) => i.id)), ["b", "a", "c"]);
  assert.deepEqual(plain(sortAccessItems(list, "startDate", "asc").map((i) => i.id)), ["c", "b", "a"]);
});

test("removing an item keeps the person, and removing their last item drops them", () => {
  const holders = [holder("h1", [item("i1"), item("i2")]), holder("h2", [item("i3")])];
  const afterOne = plain(removeAccessItem(holders, "i1"));
  assert.deepEqual(afterOne.map((h) => [h.id, h.items.map((i) => i.id)]), [["h1", ["i2"]], ["h2", ["i3"]]]);
  const afterLast = plain(removeAccessItem(holders, "i3"));
  assert.deepEqual(afterLast.map((h) => h.id), ["h1"]);
  assert.equal(holders[1].items.length, 1); // the input is untouched
  assert.deepEqual(plain(removeAccessItem(holders, "nope")).map((h) => h.items.length), [2, 1]);
});

test("removing a person removes all their items and nobody else", () => {
  const holders = [holder("h1", [item("i1"), item("i2")]), holder("h2", [item("i3")])];
  assert.deepEqual(plain(removeAccessHolder(holders, "h1")).map((h) => h.id), ["h2"]);
  assert.deepEqual(plain(removeAccessHolder(holders, "nope")).map((h) => h.id), ["h1", "h2"]);
});

test("seed: ap-001 repeats the Figma frame", () => {
  const holders = plain(ACCESS_HOLDERS_MOCK["ap-001"]);
  assert.deepEqual(holders.map((h) => h.name), ["Kalle Andersson", "Stefan Larsson", "Stina Johansson", "Vera Isaksson", "Sture Svensson"]);
  const kalle = holders[0].items;
  assert.deepEqual(kalle.map((i) => [i.nycId, i.regNo, i.accessTo, i.status]), [
    ["N001", "4563978", "Main Door", "active"], ["N005", "4569875", "N002", "active"],
    ["N009", "23658", "PROJ-002", "returned"], ["N018", "478965", "OR501", "active"],
  ]);
  assert.ok(kalle.every((i) => i.type === "accessCard" && i.startDate === "2026-01-01" && i.endDate === "2026-05-01"));
});

test("seed: unique ids, valid values, and people match each list row's assigned-to names", () => {
  const all = Object.values(ACCESS_HOLDERS_MOCK).flat();
  const itemIds = all.flatMap((h) => h.items.map((i) => i.id));
  assert.equal(new Set(itemIds).size, itemIds.length);
  assert.equal(new Set(all.map((h) => h.id)).size, all.length);
  assert.ok(all.every((h) => h.items.length > 0));
  for (const i of all.flatMap((h) => h.items)) {
    assert.ok(["active", "returned"].includes(i.status), i.id);
    assert.ok(["accessCard", "keys", "passCard", "tag"].includes(i.type), i.id);
    assert.match(i.startDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(i.endDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(i.startDate <= i.endDate, i.id);
  }
  for (const point of ACCESS_POINTS_MOCK) {
    const names = (ACCESS_HOLDERS_MOCK[point.id] ?? []).map((h) => h.name);
    assert.deepEqual(plain(names), plain(point.assignees), point.id);
  }
  assert.ok(ACCESS_POINTS_MOCK.some((p) => !ACCESS_HOLDERS_MOCK[p.id]), "one record should show the empty tab");
  assert.deepEqual(plain(Object.keys(ACCESS_HOLDERS_MOCK).filter((id) => !ACCESS_POINTS_MOCK.some((p) => p.id === id))), []);
});
