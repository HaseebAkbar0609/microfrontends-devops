"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TablePagination } from "@/components/table/TablePagination";
import {
	DATA_IT_SYSTEM_BASE_URL,
	DATA_IT_SYSTEM_CREATE_URL,
} from "@/features/data-it/constants/dataItSystem.constants";
import { useDataItSystem } from "@/features/data-it/hooks/useDataItSystem";
import { SystemFilterToolbar } from "./SystemFilterToolbar";
import { SystemTable } from "./SystemTable";

export const DataItSystemOverviewView: React.FC = () => {
	const t = useTranslate();
	const router = useRouter();

	const {
		items,
		totalItems,
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
		clearFilters,
	} = useDataItSystem();

	const handleViewDetail = (id: string) => {
		router.push(`${DATA_IT_SYSTEM_BASE_URL}/${encodeURIComponent(id)}`);
	};

	const handleEdit = (id: string) => {
		router.push(`${DATA_IT_SYSTEM_BASE_URL}/${encodeURIComponent(id)}?edit=1`);
	};

	return (
		<div className="flex flex-1 flex-col">
			{/* Sub-tab navigation matching Figma Screenshot 1 */}
			<div className="border-b border-slate-200 bg-white px-6">
				<nav
					className="-mb-px flex space-x-6"
					aria-label={t(localizationConstants.dataItSystemAriaTabs)}
				>
					<button
						type="button"
						className="border-b-2 border-slate-900 py-3 text-sm font-semibold text-slate-900"
					>
						{t(localizationConstants.dataItTabSystemList)}
					</button>
				</nav>
			</div>

			{/* Main Content Area with proper page padding */}
			<div className="flex flex-col gap-5 px-6 py-5">
				{/* Filter & Action Toolbar */}
				<SystemFilterToolbar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					selectedStatus={selectedStatus}
					onStatusChange={setSelectedStatus}
					onRegisterClick={() => router.push(DATA_IT_SYSTEM_CREATE_URL)}
				/>

				{/* Main Systems Table */}
				<SystemTable
					items={items}
					sortField={sortField}
					sortDir={sortDir}
					onSort={handleSort}
					onViewDetail={handleViewDetail}
					onEdit={(item) => handleEdit(item.id)}
					onClearFilters={clearFilters}
				/>

				{/* Pagination */}
				{totalItems > 0 && (
					<TablePagination
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
					/>
				)}
			</div>
		</div>
	);
};

export default DataItSystemOverviewView;
