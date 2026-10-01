import type {
	MaterialArticle,
	MaterialDepot,
	MaterialStockKpis,
	MaterialStockPage,
	MaterialStockQuery,
} from "../types/materialStorage.types";
import type { MaterialStockLevel } from "../types/materialTransaction.types";
import { computeDepotKpis, queryStockPage } from "../utils/materialStockOverview";
import { materialMockStore as store, respondWith } from "./materialMockStore";

/**
 * Reads for Materialhantering. The backend has no depots or stock per depot yet,
 * so this answers from the mock store. Filtering, sorting and paging happen here
 * rather than in the UI, so an API client can replace this module without the
 * hooks changing.
 */
export const materialStockService = {
	getDepots(): Promise<MaterialDepot[]> {
		return respondWith(() => store.depots().map((depot) => ({ ...depot })));
	},

	getArticles(): Promise<MaterialArticle[]> {
		return respondWith(() => store.articles().map((article) => ({ ...article })));
	},

	/** Supplier names from the articles, alphabetically. */
	getSuppliers(): Promise<string[]> {
		return respondWith(() =>
			[...new Set(store.articles().map((article) => article.supplierName))].sort((a, b) =>
				a.localeCompare(b, "sv"),
			),
		);
	},

	getStockKpis(depotId: string): Promise<MaterialStockKpis> {
		return respondWith(() => computeDepotKpis(store.stockRows(), depotId));
	},

	getStockPage(query: MaterialStockQuery): Promise<MaterialStockPage> {
		return respondWith(() => queryStockPage(store.stockRows(), query));
	},

	/** The articles a depot carries, even with none left: what "Ta ut material" can choose from. */
	getDepotArticleIds(depotId: string): Promise<string[]> {
		return respondWith(() =>
			store
				.stockEntries()
				.filter((entry) => entry.depotId === depotId)
				.map((entry) => entry.articleId),
		);
	},

	/** One article's stock in one depot; all zero when the depot does not carry it. */
	getStockLevel(articleId: string, depotId: string): Promise<MaterialStockLevel> {
		return respondWith(() => {
			const row = store
				.stockRows()
				.find((candidate) => candidate.articleId === articleId && candidate.depotId === depotId);
			return {
				inStock: row?.inStock ?? 0,
				reserved: row?.reserved ?? 0,
				available: row?.available ?? 0,
			};
		});
	},
};
