"use client";

import React, { useMemo } from "react";
import { Star, Eye, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useArticleOverview } from "../../hooks/useArticleOverview";
import type { ArticleRow } from "../../types/article.types";
import {
	ARTICLE_DETAIL_BASE_ROUTE,
} from "../../constants/article.constants";
import { ArticlesOverviewToolbar } from "./ArticlesOverviewToolbar";
import { ArticleDeleteDialog } from "./ArticleDeleteDialog";
import { EconomyStatusBadge } from "../common/EconomyStatusBadge";

export function ArticlesOverviewTable() {
	const {
		data,
		totalItems,
		isLoading,
		searchQuery,
		statusParam,
		sortByParam,
		sortOrderParam,
		page,
		pageSize,
		deletingId,
		setDeletingId,
		handleSearchChange,
		handleStatusFilterChange,
		handleSort,
		handlePageChange,
		handlePageSizeChange,
		handleToggleFavorite,
		handleDelete,
		router,
	} = useArticleOverview();

	const columns: DataTableColumn<ArticleRow>[] = useMemo(
		() => [
			{
				key: "isFavorite",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleFavorite(row.id);
						}}
						className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 transition-colors"
					>
						<Star
							className={`h-4 w-4 ${
								row.isFavorite
									? "fill-[#111721] text-[#111721]"
									: "text-slate-400 hover:text-[#111721]"
							}`}
						/>
					</button>
				),
			},
			{
				key: "articleNo",
				label: localizationConstants.articleNoHeader,
				sortable: true,
				render: (row) => (
					<button
						type="button"
						onClick={() => router.push(`${ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`)}
						className="font-medium text-slate-900 transition-colors hover:text-blue-600"
					>
						{row.articleNo}
					</button>
				),
			},
			{
				key: "description",
				label: localizationConstants.descriptionHeader,
				sortable: true,
				render: (row) => (
					<button
						type="button"
						onClick={() => router.push(`${ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`)}
						className="text-left font-medium text-slate-700 transition-colors hover:text-blue-600"
					>
						{row.description}
					</button>
				),
			},
			{
				key: "outPriceListA",
				label: localizationConstants.outPriceListAHeader,
				sortable: true,
			},
			{
				key: "calculatedCost",
				label: localizationConstants.calculatedCostHeader,
				sortable: true,
			},
			{
				key: "stock",
				label: localizationConstants.stockHeader,
				sortable: true,
			},
			{
				key: "reserved",
				label: localizationConstants.reservedHeader,
				sortable: true,
			},
			{
				key: "available",
				label: localizationConstants.availableHeader,
				sortable: true,
			},
			{
				key: "stockValue",
				label: localizationConstants.stockValueHeader,
				sortable: true,
			},
			{
				key: "country",
				label: localizationConstants.countryHeader,
				sortable: true,
				render: (row) => (
					<span className="text-xs font-medium text-slate-700">
						{row.country || "SE"}
					</span>
				),
			},
			{
				key: "status",
				label: localizationConstants.statusHeader,
				sortable: true,
				render: (row) => (
					<EconomyStatusBadge
						status={row.status}
						label={
							row.status === "active"
								? localizationConstants.activeStatus
								: localizationConstants.inactiveStatus
						}
					/>
				),
			},
			{
				key: "view",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							router.push(`${ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[handleToggleFavorite, router],
	);

	const actions: DataTableAction<ArticleRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`${ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => setDeletingId(row.id),
			},
		],
		[router, setDeletingId],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Search, Filter & Actions Toolbar */}
			<ArticlesOverviewToolbar
				searchQuery={searchQuery}
				statusParam={statusParam}
				onSearchChange={handleSearchChange}
				onStatusFilterChange={handleStatusFilterChange}
			/>

			{/* Reusable DataTable Component */}
			<DataTable
				data={data}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
				loading={isLoading}
				sortBy={sortByParam}
				sortOrder={sortOrderParam}
				onSort={handleSort}
				pagination={{
					page,
					pageSize,
					totalItems,
				}}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
			/>

			{/* Delete Confirmation Dialog */}
			<ArticleDeleteDialog
				deletingId={deletingId}
				onClose={() => setDeletingId(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
