import type {
	MaterialArticle,
	MaterialDepot,
	MaterialStockEntry,
	MaterialStockKpis,
	MaterialStockPage,
	MaterialStockQuery,
	MaterialStockRow,
	MaterialStockSortField,
	SortOrder,
	StockFilter,
	StockStatus,
} from "../types/materialStorage.types";

// Only type imports here: tests/material-stock-overview.test.cjs runs this file on its own.

/** Sorting on Status goes from healthy to empty. */
const STATUS_RANK: Record<StockStatus, number> = {
	inStock: 0,
	lowStock: 1,
	outOfStock: 2,
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

/** What can still be taken out has reached the minimum level. An empty shelf counts as low too. */
export function isLowStock(
	row: Pick<MaterialStockRow, "available" | "minStockLevel">,
): boolean {
	return row.available <= row.minStockLevel;
}

export function isAtReorderPoint(
	row: Pick<MaterialStockRow, "available" | "reorderPoint">,
): boolean {
	return row.available <= row.reorderPoint;
}

export function getStockStatus(
	inStock: number,
	available: number,
	minStockLevel: number,
): StockStatus {
	if (inStock <= 0) return "outOfStock";
	return available <= minStockLevel ? "lowStock" : "inStock";
}

/** Joins each stock entry with its article and depot and fills in the derived figures. */
export function buildStockRows(
	articles: MaterialArticle[],
	depots: MaterialDepot[],
	entries: MaterialStockEntry[],
): MaterialStockRow[] {
	const articleById = new Map(articles.map((article) => [article.id, article]));
	const depotById = new Map(depots.map((depot) => [depot.id, depot]));

	return entries.flatMap((entry) => {
		const article = articleById.get(entry.articleId);
		const depot = depotById.get(entry.depotId);
		if (!article || !depot) return [];

		const available = Math.max(entry.inStock - entry.reserved, 0);
		return [
			{
				...article,
				...entry,
				id: `${entry.articleId}_${entry.depotId}`,
				depotName: depot.name,
				available,
				stockValue: roundMoney(entry.inStock * article.purchasePrice),
				status: getStockStatus(entry.inStock, available, article.minStockLevel),
			},
		];
	});
}

/** The KPI cards summarise the whole depot, whatever the table is filtered on. */
export function computeDepotKpis(
	rows: MaterialStockRow[],
	depotId: string,
): MaterialStockKpis {
	const totals = rows
		.filter((row) => row.depotId === depotId)
		.reduce<MaterialStockKpis>(
			(sum, row) => ({
				stockValue: sum.stockValue + row.stockValue,
				articlesInStock: sum.articlesInStock + (row.inStock > 0 ? 1 : 0),
				lowStockCount: sum.lowStockCount + (isLowStock(row) ? 1 : 0),
				reorderPointCount: sum.reorderPointCount + (isAtReorderPoint(row) ? 1 : 0),
				reservedValue: sum.reservedValue + row.reserved * row.purchasePrice,
			}),
			{ stockValue: 0, articlesInStock: 0, lowStockCount: 0, reorderPointCount: 0, reservedValue: 0 },
		);

	return {
		...totals,
		stockValue: roundMoney(totals.stockValue),
		reservedValue: roundMoney(totals.reservedValue),
	};
}

function matchesStockFilter(row: MaterialStockRow, filter: StockFilter): boolean {
	if (filter === "lowStock") return isLowStock(row);
	if (filter === "reserved") return row.reserved > 0;
	return true;
}

function compareRows(
	a: MaterialStockRow,
	b: MaterialStockRow,
	field: MaterialStockSortField,
): number {
	if (field === "status") return STATUS_RANK[a.status] - STATUS_RANK[b.status];
	const left = a[field];
	const right = b[field];
	if (typeof left === "number" && typeof right === "number") return left - right;
	return String(left).localeCompare(String(right), "sv", { numeric: true });
}

export function sortStockRows(
	rows: MaterialStockRow[],
	sortBy: MaterialStockSortField | null,
	sortOrder: SortOrder,
): MaterialStockRow[] {
	if (!sortBy) return rows;
	const direction = sortOrder === "desc" ? -1 : 1;
	return [...rows].sort((a, b) => compareRows(a, b, sortBy) * direction);
}

/** One page of a depot's stock, filtered and sorted the way the table asks for it. */
export function queryStockPage(
	rows: MaterialStockRow[],
	query: MaterialStockQuery,
): MaterialStockPage {
	const term = query.search.trim().toLowerCase();
	const filtered = rows.filter(
		(row) =>
			row.depotId === query.depotId &&
			(!query.categoryId || row.categoryId === query.categoryId) &&
			matchesStockFilter(row, query.stockFilter) &&
			(!term ||
				[row.articleNo, row.name, row.supplierName].some((value) =>
					value.toLowerCase().includes(term),
				)),
	);

	const lastPage = Math.max(1, Math.ceil(filtered.length / query.pageSize));
	const page = Math.min(Math.max(1, query.page), lastPage);
	const start = (page - 1) * query.pageSize;

	return {
		rows: sortStockRows(filtered, query.sortBy, query.sortOrder).slice(
			start,
			start + query.pageSize,
		),
		totalItems: filtered.length,
		page,
	};
}
