# TFS-1045: frontend integration and QA

## Delivery

Professional Tools / My Pages now use the paired backend API under `/api/v1/professionals/my-pages`: diary, time, IT support, meeting protocols, notes, employment documents and absence requests. Existing company/profile APIs remain unchanged. The backend branch is `codex/tfs-1045-tools-my-pages` in `tfs-backend`; its `docs/TFS-1045-my-pages-api.md` defines contracts, examples, authorization and fallback decisions.

Deploy the backend and run `alembic upgrade head` through `e10450000001` before this frontend. No new environment variables, dependencies, billing changes or pipeline changes are introduced.

## Automated checks

- Professional `typecheck` and `lint` pass.
- Professional production `build` passes, including all 170 statically generated pages.
- All 73 existing/new professional Node tests pass, including 9 My Pages contract/schema tests. Run `node --test tests/*.test.cjs` from `apps/professional`.
- Backend's 23 targeted tests pass against real isolated PostgreSQL: persistence, filtering/pagination, foreign user/company access, validation, stale updates, approval rules, private file access, upstream failure, expired write entitlement and project/ATA references.
- The full backend migration chain was applied to an empty PostgreSQL 16 database.

## Browser checks performed locally

These checks used the real backend and PostgreSQL, an isolated synthetic company and private local media storage, not mocked network responses or client DEV data.

| Area | Observed result |
| --- | --- |
| Diary | Empty form displays validation; UTF-8 entry saves and survives reload |
| Time | 09:00-10:30 work entry saves as pending; total is 1:30, not a rounded hour or row count |
| IT support | Ticket submit persists and appears as ongoing |
| Notes | New note saves and appears in the list |
| Meeting | Meeting created with a real company member as responsible person and persisted as sent |
| Employment | Real profile values and explicit missing-data states; contract, payslip and personal document lists use assigned PDFs |
| Private document | Uploaded a real synthetic PDF through the media API, assigned it through the document API, then opened it successfully in the browser PDF viewer |
| Receipt | Confirmation states that this is not an electronic signature; acknowledgment saves and updates the list |
| Leave | Reversed dates are rejected inline; corrected request appears as under review |
| Sick report | Valid request saves, success details appear, and calendar shows the actual sick day |
| Failed request | Backend restart produces an error state; Retry recovers once backend is available |

Desktop screenshots of the meeting dialog, PDF viewer and absence screen were visually inspected. Full mobile/responsive coverage and the client DEV/S3 deployment have NOT been verified in this change.

## Reviewer / QA follow-through

1. Check the backend documentation's explicit fallback decisions. Missing payroll, work schedule, employer contact and employment details are not fabricated. Contracts/payslips need employer-supplied files; receipt acknowledgment is not BankID signing.
2. Test company/user switching, author-only writes, received read-only protocols, draft privacy and owner/manager review actions. Review/assignment APIs are supplied; this is not a new HR administration screen.
3. Use two tabs to edit the same record. The second save must show the stale-version error without overwriting the first change or silently discarding the form.
4. Check sort/filter/page combinations, empty lists, an unavailable backend, PDF signing failure, expired file URLs and retry.
5. Check real awarded project and ATA references on DEV; overhead does not require a project. No fake project options remain.
6. Verify the media flow with DEV's actual private storage and CORS setup; the file viewer intentionally opens a new tab to preserve the existing file CSP.
7. Verify narrow/mobile layouts and keyboard flows in the deployed environment before acceptance.

Register (TFS-717), home analytics, global notification placeholders and the Templates coming-soon screen are outside this delivery. Local checks and PR creation do not mean the entire parent epic is complete or that DEV UAT has passed.
