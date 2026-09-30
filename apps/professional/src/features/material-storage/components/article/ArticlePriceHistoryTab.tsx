"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { useArticlePriceHistory } from "../../hooks/useMaterialArticle";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { markupPercent } from "../../utils/materialStockEvents";
import { ArticleTable, type ArticleTableColumn } from "./ArticleTable";

const COLUMNS: ArticleTableColumn[] = [
	{ label: localizationConstants.materialColDate },
	{ label: localizationConstants.materialColPurchasePrice, numeric: true },
	{ label: localizationConstants.materialColSalesPrice, numeric: true },
	{ label: localizationConstants.materialMarkup, numeric: true },
	{ label: localizationConstants.materialColChangedBy },
];

/** "Prishistorik": the article's prices over time, newest first. */
export function ArticlePriceHistoryTab({ articleId }: { articleId: string }) {
	const { data: changes, isPending, isError } = useArticlePriceHistory(articleId);
	const { formatPrice, formatPercent } = useMaterialFormatters();

	return (
		<ArticleTable
			columns={COLUMNS}
			loading={isPending}
			emptyText={isError ? localizationConstants.materialArticleLoadError : localizationConstants.materialNoPriceHistory}
			isEmpty={isError || !changes?.length}
		>
			{changes?.map((change) => {
				const markup = markupPercent(change.purchasePrice, change.salesPrice);
				return (
					<TableRow key={change.date}>
						<TableCell className="tabular-nums">{change.date}</TableCell>
						<TableCell className="text-right tabular-nums">{formatPrice(change.purchasePrice)}</TableCell>
						<TableCell className="text-right tabular-nums">{formatPrice(change.salesPrice)}</TableCell>
						<TableCell className="text-right tabular-nums">{markup === null ? "–" : formatPercent(markup)}</TableCell>
						<TableCell>{change.changedBy}</TableCell>
					</TableRow>
				);
			})}
		</ArticleTable>
	);
}
