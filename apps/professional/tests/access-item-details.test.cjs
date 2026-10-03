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
const { findAccessItem, setAccessItemStatus } = load("features/access/utils/accessItems.ts");
const { removeAccessImage, sortAccessDocuments, EMPTY_ACCESS_ITEM_EXTRA } = load("features/access/utils/accessItemExtras.ts");
const { accessItemUrl } = load("features/access/data/accessNav.config.ts");
const { ACCESS_HOLDERS_MOCK } = load("features/access/data/accessItems.mock.ts");
const { ACCESS_ITEM_EXTRAS_MOCK } = load("features/access/data/accessItemExtras.mock.ts");

// Values built inside the vm belong to another realm, so compare plain copies.
const plain = (value) => JSON.parse(JSON.stringify(value));
const item = (id, over = {}) => ({ id, nycId: id, regNo: "1", type: "keys", accessTo: "Door", startDate: "2026-01-01", endDate: "2026-05-01", status: "active", ...over });
const holder = (id, items) => ({ id, name: id, items });
const doc = (id, date, name) => ({ id, date, name, fileType: "pdf" });

test("an item is found with its holder, and an unknown id gives null", () => {
  const holders = [holder("h1", [item("i1"), item("i2")]), holder("h2", [item("i3")])];
  const found = findAccessItem(holders, "i3");
  assert.deepEqual([found.holder.id, found.item.id], ["h2", "i3"]);
  assert.equal(findAccessItem(holders, "nope"), null);
  assert.equal(findAccessItem([], "i1"), null);
});

test("setting a status changes only that item and leaves the input untouched", () => {
  const holders = [holder("h1", [item("i1"), item("i2")]), holder("h2", [item("i3")])];
  const next = plain(setAccessItemStatus(holders, "i2", "returned"));
  assert.deepEqual(next.flatMap((h) => h.items.map((i) => [i.id, i.status])), [["i1", "active"], ["i2", "returned"], ["i3", "active"]]);
  assert.equal(holders[0].items[1].status, "active");
  assert.deepEqual(plain(setAccessItemStatus(holders, "nope", "returned")).flatMap((h) => h.items.map((i) => i.status)), ["active", "active", "active"]);
});

test("removing an image changes only that item, and an unknown item changes nothing", () => {
  const extras = {
    a: { ...EMPTY_ACCESS_ITEM_EXTRA, images: [{ id: "x1", caption: "p.png" }, { id: "x2", caption: "p.png" }] },
    b: { ...EMPTY_ACCESS_ITEM_EXTRA, images: [{ id: "x3", caption: "q.png" }] },
  };
  const next = removeAccessImage(extras, "a", "x1");
  assert.deepEqual(plain(next.a.images.map((i) => i.id)), ["x2"]); // same caption, so only the id tells them apart
  assert.deepEqual(plain(next.b.images.map((i) => i.id)), ["x3"]);
  assert.equal(extras.a.images.length, 2);
  assert.equal(removeAccessImage(extras, "nope", "x1"), extras);
});

test("documents sort by date, name and file type, and the input is untouched", () => {
  const docs = [doc("a", "2024-07-15", "Åsa.pdf"), doc("b", "2024-03-01", "Zed.pdf"), doc("c", "2024-05-10", "Örjan.pdf")];
  const ids = (field, order) => plain(sortAccessDocuments(docs, field, order).map((d) => d.id));
  assert.deepEqual(ids("date", "asc"), ["b", "c", "a"]);
  assert.deepEqual(ids("date", "desc"), ["a", "c", "b"]);
  assert.deepEqual(ids("name", "asc"), ["b", "a", "c"]); // Z < Å < Ö in Swedish
  assert.deepEqual(ids("fileType", "asc"), ["a", "b", "c"]); // all PDF, so the original order stays
  assert.deepEqual(plain(sortAccessDocuments(docs, null, "asc")), docs);
  assert.deepEqual(docs.map((d) => d.id), ["a", "b", "c"]);
});

test("the item page address sits under the Access tab and encodes the ids", () => {
  assert.equal(accessItemUrl("ap-001", "i-001-1-1"), "/module/production/access/ap-001/access/i-001-1-1");
  assert.equal(accessItemUrl("a b", "c/d"), "/module/production/access/a%20b/access/c%2Fd");
});

test("seed: extras belong to real items, ids are unique, and the Figma item has its documents and six images", () => {
  const itemIds = Object.values(ACCESS_HOLDERS_MOCK).flat().flatMap((h) => h.items.map((i) => i.id));
  assert.deepEqual(plain(Object.keys(ACCESS_ITEM_EXTRAS_MOCK).filter((id) => !itemIds.includes(id))), []);
  const extras = Object.values(ACCESS_ITEM_EXTRAS_MOCK);
  const docIds = extras.flatMap((e) => e.documents.map((d) => d.id));
  const imageIds = extras.flatMap((e) => e.images.map((i) => i.id));
  assert.equal(new Set(docIds).size, docIds.length);
  assert.equal(new Set(imageIds).size, imageIds.length);
  assert.ok(extras.every((e) => e.documents.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.fileType === "pdf")));
  const first = ACCESS_ITEM_EXTRAS_MOCK["i-001-1-1"];
  assert.deepEqual([first.documents.length, first.images.length], [2, 6]);
  assert.ok(extras.some((e) => e.images.length === 0 && e.documents.length > 0), "one item should show the empty gallery");
  assert.ok(Object.keys(ACCESS_ITEM_EXTRAS_MOCK).length < itemIds.length, "some items should have no extras, to show the empty tables");
});
