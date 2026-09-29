export type MaterialUnit = "pcs" | "m" | "m2" | "kg" | "l" | "pkg";

export type MaterialCategoryId =
	| "boards"
	| "timber"
	| "pipes"
	| "electrical"
	| "paint"
	| "fasteners"
	| "insulation";

export type StockStatus = "inStock" | "lowStock" | "outOfStock";

/** The Alla / Lågt saldo / Reserverat switch above the stock table. */
export type StockFilter = "all" | "lowStock" | "reserved";

export type SortOrder = "asc" | "desc";

export interface MaterialDepot {
	id: string;
	name: string;
	/** The depot the overview opens on when none is chosen. */
	isDefault: boolean;
}

export interface MaterialArticle {
	id: string;
	articleNo: string;
	name: string;
	supplierName: string;
	categoryId: MaterialCategoryId;
	unit: MaterialUnit;
	purchasePrice: number;
	salesPrice: number;
	/** Available stock at or below this is low stock. */
	minStockLevel: number;
	/** Available stock at or below this means it is time to order. */
	reorderPoint: number;
}

/** What one depot holds of one article: quantity on the shelf and how much of it is reserved. */
export interface MaterialStockEntry {
	articleId: string;
	depotId: string;
	inStock: number;
	reserved: number;
}

/** One table row: an article's stock in one depot, with the derived figures filled in. */
export interface MaterialStockRow
	extends Omit<MaterialArticle, "id">,
		MaterialStockEntry {
	id: string;
	depotName: string;
	available: number;
	stockValue: number;
	status: StockStatus;
}

export type MaterialStockSortField =
	| "articleNo"
	| "name"
	| "categoryId"
	| "depotName"
	| "inStock"
	| "reserved"
	| "available"
	| "purchasePrice"
	| "salesPrice"
	| "stockValue"
	| "status";

export interface MaterialStockQuery {
	depotId: string;
	search: string;
	categoryId: MaterialCategoryId | null;
	stockFilter: StockFilter;
	sortBy: MaterialStockSortField | null;
	sortOrder: SortOrder;
	page: number;
	pageSize: number;
}

export interface MaterialStockPage {
	rows: MaterialStockRow[];
	totalItems: number;
	/** The page actually returned: a request past the last page gets the last page. */
	page: number;
}

export interface MaterialStockKpis {
	stockValue: number;
	articlesInStock: number;
	lowStockCount: number;
	reorderPointCount: number;
	reservedValue: number;
}
