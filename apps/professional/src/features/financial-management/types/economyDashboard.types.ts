export interface HealthScoreDriver {
	id: string;
	labelKey: string;
	value: string | number;
	unit?: string;
	badgeKey?: string;
}

export interface FinancialHealthScoreData {
	score: number;
	maxScore: number;
	statusKey: string;
	statusColor: string;
	cashRunwayMonths: number;
	grossMarginPercent: number;
	overdueArAmount: number;
	overdueInvoicesCount: number;
	suggestedActionKey: string;
}

export interface EconomyOverviewData {
	revenue: number;
	costs: number;
	contributionMargin: number;
	contributionMarginPercent: number;
	netResult: number;
	openInvoicesAr: number;
}

export interface KpiDashboardData {
	billableHours: number;
	utilizationPercent: number;
	avgLeadTimeDays: number;
	quoteConversionPercent: number;
	onTimePaymentsPercent: number;
}

export interface CashFlowData {
	openingCash: number;
	cashIn30Days: number;
	cashOut30Days: number;
	netCashFlow: number;
	forecastCash14Days: number;
}

export interface MarginTrendMonth {
	monthKey: string;
	marginPercent: number;
}

export interface ProfitableJob {
	id: string;
	title: string;
	amount: number;
}

export interface ProfitabilityData {
	grossMarginTrends: MarginTrendMonth[];
	topProfitableJobs: ProfitableJob[];
}

export interface IncomeStatementSnapshotData {
	revenue: number;
	directCosts: number;
	grossProfit: number;
	overheads: number;
	ebit: number;
}

export interface AiEconomyAssistantData {
	suggestedQuestions: string[];
	insightTextKey: string;
	upcomingInvoicesCount: number;
	upcomingInvoicesAmount: number;
}

export interface FinanceCalendarEvent {
	id: string;
	dateStr: string;
	titleKey: string;
	amount?: number;
	color: string;
}

export interface EconomyActivityEvent {
	id: string;
	type: "invoice_sent" | "payment_received" | "expense_approved" | "budget_updated" | "reminder_sent" | "po_created";
	description: string;
	amount?: number;
	timeAgo?: string;
	iconName: string;
}

export interface RevenueSegment {
	id: string;
	titleKey: string;
	amount: number;
	percent: number;
	color: string;
}

export interface AccountsReceivableAging {
	totalOpen: number;
	notDue: number;
	overdue1to30: number;
	overdue31to60: number;
	overdue60Plus: number;
	topOverdueCustomer: string;
	topOverdueAmount: number;
	topOverdueDays: number;
}

export interface AccountsPayableSummary {
	totalOpen: number;
	dueNext7Days: number;
	due8to30Days: number;
	overdue: number;
	largestUpcomingPaymentSupplier: string;
	largestUpcomingPaymentAmount: number;
	largestUpcomingDueDateKey: string;
}

export interface CostCategory {
	id: string;
	titleKey: string;
	amount: number;
	percent: number;
	color: string;
}

export interface InvoicingPipeline {
	draftCount: number;
	draftAmount: number;
	readyCount: number;
	readyAmount: number;
	sentCount: number;
	sentAmount: number;
	creditCount: number;
	creditAmount: number;
}

export interface BudgetItem {
	id: string;
	labelKey: string;
	budgetAmount: number;
	actualAmount: number;
	variancePercent: number;
}

export interface ProjectEconomyItem {
	id: string;
	name: string;
	progressPercent: number;
	marginPercent: number;
	forecastCompletionAmount: number;
}

export interface OrderEconomyData {
	newOrdersCount: number;
	newOrdersAmount: number;
	backlogAmount: number;
	avgExpectedMarginPercent: number;
	largestOrderTitle: string;
	largestOrderAmount: number;
}

export interface EconomyImageBannerData {
	titleKey: string;
	subtitleKey: string;
	ctaKey: string;
	captionKey: string;
}

export interface EconomyNewsItem {
	id: string;
	titleKey: string;
	dateKey: string;
	readMoreKey: string;
}

export interface EconomyDashboardState {
	healthScore: FinancialHealthScoreData;
	overview: EconomyOverviewData;
	kpis: KpiDashboardData;
	cashFlow: CashFlowData;
	profitability: ProfitabilityData;
	incomeStatement: IncomeStatementSnapshotData;
	aiAssistant: AiEconomyAssistantData;
	calendarEvents: FinanceCalendarEvent[];
	recentActivities: EconomyActivityEvent[];
	revenueDistribution: RevenueSegment[];
	accountsReceivable: AccountsReceivableAging;
	accountsPayable: AccountsPayableSummary;
	costDistribution: CostCategory[];
	invoicingPipeline: InvoicingPipeline;
	budgetItems: BudgetItem[];
	projectEconomy: ProjectEconomyItem[];
	orderEconomy: OrderEconomyData;
	imageBanner: EconomyImageBannerData;
	newsItems: EconomyNewsItem[];
}
