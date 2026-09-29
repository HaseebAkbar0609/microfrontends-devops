# TFS-1145 Home Quotes and Modules

Verified Jira requirement: "Connect Quotes and Modules API to Widgets on the Professional Dashboard." The reference screenshot shows Home Quotes and Modules placeholders. Both are now connected; the existing header module launcher is unchanged.

Home persistence location is `dashboard`; only `quotes` is registered as a live source. The five rows reuse available/requested/sent/accepted/archived Offer API totals (page 1, page size 1), not page lengths or fabricated aggregates. Home and Offer widgets share a bounded cache, separated by company and actor. Successful results expire after 60 seconds; failures remain unknown and are not cached as zero. Home provides explicit refresh and a link to the existing Offer dashboard. Other Home widgets remain unavailable.

Deploy the backend registry change before the frontend. No migration or new environment variable is required. Existing authentication, selected-company headers, membership checks and Offer API authorization remain unchanged.

Modules reads the active, non-deleted database catalog through `GET /widgets/modules`, protected by the existing company-membership and Professional-persona dependencies. Explicit per-user module denials are omitted. Known entries reuse existing launcher routes and icons; unknown entries remain read-only, never guessed routes. Empty catalogs and failed requests have different states. The query cache is isolated by company and actor. This is catalog navigation, not a new module entitlement engine; destination API authentication and license enforcement remain unchanged. No claim is made that every catalog module is implemented or licensed to the user.

Verification gates: service tests for zero/nonzero/failure/cache/identity, source registry and membership tests, professional typecheck/lint/production build, then browser checks for refresh/navigation/fullscreen, Swedish/English, company switch and mobile/tablet/desktop/4K. Do not mark browser gates PASS without executing them.
