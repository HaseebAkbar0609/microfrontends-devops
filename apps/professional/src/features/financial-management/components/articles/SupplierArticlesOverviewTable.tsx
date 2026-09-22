"use client";

import React, { useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useSupplierArticleOverview } from "../../hooks/useSupplierArticleOverview";
import type { SupplierArticleRow } from "../../types/article.types";
import { SUPPLIER_ARTICLE_DETAIL_BASE_ROUTE } from "../../constants/article.constants";
import { SupplierArticlesToolbar } from "./SupplierArticlesToolbar";
import { ArticleDeleteDialog } from "./ArticleDeleteDialog";

export function SupplierArticlesOverviewTable() {
	const {
		data,
		totalItems,
		isLoading,
		searchQuery,
		supplierParam,
		sortByParam,
		sortOrderParam,
		page,
		pageSize,
		deletingId,
		setDeletingId,
		selectOptions,
		handleSearchChange,
		handleSupplierFilterChange,
		handleSort,
		handlePageChange,
		handlePageSizeChange,
		handleDelete,
		router,
	} = useSupplierArticleOverview();

	const columns: DataTableColumn<SupplierArticleRow>[] = useMemo(
		() => [
			{
				key: "supplierArticleNo",
				label: localizationConstants.supplierArticleNoHeader,
				sortable: true,
			},
			{
				key: "supplierName",
				label: localizationConstants.supplierHeader,
				sortable: true,
			},
			{
				key: "supplierDescription",
				label: localizationConstants.supplierDescriptionHeader,
				sortable: true,
			},
			{
				key: "purchasePrice",
				label: localizationConstants.purchasePriceHeader,
				sortable: true,
			},
			{
				key: "linkedToArticle",
				label: localizationConstants.linkedToArticleHeader,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.statusLabel,
				sortable: true,
				render: (row) => (
					<span
						className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold text-white ${
							row.status === "mapped" ? "bg-[#16A34A]" : "bg-slate-400"
						}`}
					>
						<Translate
							text={
								row.status === "mapped"
									? localizationConstants.mappedStatus
									: localizationConstants.unmappedStatus
							}
						/>
					</span>
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
							router.push(`${SUPPLIER_ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[router],
	);

	const actions: DataTableAction<SupplierArticleRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`${SUPPLIER_ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`${SUPPLIER_ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}/edit`),
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
			{/* Top Action & Search Bar */}
			<SupplierArticlesToolbar
				searchQuery={searchQuery}
				supplierParam={supplierParam}
				selectOptions={selectOptions}
				onSearchChange={handleSearchChange}
				onSupplierFilterChange={handleSupplierFilterChange}
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
