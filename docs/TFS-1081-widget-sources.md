# TFS-1081 widget sources

The dashboard layout API stores widget placement; it does not provide business metrics. The professional frontend now asks `GET /api/v1/widgets/sources/{location}` which widget IDs have an implemented data source for the selected company. This endpoint requires an active company membership. Agreement sources additionally require OWNER or MANAGER, matching the agreement KPI API.

Connected sources:

- `offer_dashboard`: requested, available, offered, accepted, and archived offer counts from the existing offer listing APIs. The overview, value, activity, statistics, AI, calendar, news, and image widgets remain unavailable because their calculations or data sources are not defined.
- `agreement_dashboard`: total, active, expiring, and pending counts from the existing agreement KPI API. Supplier and search widgets remain unavailable.

Home, calculation, order, project, personnel, KMA, purchase, machines, design, economy, forecast, and B2B have no approved widget metric source yet. `forecast_analysis_dashboard` (TFS-1054, the Prognos Analys page) joins them: its widget ids are `revenueYtd`, `grossMargin`, `forecastAccuracy`, `billableUtilization`, `highRiskProjects`, `totalRiskExposure`, `financialSummary`, `projectPerformance`, `forecastTrends`, `riskOpportunities` and `opportunities`, and every card reads as unavailable until the registry lists them. `forecast_key_figures_dashboard` (TFS-1055, the Nyckeltal tab) carries those same six KPI ids plus `forecastQuality`, `keyFigureRisks`, `cashFlow`, `projectProfitability`, `utilizationRates` and `cumulativeProfit`. Their cards show a localized source-unavailable state instead of mock values or zeroes. A source-registry request failure is a separate error state, not an empty-data state.

Deploy the backend endpoint before the frontend. To connect another widget, define its data source and calculation, enforce the same company/role boundary on its data API, implement loading/empty/error states in the widget, then add its ID to the backend source registry. Do not mark a widget connected merely because its module has a list endpoint.

## HTTP contract

All paths below are relative to `/api/v1`. Requests require `Authorization: Bearer <token>` and `X-Company-ID: <active company ID>`; the backend verifies active company membership. The registry returns `401` without authentication, `403` for an inaccessible company or for a non-OWNER/non-MANAGER requesting Agreement sources, and `422` for a malformed location. Unexpected server errors return the standard JSON error envelope and are logged by the backend's global exception handler with a correlation ID. A well-formed but unconnected location returns `200` with an empty list; it is not an error.

| Widget | Request | Value read |
| --- | --- | --- |
| Source registry | `GET /widgets/sources/{location}`; location is a lower-case identifier of at most 64 characters | `data.location`, `data.live_widget_ids: string[]` |
| Offer available projects | `GET /professionals/quotes/quote-listing/offer_listing_to_quote?page=1&page_size=1` | `data.total_items` |
| Offer requested, sent, accepted, history | `GET /professionals/quotes/quote-listing/offer_listing_by_status?status={requested|offered|accepted|archived}&page=1&page_size=1` | top-level `total_items`; status maps to the respective widget |
| Agreement total, active, expiring, pending | `GET /professionals/agreement/dashboard-kpis` | `data.totalAgreements`, `data.activeAgreements`, `data.expiringSoon`, `data.pendingSignature` |

The registry success envelope is `{ "success": true, "message": string, "data": { "location": string, "live_widget_ids": string[] } }`. Failed requests use the application's `{ "success": false, "message": string, "details"?: unknown }` envelope. Offer count requests use page 1 and page size 1 because only the total is displayed; they do not apply date or sort parameters. The underlying listing APIs have their own paging and search contracts for list screens, not for these widgets. Agreement KPI has no list filters. Unfinished widgets have no business API contract and must show the localized source-unavailable state.

The frontend distinguishes registry loading, source unavailable, live zero, live data error and success. An individual Offer count failure affects only its own widget; successful sibling counts remain visible. A failed count is not cached as zero. Agreement uses one KPI response for four values, so an error in that request affects those four widgets together. Backend API failures are captured by the existing global exception logging. A separate alerting/monitoring destination is not configured by this feature and must not be claimed as verified.
