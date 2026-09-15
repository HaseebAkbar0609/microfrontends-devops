"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useYearEnd } from "../../hooks/useYearEnd";
import {
	YEAR_END_BASE_ROUTE,
	DEFAULT_FISCAL_YEAR,
} from "../../constants/yearEnd.constants";
import { YearEndHeader } from "./YearEndHeader";
import { YearEndToolbar } from "./YearEndToolbar";
import { YearEndYearSelector } from "./YearEndYearSelector";
import { YearEndTable } from "./YearEndTable";
import { YearEndPagination } from "./YearEndPagination";
import { YearEndDeleteDialog } from "./YearEndDeleteDialog";
import type { YearEndTabType } from "../../types/yearEnd.types";

interface YearEndOverviewPageProps {
	initialTab?: YearEndTabType;
	initialYear?: number;
}

export function YearEndOverviewPage({
	initialTab = "bokslut",
	initialYear = DEFAULT_FISCAL_YEAR,
}: YearEndOverviewPageProps) {
	const router = useRouter();

	const {
		activeTab,
		setActiveTab,
		selectedYear,
		setSelectedYear,
		searchQuery,
		setSearchQuery,
		categoryFilter,
		setCategoryFilter,
		sortBy,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalCount,
		items,
		itemToDelete,
		setItemToDelete,
		deleteItem,
	} = useYearEnd({ initialTab, initialYear });

	const handleNavigateToCreate = () => {
		router.push(
			`${YEAR_END_BASE_ROUTE}/create?tab=${activeTab}&year=${selectedYear}`,
		);
	};

	const handleTabChange = (tab: YearEndTabType) => {
		setActiveTab(tab);
		router.push(`${YEAR_END_BASE_ROUTE}?tab=${tab}&year=${selectedYear}`, {
			scroll: false,
		});
	};

	const handleYearChange = (year: number) => {
		setSelectedYear(year);
		router.push(`${YEAR_END_BASE_ROUTE}?tab=${activeTab}&year=${year}`, {
			scroll: false,
		});
	};

	return (
		<div className="flex flex-1 flex-col bg-white px-6 pt-5 pb-8 min-h-screen space-y-4">
			{/* Header with Breadcrumbs & Tabs */}
			<YearEndHeader activeTab={activeTab} onTabChange={handleTabChange} />

			{/* Search, Filter & Add New Screen Trigger */}
			<YearEndToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				categoryFilter={categoryFilter}
				onCategoryFilterChange={setCategoryFilter}
				onCreateClick={handleNavigateToCreate}
			/>

			{/* Year Selector */}
			<YearEndYearSelector
				selectedYear={selectedYear}
				onYearChange={handleYearChange}
			/>

			{/* Main Data Table */}
			<YearEndTable
				items={items}
				totalCount={totalCount}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				onDelete={(item) => setItemToDelete(item)}
				onCreateClick={handleNavigateToCreate}
			/>

			{/* Bottom Pagination */}
			<YearEndPagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={setPageSize}
			/>

			{/* Delete Confirmation Dialog */}
			<YearEndDeleteDialog
				item={itemToDelete}
				isOpen={itemToDelete !== null}
				onClose={() => setItemToDelete(null)}
				onConfirm={(id) => deleteItem(id)}
			/>
		</div>
	);
}

export default YearEndOverviewPage;
