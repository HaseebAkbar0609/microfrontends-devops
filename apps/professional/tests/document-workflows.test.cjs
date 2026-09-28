const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");
function load(file, dependencies = {}) {
  const context = { exports: {}, crypto: { randomUUID: () => "correlation" }, require: name => {
    if (name in dependencies) return dependencies[name];
    throw new Error("Unexpected dependency " + name);
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}
const plain = value => JSON.parse(JSON.stringify(value));
const labels = load("features/document-workflows/labels.ts", { axios: { default: { isAxiosError: error => !!error.response } } });
test("every archive transition and negative review decision requires a reason", () => {
  for (const action of ["request_archive", "approve_archive", "reject_archive", "archive_immediately", "request_restore", "approve_restore", "reject_restore"]) assert.equal(labels.needsReason("archive", action), true);
  assert.equal(labels.needsReason("approval", "reject"), true);
  assert.equal(labels.needsReason("approval", "request_changes"), true);
  assert.equal(labels.needsReason("approval", "approve"), false);
});
test("conflicts and server errors resolve to localized messages", () => {
  const error = (status, message) => ({ response: { status, data: { message } } });
  assert.equal(labels.workflowError(error(409, "WORKFLOW_VERSION_CONFLICT")), "dwConflict");
  assert.equal(labels.workflowError(error(409, "WORKFLOW_ALREADY_EXISTS")), "dwConflict");
  assert.equal(labels.workflowError(error(400, "WORKFLOW_APPROVERS_MISSING")), "dwReviewersRequired");
  assert.equal(labels.workflowError(error(403, "denied")), "dwForbidden");
  assert.equal(labels.workflowError(error(500, "unknown")), "dwLoadError");
});
test("English and Swedish cover every workflow state and action", () => {
  const translations = load("utils/translation/documentWorkflows.ts");
  assert.deepEqual(Object.keys(translations.enDocumentWorkflows).sort(), Object.keys(translations.svDocumentWorkflows).sort());
  for (const key of [...Object.values(labels.stateKeys), ...Object.values(labels.commandKeys)]) {
    assert.ok(translations.enDocumentWorkflows[key]);
    assert.ok(translations.svDocumentWorkflows[key]);
  }
});
function service() {
  const calls = [];
  const client = {};
  for (const method of ["get", "post", "put"]) client[method] = async (...args) => { calls.push({ method, args }); return { data: { data: { items: [], total: 0 } } }; };
  return { ...load("features/document-workflows/api.ts", { "@/lib/axiosInstance": { default: client } }), calls };
}
const target = { id: "doc", projectId: "project" };
test("policy create, update and transitions preserve parent/version/correlation", async () => {
  const api = service();
  await api.writeWorkflow(target, { archive: null }, { flow: "archive", policy: { allow_immediate: false } });
  assert.equal(api.calls[0].method, "post");
  assert.equal(api.calls[0].args[0], "/document-workflows/professional_project_document/doc/archive");
  assert.deepEqual(plain(api.calls[0].args[1]), { correlation_id: "correlation", reason: "", policy: { allow_immediate: false } });
  await api.writeWorkflow(target, { archive: { version: 8 } }, { flow: "archive", policy: {} });
  assert.equal(api.calls[1].method, "put");
  assert.equal(api.calls[1].args[1].expected_version, 8);
  await api.writeWorkflow(target, { approval: { version: 3 } }, { flow: "approval", command: "reject", reason: "Correction" });
  assert.equal(api.calls[2].args[0], "/document-workflows/professional_project_document/doc/approval/transitions");
  assert.deepEqual(plain(api.calls[2].args[1]), { correlation_id: "correlation", reason: "Correction", expected_version: 3, command: "reject" });
  assert.deepEqual(plain(api.calls[2].args[2]), { params: { parent_id: "project" } });
});
test("context and history retain document identity and server pagination", async () => {
  const api = service();
  await api.getContext(target);
  await api.getHistory(target, "archive", 2);
  assert.equal(api.calls[0].args[0], "/document-workflows/professional_project_document/doc/context");
  assert.deepEqual(plain(api.calls[1].args[1]), { params: { parent_id: "project", page: 2, page_size: 10 } });
});
