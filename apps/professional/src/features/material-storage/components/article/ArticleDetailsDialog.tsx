"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useMaterialArticle } from "../../hooks/useMaterialArticle";
import { useMaterialCatalog } from "../../hooks/useMaterialCatalog";
import type { MaterialStockDialogKind } from "../../hooks/useMaterialOverviewActions";
import type { MaterialArticleDefaults } from "../../types/materialTransaction.types";
import { ArticleEmptyText } from "./ArticleCard";
import { ArticleDepotStockTab } from "./ArticleDepotStockTab";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleOverviewTab } from "./ArticleOverviewTab";
import { ArticlePriceHistoryTab } from "./ArticlePriceHistoryTab";
import { ArticleTransactionsTab } from "./ArticleTransactionsTab";

const TABS: { id: string; label: TranslationKeys }[] = [
	{ id: "overview", label: localizationConstants.materialTabOverview },
	{ id: "depots", label: localizationConstants.materialTabDepotStock },
	{ id: "transactions", label: localizationConstants.materialTabTransactions },
	{ id: "prices", label: localizationConstants.materialTabPriceHistory },
	{ id: "documents", label: localizationConstants.materialTabDocuments },
];

interface ArticleDetailsDialogProps {
	open: boolean;
	articleId: string;
	/** The overview's depot: the header status and the figures are for it. */
	depotId: string;
	onClose: () => void;
	/** Opens "Ta in" or "Ta ut" on top, preset with this article and depot. */
	onStockAction: (kind: MaterialStockDialogKind, article: MaterialArticleDefaults) => void;
	onEdit: () => void;
}

/** "Visa artikel" (TFS-1075). Mount it with the article id as key, so it opens on Översikt. */
export function ArticleDetailsDialog({ open, articleId, depotId, onClose, onStockAction, onEdit }: ArticleDetailsDialogProps) {
	const [tab, setTab] = useState(TABS[0].id);
	const contentRef = useRef<HTMLDivElement>(null);
	const { data: details, isPending, isError, refetch } = useMaterialArticle(articleId);
	const { depots } = useMaterialCatalog();

	let body: ReactNode;
	if (isPending) body = <ArticleDetailsSkeleton />;
	else if (isError || !details)
		body = (
			<StatusMessage
				text={isError ? localizationConstants.materialArticleLoadError : localizationConstants.materialArticleNotFound}
				onRetry={isError ? () => void refetch() : undefined}
			/>
		);
	else {
		const { article, stock } = details;
		const defaults: MaterialArticleDefaults = {
			id: article.id,
			supplierName: article.supplierName,
			purchasePrice: article.purchasePrice,
			salesPrice: article.salesPrice,
		};
		body = (
			<>
				<ArticleHeader
					article={article}
					status={stock.find((row) => row.depotId === depotId)?.status ?? "outOfStock"}
					onEdit={onEdit}
					onReceive={() => onStockAction("receive", defaults)}
					onWithdraw={() => onStockAction("withdraw", defaults)}
					onClose={onClose}
				/>
				<Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
					<TabsList variant="line" className="shrink-0 px-5">
						{TABS.map(({ id, label }) => (
							<TabsTrigger key={id} value={id} className="font-normal data-[state=active]:font-medium">
								<Translate text={label} />
							</TabsTrigger>
						))}
					</TabsList>
					<div className="min-h-0 flex-1 overflow-y-auto p-5">
						<TabsContent value="overview">
							<ArticleOverviewTab details={details} depots={depots} depotId={depotId} />
						</TabsContent>
						<TabsContent value="depots">
							<ArticleDepotStockTab stock={stock} depotId={depotId} />
						</TabsContent>
						<TabsContent value="transactions">
							<ArticleTransactionsTab articleId={article.id} />
						</TabsContent>
						<TabsContent value="prices">
							<ArticlePriceHistoryTab articleId={article.id} />
						</TabsContent>
						<TabsContent value="documents">
							<ArticleEmptyText text={localizationConstants.materialNoDocuments} />
						</TabsContent>
					</div>
				</Tabs>
			</>
		);
	}

	return (
		<Dialog open={open} onOpenChange={(next) => !next && onClose()}>
			<DialogContent
				ref={contentRef}
				showCloseButton={false}
				// Focus starts on the dialog, not on Stäng (the only button while the article loads); Tab goes on from the top.
				onOpenAutoFocus={(event) => {
					event.preventDefault();
					contentRef.current?.focus();
				}}
				tabIndex={-1}
				className="flex max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden bg-white p-0 outline-none sm:max-w-[840px]"
			>
				{body}
				<div className="flex shrink-0 justify-end border-t border-slate-200 px-5 py-3">
					<Button
						type="button"
						variant="outline"
						className="h-10 cursor-pointer border-slate-200 bg-white px-6 text-slate-900 hover:bg-slate-50"
						onClick={onClose}
					>
						<Translate text={localizationConstants.materialCloseDialog} />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/** Loading: the header and the Översikt layout in grey, with a hidden title for screen readers. */
function ArticleDetailsSkeleton() {
	return (
		<div className="grid gap-5 p-5" aria-busy>
			<DialogTitle className="sr-only">
				<Translate text={localizationConstants.materialActionView} />
			</DialogTitle>
			<div className="flex items-center gap-4">
				<Skeleton className="h-14 w-14 rounded-full" />
				<div className="grid gap-2">
					<Skeleton className="h-5 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
			</div>
			<Skeleton className="h-9 w-full" />
			<div className="grid gap-4 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
				<Skeleton className="h-72" />
				<div className="grid content-start gap-4">
					<Skeleton className="h-20" />
					<Skeleton className="h-48" />
				</div>
			</div>
		</div>
	);
}

/** Not found, or failed to load (then with Försök igen). */
function StatusMessage({ text, onRetry }: { text: TranslationKeys; onRetry?: () => void }) {
	return (
		<div className="grid justify-items-center gap-3 px-5 py-12">
			<DialogTitle className="sr-only">
				<Translate text={localizationConstants.materialActionView} />
			</DialogTitle>
			<p className="text-sm text-slate-700" role="alert">
				<Translate text={text} />
			</p>
			{onRetry && (
				<Button type="button" variant="outline" className="h-9 cursor-pointer" onClick={onRetry}>
					<Translate text={localizationConstants.retry} />
				</Button>
			)}
		</div>
	);
}
