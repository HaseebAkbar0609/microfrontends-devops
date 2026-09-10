const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const axiosCalls = [];
const axiosMock = {
  async get(url, config) {
    axiosCalls.push({ url, config });
    return {
      data: {
        success: true,
        message: 'PROJECTS_LISTED_FOR_QUOTE',
        data: {
          items: [{
            id: 'project-1',
            project_code: 'PRJ-001',
            project_name: 'Kitchen renovation',
            project_type: 'b2c',
            municipality: 'Stockholm',
            categories: [{ id: 'cat-1', name: 'Renovation' }],
            created_at: 1767225600,
            taken_count: 2,
            hit_count: 7,
            is_bookmark: true,
          }],
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          page_size: 10,
        },
      },
    };
  },
  async post() {
    return { data: {} };
  },
};

const filename = path.resolve(__dirname, '../src/api-actions/offers/index.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, {
  exports: exportsObject,
  require(name) {
    if (name === '@/lib/axiosInstance') return { __esModule: true, default: axiosMock };
    throw new Error(`Unexpected runtime import: ${name}`);
  },
});

test('available offers use the dedicated API and preserve the selected company', async () => {
  const result = await exportsObject.listAvailableOffersAPIAction({
    companyId: 'company-2',
    page: 1,
    pageSize: 10,
    search: 'Kitchen',
  });

  assert.equal(axiosCalls[0].url, '/professionals/quotes/quote-listing/offer_listing_to_quote');
  assert.equal(axiosCalls[0].config.headers['X-Company-ID'], 'company-2');
  assert.equal(axiosCalls[0].config.params.search, 'Kitchen');
  assert.deepEqual(JSON.parse(JSON.stringify(result.items[0])), {
    id: 'project-1',
    idNumber: 'PRJ-001',
    jobName: 'Kitchen renovation',
    date: '2026-01-01',
    type: 'b2c',
    request: '2/7',
    municipality: 'Stockholm',
    category: 'Renovation',
    isFavorite: true,
  });
  assert.equal(result.totalItems, 1);
});

test('available offers fail closed when no company is selected', async () => {
  await assert.rejects(
    exportsObject.listAvailableOffersAPIAction({ page: 1 }),
    /company must be selected/i,
  );
});

test('the available-offers screen never imports dummy rows', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '../src/features/offer/components/OfferList.tsx'),
    'utf8',
  );
  assert.doesNotMatch(source, /DUMMY_OFFERS/);
  assert.match(source, /listAvailableOffersAPIAction/);
});

test('company rows keep both UI and shared auth-context field names', () => {
  const accountsFile = path.resolve(
    __dirname,
    '../src/api-actions/companies/accounts.ts',
  );
  const accountsCompiled = ts.transpileModule(fs.readFileSync(accountsFile, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const accountsExports = {};
  vm.runInNewContext(accountsCompiled, {
    exports: accountsExports,
    require(name) {
      if (name === '@/lib/axiosInstance') return { __esModule: true, default: axiosMock };
      throw new Error(`Unexpected runtime import: ${name}`);
    },
  });

  const row = accountsExports.mapItemToRow({
    id: 'company-1',
    company_name: 'Real Company AB',
    organization_number: '556677-8899',
    category_info: { id: 'category-1', name: 'Construction' },
  });
  assert.equal(row.id, 'company-1');
  assert.equal(row.company_id, 'company-1');
  assert.equal(row.companyName, 'Real Company AB');
  assert.equal(row.company_name, 'Real Company AB');
  assert.equal(row.company_category, 'Construction');
  assert.equal(row.orgNo, '556677-8899');
  assert.equal(row.organization_number, '556677-8899');
  assert.equal(row.category, 'Construction');
  assert.equal(row.status, 'active');
});

test('company selection refreshes subscription routing before navigation', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '../src/app/(auth)/my-companies/page.tsx'),
    'utf8',
  );
  const selectCompany = source.indexOf('authStorage.setCompanyData(company)');
  const updateContext = source.indexOf('setCompany(company)');
  const refreshStatus = source.indexOf('await getSubscriptionOverview()');
  const setCookie = source.indexOf('setRequiresSubscriptionCookie(requiresSubscription)');
  const navigate = source.indexOf('router.replace(');
  assert.ok(selectCompany >= 0 && selectCompany < refreshStatus);
  assert.ok(updateContext > selectCompany && updateContext < refreshStatus);
  assert.ok(refreshStatus < setCookie && setCookie < navigate);
});
