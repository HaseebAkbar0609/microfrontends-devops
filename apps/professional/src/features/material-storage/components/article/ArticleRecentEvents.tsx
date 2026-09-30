"use client";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticleStockEvents } from "../../hooks/useMaterialArticle";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { formatIsoDay } from "../../utils/materialDates";
import { ArticleCard, ArticleEmptyText } from "./ArticleCard";
import { STOCK_EVENT_TONES, useStockEventText } from "./useStockEventText";

/** How many events Översikt lists; the Transaktioner tab has them all. */
const RECENT_EVENT_COUNT = 5;

/** "Senaste lagerhändelser": the latest events in any depot. */
export function ArticleRecentEvents({ articleId }: { articleId: string }) {
	const { data: events, isPending, isError } = useArticleStockEvents(articleId);
	const { formatQuantityChange } = useMaterialFormatters();
	const describe = useStockEventText();
	const recent = events?.slice(0, RECENT_EVENT_COUNT) ?? [];

	return (
		<ArticleCard title={localizationConstants.materialRecentEvents}>
			{isPending ? (
				<div className="grid gap-2">
					{Array.from({ length: 3 }, (_, index) => (
						<Skeleton key={index} className="h-8 w-full" />
					))}
				</div>
			) : isError ? (
				<ArticleEmptyText text={localizationConstants.materialArticleLoadError} />
			) : recent.length === 0 ? (
				<ArticleEmptyText text={localizationConstants.materialNoEvents} />
			) : (
				<ul>
					{recent.map((event) => {
						const { label, detail } = describe(event);
						return (
							<li
								key={event.id}
								className="grid grid-cols-[5.5rem_minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 border-b border-slate-100 py-2.5 text-sm last:border-b-0 sm:grid-cols-[6.5rem_minmax(0,1.6fr)_6rem_minmax(0,1fr)]"
							>
								<span className="text-slate-900 tabular-nums">{formatIsoDay(event.createdAt)}</span>
								<span className="min-w-0 break-words text-slate-900">{label}</span>
								<span className={cn("text-right font-medium whitespace-nowrap tabular-nums", STOCK_EVENT_TONES[event.type])}>
									{formatQuantityChange(event.quantityChange, event.unit)}
								</span>
								<span className="col-span-3 min-w-0 truncate text-slate-600 sm:col-span-1 sm:pl-6 sm:text-slate-900">
									{detail}
								</span>
							</li>
						);
					})}
				</ul>
			)}
		</ArticleCard>
	);
}
