"use client";

import React, { useMemo } from "react";
import { Star, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { usePriceListsOverview } from "../../hooks/usePriceListsOverview";
import type { PriceListDetail } from "../../types/priceLists.types";
import { PRICE_LISTS_DETAIL_BASE_ROUTE } from "../../constants/priceLists.constants";
import { PriceListsOverviewToolbar } from "./PriceListsOverviewToolbar";
import { PriceListDeleteDialog } from "./PriceListDeleteDialog";

export function PriceListsOverviewTable() {
	const router = useRouter();
	const {
		priceLists,
		totalItems,
		isLoading,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		page,
		setPage,
		pageSize,
		setPageSize,
		sortBy,
		sortOrder,
		handleSort,
		handleToggleFavorite,
		deleteTarget,
		isDeleteDialogOpen,
		openDeleteDialog,
		closeDeleteDialog,
		confirmDelete,
	} = usePriceListsOverview();

	const columns: DataTableColumn<PriceListDetail>[] = useMemo(
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
						className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
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
				key: "code",
				label: localizationConstants.priceListCodeHeader,
				sortable: true,
				render: (row) => (
					<button
						type="button"
						onClick={() => router.push(`${PRICE_LISTS_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`)}
						className="font-medium text-slate-900 transition-colors hover:text-blue-600 cursor-pointer"
					>
						{row.code}
					</button>
				),
			},
			{
				key: "name",
				label: localizationConstants.priceListNameHeader,
				sortable: true,
				render: (row) => (
					<button
						type="button"
						onClick={() => router.push(`${PRICE_LISTS_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`)}
						className="text-left font-medium text-slate-700 transition-colors hover:text-blue-600 cursor-pointer"
					>
						{row.name}
					</button>
				),
			},
			{
				key: "category",
				label: localizationConstants.priceListCategoryHeader,
				sortable: true,
				render: (row) => (
					<span className="text-sm font-medium text-slate-700">
						{row.category}
					</span>
				),
			},
			{
				key: "linkedCount",
				label: localizationConstants.priceListLinkedHeader,
				sortable: true,
				render: (row) => (
					<span className="text-sm text-slate-600">
						{row.linkedCount ?? row.articles?.length ?? 0}
					</span>
				),
			},
			{
				key: "createdBy",
				label: localizationConstants.priceListCreatedByHeader,
				sortable: true,
			},
			{
				key: "date",
				label: localizationConstants.priceListDateHeader,
				sortable: true,
			},
			{
				key: "lastUpdated",
				label: localizationConstants.priceListLastUpdatedHeader,
				sortable: true,
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
							router.push(`${PRICE_LISTS_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[handleToggleFavorite, router],
	);

	const actions: DataTableAction<PriceListDetail>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`${PRICE_LISTS_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => openDeleteDialog(row),
			},
		],
		[router, openDeleteDialog],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Search, Filter & Register New Toolbar */}
			<PriceListsOverviewToolbar
				searchQuery={searchQuery}
				categoryFilter={categoryFilter}
				onSearchChange={setSearchQuery}
				onCategoryFilterChange={setCategoryFilter}
			/>

			{/* Reusable DataTable Component */}
			<DataTable
				data={priceLists}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
				loading={isLoading}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				pagination={{
					page,
					pageSize,
					totalItems,
				}}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			{/* Delete Confirmation Dialog */}
			<PriceListDeleteDialog
				isOpen={isDeleteDialogOpen}
				target={deleteTarget}
				onClose={closeDeleteDialog}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}
