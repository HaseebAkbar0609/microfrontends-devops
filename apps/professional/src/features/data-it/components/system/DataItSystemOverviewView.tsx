"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TablePagination } from "@/components/table/TablePagination";
import { DATA_IT_SYSTEM_BASE_URL } from "@/features/data-it/constants/dataItSystem.constants";
import { useDataItSystem } from "@/features/data-it/hooks/useDataItSystem";
import { SystemFilterToolbar } from "./SystemFilterToolbar";
import { SystemTable } from "./SystemTable";
import { SystemRegisterDialog } from "./SystemRegisterDialog";

export const DataItSystemOverviewView: React.FC = () => {
	const t = useTranslate();
	const router = useRouter();
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);

	const {
		items,
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		selectedStatus,
		setSelectedStatus,
		sortField,
		sortDir,
		handleSort,
		createSystem,
	} = useDataItSystem();

	const handleViewDetail = (id: string) => {
		router.push(`${DATA_IT_SYSTEM_BASE_URL}/${encodeURIComponent(id)}`);
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumbs & Title */}
			<div>
				<div className="flex items-center gap-1.5 text-xs text-slate-500">
					<span>Home</span>
					<span>&gt;</span>
					<span>Modul</span>
					<span>&gt;</span>
					<span>Data-it</span>
					<span>&gt;</span>
					<span className="font-medium text-slate-700">
						{t(localizationConstants.dataItSystemBreadcrumb)}
					</span>
				</div>
				<h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
					{t(localizationConstants.dataItSystemTitle)}
				</h1>
			</div>

			{/* Sub-tab navigation */}
			<div
				className="border-b border-slate-200"
				role="tablist"
				aria-label={t(localizationConstants.dataItSystemAriaTabs)}
			>
				<nav className="-mb-px flex space-x-8">
					<button
						type="button"
						role="tab"
						aria-selected="true"
						className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
					>
						{t(localizationConstants.dataItTabSystemList)}
					</button>
				</nav>
			</div>

			{/* Filter Toolbar */}
			<SystemFilterToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
				selectedStatus={selectedStatus}
				onStatusChange={setSelectedStatus}
				onRegisterClick={() => setIsRegisterOpen(true)}
			/>

			{/* Main Systems Table */}
			<SystemTable
				items={items}
				sortField={sortField}
				sortDir={sortDir}
				onSort={handleSort}
				onViewDetail={handleViewDetail}
				onEdit={(item) => handleViewDetail(item.id)}
			/>

			{/* Pagination */}
			{totalPages > 0 && (
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
				/>
			)}

			{/* Register Dialog */}
			<SystemRegisterDialog
				isOpen={isRegisterOpen}
				onClose={() => setIsRegisterOpen(false)}
				onCreate={createSystem}
			/>
		</div>
	);
};

export default DataItSystemOverviewView;
