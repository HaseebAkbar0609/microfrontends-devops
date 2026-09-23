# TFS-1081 widget sources

The dashboard layout API stores widget placement; it does not provide business metrics. The professional frontend now asks `GET /api/v1/widgets/sources/{location}` which widget IDs have an implemented data source for the selected company. This endpoint requires an active company membership. Agreement sources additionally require OWNER or MANAGER, matching the agreement KPI API.

Connected sources:

- `offer_dashboard`: requested, available, offered, accepted, and archived offer counts from the existing offer listing APIs. The overview, value, activity, statistics, AI, calendar, news, and image widgets remain unavailable because their calculations or data sources are not defined.
- `agreement_dashboard`: total, active, expiring, and pending counts from the existing agreement KPI API. Supplier and search widgets remain unavailable.

Home, calculation, order, project, personnel, KMA, purchase, machines, design, economy, forecast, and B2B have no approved widget metric source yet. `forecast_analysis_dashboard` (TFS-1054, the Prognos Analys page) joins them: its widget ids are `revenueYtd`, `grossMargin`, `forecastAccuracy`, `billableUtilization`, `highRiskProjects` and `totalRiskExposure`, and every card reads as unavailable until the registry lists them. Their cards show a localized source-unavailable state instead of mock values or zeroes. A source-registry request failure is a separate error state, not an empty-data state.

Deploy the backend endpoint before the frontend. To connect another widget, define its data source and calculation, enforce the same company/role boundary on its data API, implement loading/empty/error states in the widget, then add its ID to the backend source registry. Do not mark a widget connected merely because its module has a list endpoint.
