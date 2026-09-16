# TFS-571 Professional Admin UI

Companion backend branch: `codex/TFS-571-admin-api`. Target for both PRs: `dev`.

## Routes and behavior

- `/admin/user`: user/group tabs, real license summary, same-filter user KPIs, search, access/status/department/group filters, sorting and pagination. License management links to the existing license area; no pretend checkout or seat allocation is added.
- `/admin/user/create`: validated names/email/password confirmation and company metadata, group selections, status, language, phone, permission settings and invitation flag. Waits for server success before returning.
- `/admin/user/settings?userId=...`: fetches the specified membership directly; no fallback to the first user or first page. Uses server editable_fields and allowed_roles. PATCH includes changed editable fields only. Destructive actions and user edits require confirmation; 403/404/409/422 errors remain visible.
- Groups: paginated cards, search/status/parent/sort, create/edit name/description/parent/status/module permissions. Parent and member selectors are searchable/paginated. Existing member changes use dedicated add/remove endpoints, never a partial list overwrite. Duplicate/foreign IDs, cycles and permission ceilings are enforced server-side.
- `/invitation/admin?token=...`: public single-use Professional invitation, no administrator bearer token. New users choose a matching password, existing verified users retain theirs. Token is removed from the URL after acceptance. Uses existing public invitation route handling, without relaxing dashboard guards.
- English and Swedish strings are included. No new browser storage of profiles, credentials or billing data.

## Configuration

Build with the existing `NEXT_PUBLIC_API_URL` / DEV pipeline API URL pointing at the backend containing the companion PR. Backend `FRONTEND_URL` must point at the Professional frontend and existing SMTP must work. No new frontend secret or migration.

## Verification

- `node --test apps/professional/tests/admin-user-contract.test.cjs`: pure request/validation regressions, no browser server.
- `pnpm --filter @tfs/professional typecheck`, `lint`, `build`.
- Still required before QA sign-off: interactive owner/manager/worker smoke, desktop/mobile visual and EN/SV checks, end-to-end invitation inbox delivery on DEV. Local frontend startup was blocked by the execution environment during this run; passing builds and API tests are not a substitute for this smoke test.

Legacy license seat assignment/checkout stubs are outside TFS-571's user/group flow and were not promoted as working billing features. Their existing APIs remain unchanged.
