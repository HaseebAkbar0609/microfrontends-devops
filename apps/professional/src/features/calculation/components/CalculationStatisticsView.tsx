"use client";

import { DynamicBreadcrumb } from "@/components/common";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCalculationStatistics } from "../hooks/useCalculationStatistics";
import {
	StatisticsKpiCards,
	StatisticsFilterSection,
	StatisticsTableSection,
} from "./statistics";

export function CalculationStatisticsView() {
	const {
		kpis,
		isKpisLoading,
		rows,
		isLoading,
		bestellare,
		setBestellare,
		selectedKategori,
		selectedTyp,
		entreprenadform,
		setEntreprenadform,
		startDate,
		setStartDate,
		startDateOptions,
		endDate,
		setEndDate,
		endDateOptions,
		search,
		setSearch,
		page,
		setPage,
		pageSize,
		setPageSize,
		totalPages,
		sortField,
		sortDir,
		toggleSort,
		bestellareOptions,
		kategoriOptions,
		typOptions,
		entreprenadformOptions,
		handleToggleKategori,
		handleToggleTyp,
		handleApplyFilters,
		handleResetFilters,
		handleViewList,
	} = useCalculationStatistics();

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-white">
			{/* Heading & Breadcrumb Header */}
			<div className="border-b border-slate-200 px-6 pt-5 pb-4">
				<h1 className="mb-0.5 text-2xl font-semibold tracking-tight text-slate-950">
					<Translate text={localizationConstants.calcStatistics} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.home,
							href: "/home",
						},
						{
							translationKey: localizationConstants.moduleItem,
							href: "/module/business",
						},
						{
							translationKey: localizationConstants.calculation,
							href: "/module/business/calculation/dashboard",
						},
						{
							translationKey: localizationConstants.calcStatistics,
						},
					]}
				/>
			</div>

			{/* Content Container */}
			<div className="flex flex-col gap-6 px-6 pt-6 pb-10">
				{/* 1. Top 3 KPI Summary Cards */}
				<StatisticsKpiCards kpis={kpis} isLoading={isKpisLoading} />

				{/* 2. Statistics Selection Filter Section */}
				<StatisticsFilterSection
					bestellare={bestellare}
					onBestellareChange={setBestellare}
					bestellareOptions={bestellareOptions}
					selectedKategori={selectedKategori}
					onToggleKategori={handleToggleKategori}
					kategoriOptions={kategoriOptions}
					selectedTyp={selectedTyp}
					onToggleTyp={handleToggleTyp}
					typOptions={typOptions}
					entreprenadform={entreprenadform}
					onEntreprenadformChange={setEntreprenadform}
					entreprenadformOptions={entreprenadformOptions}
					startDate={startDate}
					onStartDateChange={setStartDate}
					startDateOptions={startDateOptions}
					endDate={endDate}
					onEndDateChange={setEndDate}
					endDateOptions={endDateOptions}
					onApply={handleApplyFilters}
					onReset={handleResetFilters}
				/>

				{/* 3. Statistics Information Data Table & Pagination Section */}
				<StatisticsTableSection
					rows={rows}
					isLoading={isLoading}
					search={search}
					onSearchChange={setSearch}
					sortField={sortField}
					sortDir={sortDir}
					onToggleSort={toggleSort}
					page={page}
					pageSize={pageSize}
					totalPages={totalPages}
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
					onViewList={handleViewList}
				/>
			</div>
		</div>
	);
}
