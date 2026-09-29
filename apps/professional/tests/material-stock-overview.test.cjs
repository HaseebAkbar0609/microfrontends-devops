const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const stock = {};
const compiled = ts.transpileModule(
  fs.readFileSync(path.resolve(__dirname, '../src/features/material-storage/utils/materialStockOverview.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
vm.runInNewContext(compiled, { exports: stock });

const depots = [
  { id: 'hq', name: 'Huvudlager', isDefault: true },
  { id: 'van', name: 'Servicebil', isDefault: false },
];

const article = (id, overrides) => ({
  id,
  articleNo: id,
  name: `Material ${id}`,
  supplierName: 'Beijer',
  categoryId: 'boards',
  unit: 'pcs',
  purchasePrice: 10,
  salesPrice: 20,
  minStockLevel: 10,
  reorderPoint: 20,
  ...overrides,
});

const articles = [
  article('100', { name: 'Gipsskiva', purchasePrice: 85 }),
  article('200', { name: 'Kopparrör', categoryId: 'pipes', supplierName: 'Ahlsell', purchasePrice: 0.85 }),
  article('300', { name: 'Träskruv' }),
];

const rows = stock.buildStockRows(articles, depots, [
  { articleId: '100', depotId: 'hq', inStock: 320, reserved: 40 },
  { articleId: '200', depotId: 'hq', inStock: 12, reserved: 3 },
  { articleId: '300', depotId: 'hq', inStock: 0, reserved: 0 },
  { articleId: '100', depotId: 'van', inStock: 5, reserved: 9 },
  { articleId: 'missing', depotId: 'hq', inStock: 1, reserved: 0 },
]);

const query = (overrides) => ({
  depotId: 'hq',
  search: '',
  categoryId: null,
  stockFilter: 'all',
  sortBy: null,
  sortOrder: 'asc',
  page: 1,
  pageSize: 10,
  ...overrides,
});

// Array.from builds the array in this realm, so strict deepEqual does not trip over the vm context's Array.
const ids = (page) => Array.from(page.rows, (row) => row.articleNo);

test('status: empty shelf, then available at or under the minimum level, else in stock', () => {
  assert.equal(stock.getStockStatus(0, 0, 10), 'outOfStock');
  assert.equal(stock.getStockStatus(12, 10, 10), 'lowStock');
  assert.equal(stock.getStockStatus(12, 11, 10), 'inStock');
});

test('rows get available, stock value and status, and entries without an article are dropped', () => {
  assert.equal(rows.length, 4);
  const [gips, rör, skruv, van] = rows;
  assert.equal(gips.id, '100_hq');
  assert.equal(gips.depotName, 'Huvudlager');
  assert.equal(gips.available, 280);
  assert.equal(gips.stockValue, 27200);
  assert.equal(gips.status, 'inStock');
  assert.equal(rör.stockValue, 10.2);
  assert.equal(rör.status, 'lowStock');
  assert.equal(skruv.status, 'outOfStock');
  assert.equal(van.available, 0, 'reserved above stock never goes negative');
});

test('KPIs cover only the chosen depot', () => {
  assert.deepEqual({ ...stock.computeDepotKpis(rows, 'hq') }, {
    stockValue: 27210.2,
    articlesInStock: 2,
    lowStockCount: 2,
    reorderPointCount: 2,
    reservedValue: 3402.55,
  });
  assert.equal(stock.computeDepotKpis(rows, 'van').articlesInStock, 1);
});

test('search matches article number, name or supplier; filters narrow further', () => {
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ search: 'ahlsell' }))), ['200']);
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ search: 'GIPS' }))), ['100']);
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ categoryId: 'pipes' }))), ['200']);
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ stockFilter: 'lowStock' }))), ['200', '300']);
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ stockFilter: 'reserved' }))), ['100', '200']);
});

test('sorting: numbers numerically, status from healthy to empty', () => {
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ sortBy: 'inStock', sortOrder: 'desc' }))), ['100', '200', '300']);
  assert.deepEqual(ids(stock.queryStockPage(rows, query({ sortBy: 'status', sortOrder: 'desc' }))), ['300', '200', '100']);
});

test('paging reports the total and clamps a page past the end to the last page', () => {
  const second = stock.queryStockPage(rows, query({ pageSize: 2, page: 2 }));
  assert.equal(second.totalItems, 3);
  assert.deepEqual(ids(second), ['300']);
  const beyond = stock.queryStockPage(rows, query({ pageSize: 2, page: 9 }));
  assert.equal(beyond.page, 2);
  assert.deepEqual(ids(beyond), ['300']);
});
