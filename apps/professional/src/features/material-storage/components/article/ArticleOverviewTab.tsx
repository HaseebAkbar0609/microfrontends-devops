"use client";

import type { MaterialArticleDetails } from "../../types/materialArticle.types";
import type { MaterialDepot } from "../../types/materialStorage.types";
import { ArticleDepotStockCard } from "./ArticleDepotStockCard";
import { ArticleInfoCard } from "./ArticleInfoCard";
import { ArticlePriceCard } from "./ArticlePriceCard";
import { ArticleRecentEvents } from "./ArticleRecentEvents";
import { ArticleStockFigures } from "./ArticleStockFigures";

interface ArticleOverviewTabProps {
	details: MaterialArticleDetails;
	depots: MaterialDepot[];
	depotId: string;
}

/**
 * The Figma "Översikt": Artikelinformation on the left; the depot's figures,
 * Pris and Lager per depå on the right; the latest events across the bottom.
 */
export function ArticleOverviewTab({ details, depots, depotId }: ArticleOverviewTabProps) {
	const { article, stock } = details;

	return (
		<div className="grid gap-4">
			<div className="grid gap-4 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
				<ArticleInfoCard article={article} depots={depots} />
				<div className="grid content-start gap-4">
					<ArticleStockFigures stock={stock.find((row) => row.depotId === depotId)} unit={article.unit} />
					<div className="grid gap-4 sm:grid-cols-2">
						<ArticlePriceCard article={article} />
						<ArticleDepotStockCard stock={stock} depotId={depotId} />
					</div>
				</div>
			</div>
			<ArticleRecentEvents articleId={article.id} />
		</div>
	);
}
