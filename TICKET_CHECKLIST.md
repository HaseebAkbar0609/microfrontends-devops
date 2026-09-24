# Ticket Execution Checklist: TFS-1008 - Customer Overview (Register / Kundlista)

## 🎯 Gate 1: Figma & Scope Breakdown
- [x] Figma Node(s) reviewed:
  - [x] Node: 15813-156256 (Register > Kund > Kundlista)
- [x] List of distinct screens / tabs / modals mapped:
  1. Register Page Shell (Dropdown: Kund / Leverantör / Artiklar)
  2. Tab: Kundlista (Customer List)
  3. Action Toolbar: Sök input, Filter dropdown, Importera Kund button, + Registrera nytt button
  4. Data Table: kund nr, Kund, Org nr, Adress, Post nr, Ort, Land, Telefon, Mail, Status, Actions (View & Kebab Menu)
  5. Delete Confirmation Dialog
- [x] Layout specifications confirmed (Full-width, responsive grid, consistent with TFS design system).
- [x] Ambiguities & Figma design flaws resolved:
  - Fixed typo "Aktive" -> "Aktiv" (SE) / "Active" (EN)
  - Standardized "Org nr:" -> "Org nr"
  - Realistic email dummy data ("info@...")
  - Delete action protected by confirmation modal

---

## 🏗️ Gate 2: Architecture & Translations
- [x] Swedish translations verified in `sv.ts`.
- [x] English translations verified in `en.ts`.
- [x] Type definition and keys verified in `constants.ts`.
- [x] Modular file breakdown confirmed (<150-200 lines per file):
  - [x] `RegisterPage.tsx`
  - [x] `CustomerRegisterTable.tsx`
  - [x] `types.ts` / `constants.ts` / API / Mock data fallback

---

## ⚡ Gate 3: Implementation & State Rules
- [x] Table loads with clean UI and resilient mock data fallback if backend is offline.
- [x] Search query filters customer list in real-time or debounced.
- [x] Status filter ("Alla statusar", "Aktiv", "Inaktiv") works dynamically.
- [x] Sorting on columns works seamlessly.
- [x] Pagination (`Rader per sida 10`, page switching) functions properly.
- [x] View button navigates cleanly to customer details (`/tools/register/customer/[id]`).
- [x] Safe delete confirmation modal works without runtime errors.

---

## 🧪 Gate 4: Self-QA Matrix
- [x] **View / List Flow**: Full width -> Tab active -> Search -> Filter -> Sort -> Pagination.
- [x] **Navigation Flow**: Click "Registrera nytt" -> Navigates to `/tools/register/create-customer`.
- [x] **Detail Flow**: Click View (`👁`) -> Navigates to `/tools/register/customer/[id]`.
- [x] **Delete Flow**: Click Delete -> Confirmation modal opens -> Cancel/Confirm.
- [x] **Language Check**: Toggle Swedish and English with zero missing keys.

---

## 🚀 Gate 5: Pipeline Pre-flight Verification
- [x] `pnpm --filter @tfs/professional typecheck` (0 errors)
- [x] `pnpm --filter @tfs/professional lint` (0 warnings/errors)
- [x] `pnpm --filter @tfs/professional build` (Build passed)
