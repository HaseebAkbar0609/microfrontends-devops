# TFS Frontend - Architecture, Review Standards & Guidelines

This document defines the strict, non-negotiable standards required for all development in the TFS Frontend workspace.

## Edwin's Mandatory Review Checklist

### 1. Zero Hardcoding
- Move all storage keys (`localStorage`/`sessionStorage`) to `*.constants.ts`.
- Move all business defaults, fallbacks, and labels to `localizationConstants` (`constants.ts`, `sv.ts`, `en.ts`).
- Declare all financial and business numbers as named constants (e.g., `VAT_RATE = 0.25`).

### 2. Strict Localization (Swedish & English)
- Never mix Swedish and English terms in UI components.
- Any text added to `sv.ts` must have a matching English counterpart in `en.ts`.

### 3. Component Modularity
- Avoid monolithic TSX files (>150-200 lines). Break complex views into sub-components under a dedicated subdirectory.

### 4. Input Validation & Form UX
- Never save forms or partial updates directly without validating required fields.
- Show inline error messages for invalid fields.

### 5. Safe State Mutations
- Add confirmation dialogs before critical or irreversible actions (e.g. "Mark as Paid", "Credit Invoice").

### 6. Security & Sensitive Data
- Do not store plain-text PII or financial data in `localStorage`. Use in-memory storage or secure encoding layers.

### 7. Performance (Hooks & Memoization)
- Keep `useMemo` dependency arrays granular (e.g., `[data?.lineItems]` instead of `[data]`).

### 8. Pipeline Pre-flight Verification
Always run and pass before creating/updating PRs:
1. `pnpm --filter @tfs/professional typecheck`
2. `pnpm --filter @tfs/professional lint`
3. `pnpm --filter @tfs/professional build`
