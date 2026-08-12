export type OrderEconomyTab =
	| "contributionMargin"
	| "result"
	| "cost"
	| "revenue";

export interface OrderEconomyRow {
	id: string;
	projectNo: string;
	projectName: string;
	revenueCategory: string;
	revenueCategoryKey: string;
	costCategory: string;
	costCategoryKey: string;
	tbBidrag: number;
	totalRevenue: number;
	totalCost: number;
	resultAmount: number;
}
