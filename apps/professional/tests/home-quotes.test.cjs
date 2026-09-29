const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");
const source = file => fs.readFileSync(path.join(root, file), "utf8");
const plain = value => JSON.parse(JSON.stringify(value));
function service(resolve = () => 0) {
  const calls = [];
  let now = 1000;
  const call = async (params, available = false) => {
    calls.push(params);
    return { totalItems: await resolve(available ? "available" : params.status, params) };
  };
  const context = { exports: {}, Date: { now: () => now }, require: name => {
    assert.equal(name, "@/api-actions/offers");
    return { listAvailableOffersAPIAction: params => call(params, true), listOffersAPIAction: call,
      OFFER_API_STATUS: { REQUESTED: "REQUESTED", OFFERED: "OFFERED", ACCEPTED: "ACCEPTED", ARCHIVED: "ARCHIVED" } };
  } };
  vm.runInNewContext(ts.transpileModule(source("features/offer/services/offerDashboardCounts.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return { ...context.exports, calls, advance: value => { now += value; } };
}
test("five company-scoped API totals, including true zero and totals larger than one page", async () => {
  const api = service(status => ({ available: 99, REQUESTED: 0, OFFERED: 7, ACCEPTED: 2, ARCHIVED: 1 })[status]);
  assert.deepEqual(plain(await api.loadOfferCounts("a", "a")), { available: 99, requested: 0, offered: 7, accepted: 2, archived: 1 });
  assert.equal(api.calls.length, 5);
  for (const call of api.calls) assert.deepEqual([call.companyId, call.page, call.pageSize], ["a", 1, 1]);
});
test("home and expanded widgets share pending requests and successful cached totals", async () => {
  const api = service(); const a = api.loadOfferCounts("a", "a"); const b = api.loadOfferCounts("a", "a");
  assert.equal(a, b); await a; await api.loadOfferCounts("a", "a"); assert.equal(api.calls.length, 5);
});
test("TTL expiry and explicit refresh fetch new totals", async () => {
  const api = service(); await api.loadOfferCounts("a", "a"); api.advance(api.OFFER_COUNTS_CACHE_MS);
  await api.loadOfferCounts("a", "a"); assert.equal(api.calls.length, 10);
  api.invalidateOfferCounts("a", "a"); await api.loadOfferCounts("a", "a"); assert.equal(api.calls.length, 15);
});
test("company and actor caches are isolated", async () => {
  const api = service((status, params) => params.companyId === "a" ? 1 : 2);
  await api.loadOfferCounts("a", "a"); const other = await api.loadOfferCounts("b", "a");
  await api.loadOfferCounts("a", "b"); assert.equal(other.requested, 2); assert.equal(api.calls.length, 15);
});
test("failure preserves successful siblings, remains unknown and is not cached as zero", async () => {
  const api = service(status => { if (status === "OFFERED") throw new Error("503"); return 4; });
  const data = await api.loadOfferCounts("a", "a"); assert.equal(data.offered, null); assert.equal(data.accepted, 4);
  await api.loadOfferCounts("a", "a"); assert.equal(api.calls.length, 10);
});
test("invalid totals cannot become invented values", async () => {
  for (const invalid of [-1, 1.5, NaN, "3", undefined]) {
    const api = service(() => invalid); const data = await api.loadOfferCounts("a", "a");
    assert.ok(Object.values(data).every(value => value === null));
  }
});
test("missing identity makes no requests", async () => {
  const api = service(); await assert.rejects(api.loadOfferCounts("", "a")); await assert.rejects(api.loadOfferCounts("a", ""));
  assert.equal(api.calls.length, 0);
});
test("home connects Modules catalog and Quotes without modifying the header launcher", () => {
  assert.match(source("features/widgetdashboard/components/Dashboard.tsx"), /belowGrid={<ModulesSection \/>}/);
  const config = source("features/widgetdashboard/components/DashboardConfig.tsx");
  assert.match(config, /content: <HomeQuotesWidget \/>/); assert.equal((config.match(/content:/g) || []).length, 1);
});
test("hook hides stale scope immediately and cancels late responses", () => {
  const hook = source("features/offer/hooks/useOfferDashboardCounts.ts");
  assert.match(hook, /snapshot\?\.scope === scope \? snapshot.counts : null/);
  assert.match(hook, /cancelled = true/); assert.match(hook, /if \(!cancelled\) setSnapshot/);
});
test("new commands are localized in English and Swedish", () => {
  for (const key of ["homeQuotesOpen", "homeQuotesRefresh", "homeModulesRefresh"]) for (const lang of ["en", "sv", "constants"])
    assert.ok(source(`utils/translation/${lang}.ts`).includes(`${key}:`));
});
