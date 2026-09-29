import { MATERIAL_MOCK_LATENCY_MS } from "../constants/materialStorage.constants";
import {
	MOCK_MATERIAL_ARTICLES,
	MOCK_MATERIAL_DEPOTS,
	MOCK_MATERIAL_STOCK,
} from "../data/materialStorage.mock";
import type {
	MaterialDepot,
	MaterialStockKpis,
	MaterialStockPage,
	MaterialStockQuery,
} from "../types/materialStorage.types";
import {
	buildStockRows,
	computeDepotKpis,
	queryStockPage,
} from "../utils/materialStockOverview";

/**
 * Data source for Materialhantering. The backend has no depots or stock per depot
 * yet, so this answers from mock data. Filtering, sorting and paging happen here
 * rather than in the UI, so an API client can replace this module without the
 * hooks changing.
 */
const stockRows = buildStockRows(
	MOCK_MATERIAL_ARTICLES,
	MOCK_MATERIAL_DEPOTS,
	MOCK_MATERIAL_STOCK,
);

function respond<T>(value: T): Promise<T> {
	return new Promise((resolve) =>
		setTimeout(() => resolve(value), MATERIAL_MOCK_LATENCY_MS),
	);
}

export const materialStockService = {
	getDepots(): Promise<MaterialDepot[]> {
		return respond(MOCK_MATERIAL_DEPOTS.map((depot) => ({ ...depot })));
	},

	getStockKpis(depotId: string): Promise<MaterialStockKpis> {
		return respond(computeDepotKpis(stockRows, depotId));
	},

	getStockPage(query: MaterialStockQuery): Promise<MaterialStockPage> {
		return respond(queryStockPage(stockRows, query));
	},
};
