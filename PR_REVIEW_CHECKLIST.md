# 📋 Mandatory Pre-PR Checklist: TFS Frontend & Bilal's Review Standards

> **MANDATORY BEFORE EVERY PR**: Complete every single checkbox in this document before submitting or requesting a review.
> Bilal reviews every pull request with extreme attention to detail—down to derived metrics, localization purity, icon semantics, and route architecture.

---

## 🚦 Gate 0: PR & Repository Hygiene (Zero Clutter)

- [ ] **NO Personal Notes or Checklists in `src/`**:
  - ❌ Never commit files like `BILAL_REVIEW_CHECKLIST.md`, `TODO.md`, or test notes inside `apps/*/src/...`.
  - ✅ All repo documentation belongs in root (`/`), `/docs/`, or `.agents/rules/`.
- [ ] **NO Unused Dead Files or Wrappers**:
  - ❌ No unused `*Page.tsx`, duplicate sub-route wrappers, or abandoned test files.
  - ✅ Check that every exported component is actually consumed or intended as a public module API.
- [ ] **Unused Import & Variable Check**:
  - Run linting to confirm zero unused imports, variables, or functions.
- [ ] **Commit Message Format**:
  - ❌ `wip`, `fixes`, `update data it`, `fix pr comments`
  - ✅ Must strictly follow: `TFS-<TICKET_ID>: imperative summary`  
    *(e.g., `TFS-1149: resolve PR review feedback on derived metrics, translations, widget states, and URL structure`)*
  - ⚠️ Force-push is blocked on Bitbucket—never attempt `git push --force`.
- [ ] **Accurate PR Description**:
  - Do NOT claim widgets are "tested with live backend data" when backend sources (`LIVE_WIDGET_SOURCES`) do not exist.
  - Do NOT describe a page as a "redirect" unless it actually executes `redirect()`.
  - Accurately describe mock fallbacks and implementation scope.

---

## 🌐 Gate 1: URL & Route Architecture

- [ ] **Single Canonical Route (No Duplicate URLs)**:
  - ❌ A dashboard accessible at both `/data-it` and `/data-it/dashboard`.
  - ✅ Pick one established pattern:
    - **Economy Pattern**: Root path hosts the dashboard directly (`/module/business-support/data-it`). Delete `/dashboard/page.tsx`.
    - **Agreement Pattern**: Root path redirects via `redirect("/module/business-support/data-it/dashboard")`.
- [ ] **Active Tab Highlighting**:
  - Verify route tabs highlight correctly when viewing the page.
  - If a tab has `exact: true`, ensure the target URL matches exactly and doesn't get lost on child paths.
- [ ] **Predictable Navigation**:
  - Verify back buttons, tab switches, and breadcrumbs return cleanly without broken state.

---

## 🧮 Gate 2: State Rules & Derived Metrics (The #634, #642, #650 Rule)

> ⚠️ **CRITICAL**: Never store numbers, totals, percentages, or time deltas that can be calculated from underlying data. Stored numbers drift and disagree.

- [ ] **Derived Totals & Counts**:
  - ❌ Storing `openTickets: 6` in mock state when only 3 ticket items exist in the array.
  - ✅ Derive in hook: `openTickets = supportTickets.length`.
  - ❌ Storing `totalDevices: 148` next to category counts.
  - ✅ Derive in hook: `totalDevices = categories.reduce((sum, c) => sum + c.count, 0)`.
- [ ] **Derived Percentages**:
  - ❌ Storing `percentage: 46` in category objects.
  - ✅ Derive in hook: `percentage = total > 0 ? Math.round((count / total) * 100) : 0`.
- [ ] **Dynamic Expiry & Days Left**:
  - ❌ Storing static `daysLeft: 14` alongside `expiryDate`. It becomes incorrect tomorrow.
  - ✅ Calculate dynamically against `today` (`Math.ceil((exp - today) / MS_PER_DAY)`).
  - ❌ Declaring `DATA_IT_EXPIRY_THRESHOLD_DAYS` but never using it.
  - ✅ Actually use the threshold to filter active/expiring items or remove the constant.
- [ ] **NO Fake Refresh Handlers**:
  - ❌ `onRefresh` that does `Math.max(0, ...)` with an artificial `setTimeout(..., 600)` delay and a fake "Refreshed" toast. This creates new state object references and unnecessarily resets parent widgets.
  - ✅ Omit `onRefresh` until a real API fetch hook exists.
- [ ] **Hook Return Purity**:
  - ❌ Exposing `setState` or internal setters from custom hooks when nothing consumes them.
  - ✅ Only return the state properties and handlers the component actually uses.

---

## 🧩 Gate 3: Widget Architecture & Component Modularity

- [ ] **Zero Data in Component TSX**:
  - ❌ Declaring `const SECURITY_ITEMS = [...]` or system arrays inside widget `.tsx` files.
  - ✅ Move mock/initial data to `initial*State` in `*.mock.ts` and pass down via props.
- [ ] **Strict Typing for Translations & Values**:
  - ❌ `labelKey: string`, `valueKey: string`
  - ✅ `labelKey: TranslationKeys`, `value: number | TranslationKeys`
  - ❌ Storing `"98.4%"` as a string and doing `valueKey.includes("%")` in JSX.
  - ✅ Use numeric fields (`value: 98.4`, `isPercentage: true`) or dedicated types.
- [ ] **No Contradictory Statuses**:
  - ❌ "Pending patches" labeled as "Operational" with a warning icon.
  - ✅ "Pending patches" labeled as `dataItPending` (`Väntande` / `Pending`) with a count (e.g., `2`).
- [ ] **Proper Empty State Handling**:
  - ❌ Passing `isEmpty`, `emptyTitle`, `emptyDescription` to widgets wrapped by `ModuleWidgetDashboard` (they get overridden).
  - ❌ Rendering a blank card or empty container when arrays are empty (`length === 0`).
  - ✅ Provide a dedicated inline empty fallback inside each widget (e.g. icon + localized empty text).
- [ ] **File Size Budget**:
  - ✅ Every TSX file MUST be under 150-200 lines. Break large widgets into sub-components.

---

## 🌍 Gate 4: Localization & Formatting Purity

- [ ] **Zero Swedish Text in English UI**:
  - ❌ Mock timestamp: `createdTime: "1h sedan"`.
  - ✅ Store ISO timestamp (`new Date().toISOString()`) and format dynamically with localized relative time (`{count}h ago` in EN, `för {count} tim sedan` in SV).
  - ❌ Swedish mock subjects in English mode: `"VPN och nätverksåtkomst efter OS-uppdatering"`.
  - ✅ Use language-neutral IT mock subjects (e.g., `"VPN and network connectivity issues after OS patch"`).
  - ❌ Swedish hardware names: `"Skärmar"` in mock lists.
  - ✅ Use neutral terms (`"Monitors"`, `"Dell UltraSharp"`).
- [ ] **No Hardcoded Locale Formatters**:
  - ❌ `amount.toLocaleString("sv-SE")` in component code.
  - ✅ Always use workspace utility `formatCurrency(amount)` from `@/utils/formatters` or `intl`.
- [ ] **No Embedded Quantities**:
  - ❌ Item name: `"Dell Latitude 5540 (x4)"`.
  - ✅ Item name: `"Dell Latitude 5540"`, with `quantity: 4` passed and rendered via a quantity column or badge.
- [ ] **Swedish Spelling, Capitalization & Compound Words**:
  - ❌ `"Inköps Utrustning"` ➔ ✅ `"Inköp utrustning"`
  - ❌ `"Kpi-data-it-översikt"` ➔ ✅ `"KPI Data-IT översikt"`
- [ ] **Accessible Aria Labels**:
  - ❌ `ariaLabel="Data IT sections"` (hardcoded English in JSX).
  - ✅ `ariaLabel={t(localizationConstants.dataItAriaSections)}`.
- [ ] **No Duplicate Keys**:
  - ❌ Creating `dataItDocuments` and `dataItArchive` when `documentCenterItem` and `archiveItem` already exist.
  - ✅ Search existing `constants.ts` before creating new keys.
- [ ] **Prune Unused Translation Keys**:
  - Search `constants.ts`, `sv.ts`, and `en.ts` to ensure 100% of newly added keys are actually rendered. Remove unused keys.
- [ ] **1:1 Swedish & English Parity**:
  - Every key in `sv.ts` must have a corresponding entry in `en.ts` with natural phrasing.

---

## 🎨 Gate 5: UI Semantics, Icons & Action Discipline

- [ ] **Semantic Icon Usage**:
  - ❌ Reusing `Coins` for warranty AND quick actions, or `Shield` for purchases.
  - ✅ Distinct icons: Warranty ➔ `Clock`, Purchases ➔ `ShoppingCart`, Quick Actions ➔ `Zap`, Security ➔ `Shield`.
- [ ] **Standard Component Overrides**:
  - ❌ Overriding `discardLabel` on `DashboardRearrangeRail` with custom keys that mismatch other dashboards.
  - ✅ Use default props unless an explicit feature specification requires a custom label.
- [ ] **Honest Action Feedback**:
  - ❌ Clicking "Register new equipment" displays toast `"New equipment was registered successfully."` when nothing was registered.
  - ✅ Either navigate to the real destination (`/module/business-support/data-it/equipment`), or display a neutral info toast (`"Coming soon"` / `"Funktionen är under utveckling"`).

---

## 🚀 Gate 6: Pipeline Pre-flight Verification (All 3 Must Pass)

Run all three commands locally in terminal and confirm 0 errors and 0 warnings:

```bash
# 1. Typecheck (0 errors)
pnpm --filter @tfs/professional typecheck

# 2. Linter (0 warnings, 0 errors)
pnpm --filter @tfs/professional lint

# 3. Production Build (Must build cleanly)
pnpm --filter @tfs/professional build
```

---

## 📝 Quick Self-Review Sign-off Template (Copy into PR Description)

```markdown
### Pre-PR Review Sign-off
- [x] Repository hygiene: No personal notes/checklists in src; all dead files removed.
- [x] Routing: Canonical URL verified; tab highlighting matches active route.
- [x] Derived state: All totals, counts, percentages, and days-left calculated via useMemo (zero hardcoded totals).
- [x] Widget decoupling: Zero data defined inside TSX components; strict TranslationKeys used.
- [x] Empty states: Inline empty fallbacks implemented on all collection widgets.
- [x] Localization: 100% SV/EN parity; ISO dates with localized relative time; formatCurrency used.
- [x] UI & Icons: Distinct semantic icons; honest action routing/feedback.
- [x] Pre-flight: typecheck (0 errors), lint (0 errors), build (clean).
```
