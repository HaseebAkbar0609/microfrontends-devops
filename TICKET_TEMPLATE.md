# Ticket Execution Checklist: [TICKET-ID] - [Ticket Title]

## 🎯 Gate 1: Figma & Scope Breakdown
- [ ] Figma Node(s) reviewed:
  - [ ] Node: ...
  - [ ] Node: ...
- [ ] List of distinct screens / tabs / modals mapped:
  1. ...
  2. ...
- [ ] Layout specifications confirmed (full width, responsive grids, desktop alignment).
- [ ] Ambiguities resolved with user prior to coding.

---

## 🏗️ Gate 2: Architecture & Translations
- [ ] Swedish translations added to `sv.ts`.
- [ ] English translations added to `en.ts`.
- [ ] Type definition and keys added to `constants.ts`.
- [ ] Modular file breakdown planned (<150-200 lines per file):
  - [ ] `components/...`
  - [ ] `hooks/...`
  - [ ] `types.ts` / `constants.ts`

---

## ⚡ Gate 3: Implementation & State Rules
- [ ] Create form initialized with clean, empty state (no prefill leakage).
- [ ] Multi-tab / multi-step validation implemented (all tabs validated on submit).
- [ ] Unique IDs generated dynamically for dynamic items / uploads.
- [ ] Confirmation modals implemented for destructive / critical mutations.
- [ ] Navigation / Back buttons tested and working seamlessly.

---

## 🧪 Gate 4: Self-QA Matrix
- [ ] **Create Flow**: Blank form -> Validation errors -> Successful submission.
- [ ] **Edit Flow**: Prepopulated data -> Form modification -> Successful update.
- [ ] **View / Detail Flow**: Full width -> Tab switching -> Action menus.
- [ ] **Language Check**: Verified in Swedish and English (no missing keys).

---

## 🚀 Gate 5: Pipeline Pre-flight Verification
- [ ] `pnpm --filter @tfs/professional typecheck` (0 errors)
- [ ] `pnpm --filter @tfs/professional lint` (0 warnings/errors)
- [ ] `pnpm --filter @tfs/professional build` (Build passed)
