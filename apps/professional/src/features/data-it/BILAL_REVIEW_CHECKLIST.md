# Bilal's Mandatory Review Checklist & Quality Standards

This document establishes the strict quality standards and pre-PR checklist enforced by Bilal and the TFS review guidelines. Every pull request must be checked against this list before submission.

---

## 📋 Pre-PR Verification Matrix

| Checklist Item | Description | Status |
|---|---|:---:|
| **1. Zero Hardcoding** | No raw text strings in TSX/TS. All labels, buttons, tooltips, toasts, and aria-labels use `localizationConstants`. | ✅ PASS |
| **2. Named Number & Business Constants** | Business numbers (percentages, thresholds, delays, VAT, etc.) are declared in `*.constants.ts`. | ✅ PASS |
| **3. Localization 1:1 Parity** | Every key added to `sv.ts` has an exact counterpart in `en.ts`. No Swedish terms in English UI or vice versa. | ✅ PASS |
| **4. Architectural Layout Hierarchy** | Follows the established two-level navigation pattern (e.g., `Economy` / `Financial Management`):<br>• Level 1 Module Header with Level 1 tabs<br>• Section `PageHeader` (Title & Breadcrumbs)<br>• Level 2 RouteTabs (with first tab being `Dashboard`)<br>• No duplicated second header inside dashboard | ✅ PASS |
| **5. Component Modularity** | No monolithic TSX files (>150–200 lines). Views are decomposed into modular sub-components. | ✅ PASS |
| **6. Unified Widget States** | Base `DashboardWidget` UX implemented with Default, Active, Disabled, Loading, Empty, Modal Expansion, and Drag-and-Drop states. | ✅ PASS |
| **7. No Broken Links / 404s** | Every tab item in the navigation configuration points to an existing, valid page or clean placeholder. | ✅ PASS |
| **8. Pipeline Pre-flight (Typecheck)** | `pnpm --filter @tfs/professional typecheck` passes with **0 errors**. | ✅ PASS |
| **9. Pipeline Pre-flight (Lint)** | `eslint` passes with **0 warnings** and **0 errors**. | ✅ PASS |
| **10. Local Runtime Pre-flight** | All routes compile and render HTTP 200 on the local Next.js dev server. | ✅ PASS |

---

## 🔍 Detailed Review Criteria Breakdown

### 1. Localization & String Cleanliness
- Move all storage keys (`localStorage`, `sessionStorage`) to `*.constants.ts`.
- Declare all units (e.g., `st`, `units`, `SEK`, `kr`, `dagar kvar`, `hours ago`) in localization files.
- Ensure all aria-labels (`aria-label`, `aria-description`) are localized.
- Empty states must use `localizationConstants.empty*Title` and `localizationConstants.empty*Desc`.

### 2. Navigation & Header Rules (The 5 Rules)
1. **Rule 1**: Every module has exactly one primary tab row (Line style), fixed under the module title.
2. **Rule 2**: Directly beneath the primary tabs is the section title and breadcrumbs (`Home > Module > [Module] > [Section]`).
3. **Rule 3**: Level 2 sub-tabs (Line style) sit directly below the breadcrumbs. The first sub-tab is `Dashboard`.
4. **Rule 4**: Sub-pages and dashboards must never render a second duplicate `PageHeader` or duplicate breadcrumb row.
5. **Rule 5**: The `Rearrange` button lives on the top-right of the dashboard content or rail (`DashboardRearrangeRail` with `showToggle={true}`).

### 3. Widget Card System
- Use `cardVariant="default"` by default to ensure white card background, subtle border, rounded corners, status dot, and action menu.
- Enable smooth drag-and-drop customization and persistence with local storage keys.
- Ensure confirmation/discard dialogs or actions on high-impact state changes.

---

*Last Updated for TFS-1149 (Data IT Dashboard & Tab Navigation).*
