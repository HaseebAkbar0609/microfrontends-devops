# Stripe catalog sync UI

Independent change targeting dev; companion backend branch: codex/stripe-catalog-sync.

An authorized platform operator sees the link on Team Admin Users and can open `/admin/stripe-catalog`. The existing authenticated client requests capability, a read-only preview, and finally applies its fingerprint after confirmation. Conflicts disable the action; stale previews must be refreshed. Neither tenant owner status alone nor navigating directly grants access.

Backend configuration: `STRIPE_CATALOG_ADMIN_USER_IDS` is a JSON array of explicitly approved TEAM platform operator UUIDs. Empty denies all. Existing API URL, Stripe key/test-mode setting and active company membership remain required. No frontend key or secret is added.

Verified: Team build/typecheck/targeted lint; mandatory Professional typecheck/lint/build; backend unit and isolated PostgreSQL tests in companion PR. Interactive smoke and responsive screenshot review remain pending because local frontend startup was blocked by the execution environment. Client DEV account access and SMTP/Stripe live integration are not claimed by these checks.

Review in English/Swedish at desktop/mobile sizes: denied access, preview, conflicts, stale preview, confirm/cancel, success and repeat no-op. The UI never collects card data or creates charges.
