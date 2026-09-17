const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "../src");
const constants = new Proxy({}, { get: (_, key) => String(key) });
function load(file, overrides = {}) {
  const filename = path.resolve(root, file);
  const context = { exports: {}, URL, Date, require: name => {
    if (name in overrides) return overrides[name];
    if (name === "@/utils/translation/constants") return { default: constants };
    if (name === "zod") return require("zod");
    if (name.startsWith("@/")) return load(name.slice(2) + ".ts", overrides);
    if (name.startsWith(".")) return load(path.relative(root, path.resolve(path.dirname(filename), name + ".ts")), overrides);
    throw new Error("Unexpected dependency: " + name);
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}
const plain = value => JSON.parse(JSON.stringify(value));
const diary = load("features/tools/diary/schemas/diary.schema.ts").diarySchema;
const time = load("features/tools/time/schemas/time.schema.ts").timeRowSchema;
const ticket = load("features/my-pages/it-support/schemas/itTicket.ts").itTicketSchema;
const absence = load("features/my-pages/employment/schemas/absence.ts");
const protocols = load("features/my-pages/protocol/schemas/protocol.schema.ts");
const row = { date: "2026-09-17", start: "09:00", end: "10:00", type: "overhead", refNr: "", ata: false, ataNr: "", travelUnit: "km", travelValue: "", allowance: false, title: "", description: "" };
test("diary trims whitespace and validates real dates and limits", () => {
  const valid = { title: " Meeting ", projectName: "Project", date: "2026-09-17", description: "Details" };
  assert.equal(diary.parse(valid).title, "Meeting");
  for (const values of [{ title: " " }, { date: "2026-02-30" }, { title: "x".repeat(501) }]) assert.equal(diary.safeParse({ ...valid, ...values }).success, false);
});
test("time rejects reversed, invalid clocks and invalid travel values", () => {
  assert.equal(time.safeParse(row).success, true);
  for (const values of [{ end: "08:00" }, { end: "24:30" }, { start: "9:00" }, { travelValue: "NaN" }, { travelValue: "-1" }, { travelValue: "100001" }, { type: "project" }, { ata: true }, { date: "bad" }]) assert.equal(time.safeParse({ ...row, ...values }).success, false, JSON.stringify(values));
});
test("ticket and absence validations agree with persisted contracts", () => {
  assert.equal(ticket.safeParse({ subject: " ", description: "Issue" }).success, false);
  assert.equal(ticket.safeParse({ subject: "Issue", description: "x".repeat(20001) }).success, false);
  assert.equal(absence.leaveRequestSchema.safeParse({ fromDate: "2026-09-18", toDate: "2026-09-17", message: "" }).success, false);
  assert.equal(absence.sickRequestSchema.safeParse({ startDate: "2026-09-17", expectedBack: "2026-09-17", type: "sick", message: "" }).success, false);
  assert.equal(absence.sickRequestSchema.safeParse({ startDate: "2026-09-17", expectedBack: "", type: "vab", message: "" }).success, true);
});
test("meeting rejects impossible dates and permits an entirely empty next meeting", () => {
  const next = { responsible: "", title: "", category: "", address: "", postalCode: "", city: "", participantIds: [], location: "", startDate: "", startTime: "", endDate: "", endTime: "", information: "" };
  const meeting = { ...next, responsible: "Owner", title: "Review", category: "General", startDate: "2026-09-17", startTime: "09:00", endDate: "2026-09-17", endTime: "10:00" };
  assert.equal(protocols.meetingSchema.safeParse(meeting).success, true);
  assert.equal(protocols.meetingSchema.safeParse({ ...meeting, endTime: "08:00" }).success, false);
  assert.equal(protocols.meetingSchema.safeParse({ ...meeting, startDate: "2026-02-30" }).success, false);
  const edit = { ...meeting, host: "Owner", protocolNumber: "", subject: "", comment: "", next };
  assert.equal(protocols.editProtocolSchema.safeParse(edit).success, true);
  assert.equal(protocols.editProtocolSchema.safeParse({ ...edit, next: { ...next, title: "Incomplete" } }).success, false);
});
test("private file URLs resolve to API origin and reject unsafe schemes", () => {
  const { resolveMyPagesMediaUrl: resolve } = load("features/my-pages/shared/media.ts", { "@/constants/api": { BASE_API_VERSION: "https://api.example.com/api/v1" } });
  assert.equal(resolve("/api/v1/media/files/private?token=test"), "https://api.example.com/api/v1/media/files/private?token=test");
  assert.equal(resolve("https://storage.example.com/doc.pdf"), "https://storage.example.com/doc.pdf");
  for (const value of ["javascript:alert(1)", "//other.example.com", "data:text/html,x"]) assert.throws(() => resolve(value));
});
function api(client, extra = {}) {
  return load("features/my-pages/shared/api.ts", { "@tanstack/react-query": {}, "@/context/AuthContext": {}, "@/lib/axiosInstance": { default: client }, ...extra });
}
test("record writes strip response metadata and carry concurrency version", async () => {
  let request;
  const service = api({ request: async config => { request = config; return { data: { data: { id: "id", version: 3, canEdit: true, data: config.data.data } } }; } });
  const result = await service.saveRecord("diary", { title: "Changed", id: "spoof", version: 2, canEdit: true, createdAt: 1, updatedAt: 1 }, { id: "real", version: 2 });
  assert.deepEqual(plain(request.data), { kind: "diary", data: { title: "Changed" } });
  assert.equal(request.url, "/professionals/my-pages/entries/real");
  assert.deepEqual(plain(request.params), { version: 2 });
  assert.equal(result.version, 3);
});
test("calendar reads all pages and refuses silent truncation", async () => {
  let count = 0;
  const service = api({ get: async (_, { params }) => { count++; return { data: { data: { items: [{ id: String(params.page), data: { title: "Row" } }], total: 2 } } }; } });
  assert.equal((await service.listRecords("diary")).length, 2);
  assert.equal(count, 2);
  const stalled = api({ get: async () => ({ data: { data: { items: [], total: 1 } } }) });
  await assert.rejects(stalled.listRecords("diary"), /RANGE_TOO_LARGE/);
});
test("cache keys separate users and companies", () => {
  let captured;
  const service = api({}, { "@tanstack/react-query": { useQuery: options => { captured = options; } }, "@/context/AuthContext": { useAuthStatus: () => ({ company: { id: "company" }, user: { id: "user" }, isAuthenticated: true }) } });
  service.useMyPagesQuery(["diary"], async () => []);
  assert.deepEqual(plain(captured.queryKey), ["professional-my-pages", "company", "user", "diary"]);
  assert.equal(captured.enabled, true);
});
test("runtime screen modules no longer import mock datasets", () => {
  for (const folder of ["features/tools/diary", "features/tools/time", "features/my-pages/it-support", "features/my-pages/protocol", "features/my-pages/employment"]) {
    for (const entry of fs.readdirSync(path.join(root, folder), { recursive: true })) {
      if (!/\.(tsx|ts)$/.test(entry) || /mockData\.ts|generateContractPdf\.ts/.test(entry)) continue;
      assert.doesNotMatch(fs.readFileSync(path.join(root, folder, entry), "utf8"), /from\s+["'][^"']*mockData["']/, entry);
    }
  }
});
