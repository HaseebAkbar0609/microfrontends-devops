"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useArticleStockEvents } from "../../hooks/useMaterialArticle";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { formatIsoDay } from "../../utils/materialDates";
import { ArticleTable, type ArticleTableColumn } from "./ArticleTable";
import { STOCK_EVENT_TONES, useStockEventText } from "./useStockEventText";

const COLUMNS: ArticleTableColumn[] = [
	{ label: localizationConstants.materialColDate },
	{ label: localizationConstants.materialColEvent },
	{ label: localizationConstants.materialColDepot },
	{ label: localizationConstants.materialFieldQuantity, numeric: true },
	{ label: localizationConstants.materialColReference },
	{ label: localizationConstants.materialColPerformedBy },
];

/** "Transaktioner": every completed stock event of the article in any depot, newest first. */
export function ArticleTransactionsTab({ articleId }: { articleId: string }) {
	const { data: events, isPending, isError } = useArticleStockEvents(articleId);
	const { formatQuantityChange } = useMaterialFormatters();
	const describe = useStockEventText();

	return (
		<ArticleTable
			columns={COLUMNS}
			loading={isPending}
			emptyText={isError ? localizationConstants.materialArticleLoadError : localizationConstants.materialNoEvents}
			isEmpty={isError || !events?.length}
		>
			{events?.map((event) => (
				<TableRow key={event.id}>
					<TableCell className="tabular-nums">{formatIsoDay(event.createdAt)}</TableCell>
					{/* Text columns wrap, so the table fits the dialog; dates, quantities and references stay whole. */}
					<TableCell className="whitespace-normal text-slate-900">{describe(event).label}</TableCell>
					<TableCell className="whitespace-normal">{event.depotName}</TableCell>
					<TableCell className={cn("text-right font-medium tabular-nums", STOCK_EVENT_TONES[event.type])}>
						{formatQuantityChange(event.quantityChange, event.unit)}
					</TableCell>
					<TableCell className="tabular-nums">{event.reference}</TableCell>
					<TableCell className="whitespace-normal">{event.createdBy ?? ""}</TableCell>
				</TableRow>
			))}
		</ArticleTable>
	);
}
