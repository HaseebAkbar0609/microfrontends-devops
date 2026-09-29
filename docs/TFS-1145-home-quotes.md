# Home Quotes and empty Modules section

Implementation scope follows the conversation: connect Home Quotes to existing APIs and hide the undefined Modules section without duplicating or modifying the header module launcher. The Jira ticket text was not accessible during this implementation and must be compared before acceptance.

Home persistence location is `dashboard`; only `quotes` is registered as a live source. The five rows reuse available/requested/sent/accepted/archived Offer API totals (page 1, page size 1), not page lengths or fabricated aggregates. Home and Offer widgets share a bounded cache, separated by company and actor. Successful results expire after 60 seconds; failures remain unknown and are not cached as zero. Home provides explicit refresh and a link to the existing Offer dashboard. Other Home widgets remain unavailable.

Deploy the backend registry change before the frontend. No migration or new environment variable is required. Existing authentication, selected-company headers, membership checks and Offer API authorization remain unchanged.

Verification gates: service tests for zero/nonzero/failure/cache/identity, source registry and membership tests, professional typecheck/lint/production build, then browser checks for refresh/navigation/fullscreen, Swedish/English, company switch and mobile/tablet/desktop/4K. Do not mark browser gates PASS without executing them.
