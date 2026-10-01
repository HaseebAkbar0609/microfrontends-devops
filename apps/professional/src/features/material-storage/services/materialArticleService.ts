import type {
	MaterialArticleDetails,
	MaterialPriceChange,
	MaterialStockEvent,
} from "../types/materialArticle.types";
import { toStockEvents } from "../utils/materialStockEvents";
import { materialMockStore as store, respondWith } from "./materialMockStore";

/** Reads for "Visa artikel" (TFS-1075), answered from the mock store like the other Materialhantering services. */
export const materialArticleService = {
	/** The article and its stock per depot; null when there is no article with this id. */
	getArticleDetails(articleId: string): Promise<MaterialArticleDetails | null> {
		return respondWith(() => {
			const article = store.articles().find((candidate) => candidate.id === articleId);
			if (!article) return null;
			return {
				article: { ...article },
				stock: store.stockRows().filter((row) => row.articleId === articleId),
			};
		});
	},

	/** Every completed stock event of the article, in all depots, newest first. */
	getStockEvents(articleId: string): Promise<MaterialStockEvent[]> {
		return respondWith(() =>
			toStockEvents(
				store.transactions().filter((transaction) => transaction.articleId === articleId),
				Object.fromEntries(store.depots().map((depot) => [depot.id, depot.name])),
				Object.fromEntries(store.linkTargets().map((target) => [target.id, target.reference])),
			),
		);
	},

	/** The article's price changes, newest first. */
	getPriceHistory(articleId: string): Promise<MaterialPriceChange[]> {
		return respondWith(() =>
			store
				.priceHistory()
				.filter((change) => change.articleId === articleId)
				.sort((a, b) => b.date.localeCompare(a.date))
				.map((change) => ({ ...change })),
		);
	},
};
