"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ModulePageHeader } from "@/components/layout/navigation";
import { productionBreadcrumbs } from "@/features/production/constants";
import localizationConstants from "@/utils/translation/constants";
import { useMaterialOverviewActions } from "../../hooks/useMaterialOverviewActions";
import { useMaterialOverviewParams } from "../../hooks/useMaterialOverviewParams";
import { useMaterialStockOverview } from "../../hooks/useMaterialStockOverview";
import { MaterialTablePagination } from "../common/MaterialTablePagination";
import { MaterialActionBar } from "./MaterialActionBar";
import { MaterialKpiCards } from "./MaterialKpiCards";
import { MaterialStockTable } from "./MaterialStockTable";
import { MaterialStockToolbar } from "./MaterialStockToolbar";

// The forms, date picker and validation they bring are loaded on first opening, not with the overview.
const ReceiveMaterialDialog = dynamic(
	() => import("../receive/ReceiveMaterialDialog").then((loaded) => loaded.ReceiveMaterialDialog),
	{ ssr: false },
);
const WithdrawMaterialDialog = dynamic(
	() => import("../withdraw/WithdrawMaterialDialog").then((loaded) => loaded.WithdrawMaterialDialog),
	{ ssr: false },
);
const ArticleDetailsDialog = dynamic(
	() => import("../article/ArticleDetailsDialog").then((loaded) => loaded.ArticleDetailsDialog),
	{ ssr: false },
);

/**
 * Materialhantering overview (TFS-1072): stock per depot with KPIs, filters and
 * row actions; opens "Ta in material" (TFS-1073), "Ta ut material" (TFS-1074)
 * and "Visa artikel" (TFS-1075).
 */
export function MaterialOverviewPage() {
	const { params, setDepot, setSearch, setCategory, setStockFilter, setSort, setPage, setPageSize, setArticle } =
		useMaterialOverviewParams();
	const overview = useMaterialStockOverview(params);
	const { onPageAction, onRowAction, openStockDialog, stockDialog, closeStockDialog, showComingSoon } =
		useMaterialOverviewActions(overview.depotId, setArticle);
	// Kept after the article is closed, so the dialog animates out with its content instead of vanishing.
	const [shownArticleId, setShownArticleId] = useState(params.articleId);
	if (params.articleId && params.articleId !== shownArticleId) setShownArticleId(params.articleId);
	const StockDialog = stockDialog.kind === "receive" ? ReceiveMaterialDialog : WithdrawMaterialDialog;

	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			<ModulePageHeader
				title={localizationConstants.materialStorage}
				breadcrumbs={productionBreadcrumbs(localizationConstants.materialStorage)}
				className="px-10 pt-2 pb-5"
			/>
			<div className="flex flex-1 flex-col gap-6 px-10 py-6">
				<MaterialActionBar
					depots={overview.depots}
					depotId={overview.depotId}
					onDepotChange={setDepot}
					onAction={onPageAction}
				/>
				<MaterialKpiCards kpis={overview.kpis} loading={overview.isKpisLoading} />
				<section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
					<div className="border-b border-slate-200">
						<MaterialStockToolbar
							search={params.search}
							onSearchChange={setSearch}
							categoryId={params.categoryId}
							onCategoryChange={setCategory}
							stockFilter={params.stockFilter}
							onStockFilterChange={setStockFilter}
						/>
					</div>
					<MaterialStockTable
						rows={overview.stockPage?.rows ?? []}
						loading={overview.isStockLoading}
						error={overview.isStockError}
						onRetry={overview.retry}
						skeletonRows={params.pageSize}
						sortBy={params.sortBy}
						sortOrder={params.sortOrder}
						onSort={setSort}
						onRowAction={onRowAction}
					/>
					{!overview.isStockError && (
						<MaterialTablePagination
							page={overview.stockPage?.page ?? params.page}
							pageSize={params.pageSize}
							totalItems={overview.stockPage?.totalItems ?? 0}
							onPageChange={setPage}
							onPageSizeChange={setPageSize}
						/>
					)}
				</section>
			</div>

			{shownArticleId && overview.depotId && (
				<ArticleDetailsDialog
					key={shownArticleId}
					open={Boolean(params.articleId)}
					articleId={shownArticleId}
					depotId={overview.depotId}
					onClose={() => setArticle(null)}
					onStockAction={(kind, article) => openStockDialog(kind, { depotId: overview.depotId, article })}
					onEdit={showComingSoon}
				/>
			)}

			{/* Not mounted before the first opening, so its lists only load when needed. Opens on top of the article. */}
			{stockDialog.key > 0 && (
				<StockDialog
					key={stockDialog.key}
					open={stockDialog.open}
					preset={stockDialog.preset}
					onClose={closeStockDialog}
				/>
			)}
		</div>
	);
}
