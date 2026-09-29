const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");
const source = file => fs.readFileSync(path.join(root, file), "utf8");
function service(data) {
  const calls = [];
  const context = { exports: {}, require: name => name === "@/lib/axiosInstance" ?
    { default: { get: async (...args) => { calls.push(args); return { data: { data } }; } } } :
    { APP_GROUPS: [{ category: "Production", items: [{ label: "project", href: "/module/production/project" },
      { label: "offer", href: "/module/business/offer/dashboard" }] }] } };
  vm.runInNewContext(ts.transpileModule(source("features/widgetdashboard/services/homeModules.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return { ...context.exports, calls };
}
test("module catalog uses explicit company scope and preserves real entries", async () => {
  const rows = [{ category: "Production", modules: [{ id: "a", name: "Project", name_sv: "Projekt" }] }];
  const api = service(rows); assert.equal(await api.getHomeModules("company"), rows);
  assert.equal(api.calls[0][1].headers["X-Company-ID"], "company");
});
test("empty catalog is distinct from missing or malformed responses", async () => {
  assert.equal((await service([]).getHomeModules("a")).length, 0);
  for (const rows of [null, {}, [{ category: "a" }], [{ category: "a", modules: [null] }]])
    await assert.rejects(service(rows).getHomeModules("a"));
});
test("missing company prevents requests", async () => {
  const api = service([]); await assert.rejects(api.getHomeModules("")); assert.equal(api.calls.length, 0);
});
test("known names and legacy catalog aliases reuse existing launcher routes", () => {
  const api = service([]); const t = key => ({ project: "Project", offer: "Offer" })[key];
  assert.equal(api.homeModuleApp({ name: "Project" }, t).href, "/module/production/project");
  assert.equal(api.homeModuleApp({ name: "Offered" }, t).href, "/module/business/offer/dashboard");
  assert.equal(api.homeModuleApp({ name: "Unimplemented" }, t), undefined);
});
test("modules cache is separated by company and actor and no mock catalog is imported", () => {
  const component = source("features/widgetdashboard/components/ModulesSection.tsx");
  assert.match(component, /queryKey: \["home-modules", companyId, actorId\]/);
  assert.doesNotMatch(component, /WidgetSourceUnavailable|mock|Card/);
});
