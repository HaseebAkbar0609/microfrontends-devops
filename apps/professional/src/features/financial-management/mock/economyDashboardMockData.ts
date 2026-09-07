import localizationConstants from "@/utils/translation/constants";
import type {
	EconomyDashboardState,
	FinancialHealthScoreData,
	EconomyOverviewData,
	KpiDashboardData,
	CashFlowData,
	ProfitabilityData,
	IncomeStatementSnapshotData,
	AiEconomyAssistantData,
	FinanceCalendarEvent,
	EconomyActivityEvent,
	RevenueSegment,
	AccountsReceivableAging,
	AccountsPayableSummary,
	CostCategory,
	InvoicingPipeline,
	BudgetItem,
	ProjectEconomyItem,
	OrderEconomyData,
	EconomyImageBannerData,
	EconomyNewsItem,
} from "../types/economyDashboard.types";

export const BASE_FINANCIAL_HEALTH_SCORE: FinancialHealthScoreData = {
	score: 72,
	maxScore: 100,
	statusKey: localizationConstants.healthScoreStatusMedium,
	statusColor: "text-amber-500 bg-amber-50 border-amber-200",
	cashRunwayMonths: 2.4,
	grossMarginPercent: 31.8,
	overdueArAmount: 185000,
	overdueInvoicesCount: 14,
	suggestedActionKey: localizationConstants.healthScoreActionText,
};

export const BASE_ECONOMY_OVERVIEW: EconomyOverviewData = {
	revenue: 2450000,
	costs: 1710000,
	contributionMargin: 740000,
	contributionMarginPercent: 30.2,
	netResult: 265000,
	openInvoicesAr: 1120000,
};

export const BASE_KPIS: KpiDashboardData = {
	billableHours: 1284,
	utilizationPercent: 78,
	avgLeadTimeDays: 6.2,
	quoteConversionPercent: 42,
	onTimePaymentsPercent: 86,
};

export const BASE_CASH_FLOW: CashFlowData = {
	openingCash: 820000,
	cashIn30Days: 1980000,
	cashOut30Days: 2140000,
	netCashFlow: -160000,
	forecastCash14Days: 740000,
};

export const BASE_PROFITABILITY: ProfitabilityData = {
	grossMarginTrends: [
		{ monthKey: "Maj", marginPercent: 33.1 },
		{ monthKey: "Jun", marginPercent: 30.4 },
		{ monthKey: "Jul", marginPercent: 31.8 },
	],
	topProfitableJobs: [
		{ id: "job-1", title: "Service Avtal – NordFast", amount: 112000 },
		{ id: "job-2", title: "Kitchen Renovation – Berg", amount: 74000 },
		{ id: "job-3", title: "Ventilation Upgrade – Järnvägsgatan", amount: 59000 },
	],
};

export const BASE_INCOME_STATEMENT: IncomeStatementSnapshotData = {
	revenue: 2450000,
	directCosts: 1455000,
	grossProfit: 995000,
	overheads: 730000,
	ebit: 265000,
};

export const BASE_AI_ASSISTANT: AiEconomyAssistantData = {
	suggestedQuestions: [
		localizationConstants.aiQuestionMarginDrop,
		localizationConstants.aiQuestionOverdueCustomers,
		localizationConstants.aiQuestionCashForecast,
	],
	insightTextKey: localizationConstants.aiInsightSupplierInvoices,
	upcomingInvoicesCount: 3,
	upcomingInvoicesAmount: 96400,
};

export const BASE_CALENDAR_EVENTS: FinanceCalendarEvent[] = [
	{
		id: "cal-1",
		dateStr: "29 jul",
		titleKey: localizationConstants.calVatReminder,
		color: "bg-blue-500",
	},
	{
		id: "cal-2",
		dateStr: "01 aug",
		titleKey: localizationConstants.calPayrollRun,
		color: "bg-purple-500",
	},
	{
		id: "cal-3",
		dateStr: "05 aug",
		titleKey: localizationConstants.calSupplierBatch,
		amount: 312000,
		color: "bg-amber-500",
	},
	{
		id: "cal-4",
		dateStr: "07 aug",
		titleKey: localizationConstants.calCustomerFollowup,
		color: "bg-emerald-500",
	},
];

export const BASE_RECENT_ACTIVITIES: EconomyActivityEvent[] = [
	{
		id: "act-1",
		type: "invoice_sent",
		description: "Faktura INV-10421 skickad till ByggPartner AB",
		amount: 78500,
		timeAgo: "2 tim sedan",
		iconName: "FileUp",
	},
	{
		id: "act-2",
		type: "payment_received",
		description: "Betalning mottagen från Lindström Fastigheter",
		amount: 52000,
		timeAgo: "4 tim sedan",
		iconName: "CheckCircle2",
	},
	{
		id: "act-3",
		type: "expense_approved",
		description: "Leverantörsfaktura SUP-8891 godkänd",
		amount: 18300,
		timeAgo: "Igår",
		iconName: "ShieldCheck",
	},
	{
		id: "act-4",
		type: "budget_updated",
		description: "Budget uppdaterad för Projekt ”Åsäter Skola”",
		timeAgo: "1 dag sedan",
		iconName: "TrendingUp",
	},
	{
		id: "act-5",
		type: "reminder_sent",
		description: "Påminnelse skickad: 3 förfallna fakturor",
		timeAgo: "2 dagar sedan",
		iconName: "BellRing",
	},
	{
		id: "act-6",
		type: "po_created",
		description: "Inköpsorder skapad: PO-321",
		amount: 24900,
		timeAgo: "3 dagar sedan",
		iconName: "ShoppingCart",
	},
];

export const BASE_REVENUE_DISTRIBUTION: RevenueSegment[] = [
	{
		id: "rev-service",
		titleKey: localizationConstants.revSegService,
		amount: 1080000,
		percent: 44,
		color: "bg-blue-500",
	},
	{
		id: "rev-projects",
		titleKey: localizationConstants.revSegProjects,
		amount: 920000,
		percent: 38,
		color: "bg-emerald-500",
	},
	{
		id: "rev-maintenance",
		titleKey: localizationConstants.revSegMaintenance,
		amount: 450000,
		percent: 18,
		color: "bg-amber-500",
	},
];

export const BASE_ACCOUNTS_RECEIVABLE: AccountsReceivableAging = {
	totalOpen: 1120000,
	notDue: 705000,
	overdue1to30: 185000,
	overdue31to60: 140000,
	overdue60Plus: 90000,
	topOverdueCustomer: "ByggPartner AB",
	topOverdueAmount: 62500,
	topOverdueDays: 28,
};

export const BASE_ACCOUNTS_PAYABLE: AccountsPayableSummary = {
	totalOpen: 860000,
	dueNext7Days: 312000,
	due8to30Days: 448000,
	overdue: 100000,
	largestUpcomingPaymentSupplier: "MaterialGrossisten",
	largestUpcomingPaymentAmount: 128000,
	largestUpcomingDueDateKey: localizationConstants.dueAug05,
};

export const BASE_COST_DISTRIBUTION: CostCategory[] = [
	{
		id: "cost-materials",
		titleKey: localizationConstants.costMaterials,
		amount: 680000,
		percent: 40,
		color: "bg-blue-600",
	},
	{
		id: "cost-labor",
		titleKey: localizationConstants.costLabor,
		amount: 620000,
		percent: 36,
		color: "bg-indigo-500",
	},
	{
		id: "cost-subcontractors",
		titleKey: localizationConstants.costSubcontractors,
		amount: 240000,
		percent: 14,
		color: "bg-emerald-500",
	},
	{
		id: "cost-vehicles",
		titleKey: localizationConstants.costVehiclesFuel,
		amount: 85000,
		percent: 5,
		color: "bg-amber-500",
	},
	{
		id: "cost-other",
		titleKey: localizationConstants.costOther,
		amount: 85000,
		percent: 5,
		color: "bg-slate-400",
	},
];

export const BASE_INVOICING_PIPELINE: InvoicingPipeline = {
	draftCount: 8,
	draftAmount: 214000,
	readyCount: 5,
	readyAmount: 176000,
	sentCount: 42,
	sentAmount: 2450000,
	creditCount: 2,
	creditAmount: -18500,
};

export const BASE_BUDGET_ITEMS: BudgetItem[] = [
	{
		id: "b-rev",
		labelKey: localizationConstants.budgetRevenue,
		budgetAmount: 2600000,
		actualAmount: 2450000,
		variancePercent: -5.8,
	},
	{
		id: "b-cost",
		labelKey: localizationConstants.budgetCost,
		budgetAmount: 1650000,
		actualAmount: 1710000,
		variancePercent: 3.6,
	},
	{
		id: "b-ebit",
		labelKey: localizationConstants.budgetEbit,
		budgetAmount: 320000,
		actualAmount: 265000,
		variancePercent: -17.2,
	},
];

export const BASE_PROJECT_ECONOMY: ProjectEconomyItem[] = [
	{
		id: "p-1",
		name: "Åsäter Skola",
		progressPercent: 55,
		marginPercent: 24,
		forecastCompletionAmount: 3900000,
	},
	{
		id: "p-2",
		name: "Storgatan Kontor",
		progressPercent: 30,
		marginPercent: 29,
		forecastCompletionAmount: 2100000,
	},
	{
		id: "p-3",
		name: "Lagerutbyggnad",
		progressPercent: 80,
		marginPercent: 34,
		forecastCompletionAmount: 1450000,
	},
];

export const BASE_ORDER_ECONOMY: OrderEconomyData = {
	newOrdersCount: 12,
	newOrdersAmount: 1340000,
	backlogAmount: 6800000,
	avgExpectedMarginPercent: 28,
	largestOrderTitle: "HVAC Service Avtal – NorrBo",
	largestOrderAmount: 420000,
};

export const BASE_IMAGE_BANNER: EconomyImageBannerData = {
	titleKey: localizationConstants.economyImageBannerTitle,
	subtitleKey: localizationConstants.economyImageBannerSubtitle,
	ctaKey: localizationConstants.economyImageBannerCta,
	captionKey: localizationConstants.economyImageCaption,
};

export const BASE_NEWS_ITEMS: EconomyNewsItem[] = [
	{
		id: "news-1",
		titleKey: localizationConstants.newsInvoiceAutomationTitle,
		dateKey: localizationConstants.newsInvoiceAutomationDate,
		readMoreKey: localizationConstants.newsReadMore,
	},
	{
		id: "news-2",
		titleKey: localizationConstants.newsMarginReportingTitle,
		dateKey: localizationConstants.newsMarginReportingDate,
		readMoreKey: localizationConstants.newsReadMore,
	},
	{
		id: "news-3",
		titleKey: localizationConstants.newsBankFeedTitle,
		dateKey: localizationConstants.newsBankFeedDate,
		readMoreKey: localizationConstants.newsReadMore,
	},
];

export const INITIAL_ECONOMY_DASHBOARD_STATE: EconomyDashboardState = {
	healthScore: BASE_FINANCIAL_HEALTH_SCORE,
	overview: BASE_ECONOMY_OVERVIEW,
	kpis: BASE_KPIS,
	cashFlow: BASE_CASH_FLOW,
	profitability: BASE_PROFITABILITY,
	incomeStatement: BASE_INCOME_STATEMENT,
	aiAssistant: BASE_AI_ASSISTANT,
	calendarEvents: BASE_CALENDAR_EVENTS,
	recentActivities: BASE_RECENT_ACTIVITIES,
	revenueDistribution: BASE_REVENUE_DISTRIBUTION,
	accountsReceivable: BASE_ACCOUNTS_RECEIVABLE,
	accountsPayable: BASE_ACCOUNTS_PAYABLE,
	costDistribution: BASE_COST_DISTRIBUTION,
	invoicingPipeline: BASE_INVOICING_PIPELINE,
	budgetItems: BASE_BUDGET_ITEMS,
	projectEconomy: BASE_PROJECT_ECONOMY,
	orderEconomy: BASE_ORDER_ECONOMY,
	imageBanner: BASE_IMAGE_BANNER,
	newsItems: BASE_NEWS_ITEMS,
};
