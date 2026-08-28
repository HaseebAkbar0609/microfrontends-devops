"use client";

import { useState } from "react";
import { ModulePageHeader } from "@/components/layout/navigation";
import { machineBreadcrumbs } from "@/features/machines/data/machineNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useMachineStatistics } from "./hooks/useMachineStatistics";
import { useVehicleStatistics } from "./hooks/useVehicleStatistics";
import { StatisticsKpiCards } from "./components/StatisticsKpiCards";
import { MachineFiltersCard } from "./components/MachineFiltersCard";
import { MachineStatisticsTable } from "./components/MachineStatisticsTable";
import { VehicleFiltersCard } from "./components/VehicleFiltersCard";
import { VehicleStatisticsTable } from "./components/VehicleStatisticsTable";

export function MachineStatisticsPage() {
	const [activeMainTab, setActiveMainTab] = useState<"machines" | "vehicles">(
		"machines"
	);

	// Machine statistics hook
	const {
		filters: machineFilters,
		setFilters: setMachineFilters,
		searchQuery: machineSearchQuery,
		setSearchQuery: setMachineSearchQuery,
		applyFilters: applyMachineFilters,
		resetFilters: resetMachineFilters,
		sortField: machineSortField,
		sortOrder: machineSortOrder,
		handleSort: handleMachineSort,
		currentPage: machineCurrentPage,
		setCurrentPage: setMachineCurrentPage,
		pageSize: machinePageSize,
		setPageSize: setMachinePageSize,
		totalItems: machineTotalItems,
		totalPages: machineTotalPages,
		paginatedData: machinePaginatedData,
	} = useMachineStatistics();

	// Vehicle statistics hook
	const {
		filters: vehicleFilters,
		setFilters: setVehicleFilters,
		searchQuery: vehicleSearchQuery,
		setSearchQuery: setVehicleSearchQuery,
		applyFilters: applyVehicleFilters,
		resetFilters: resetVehicleFilters,
		sortField: vehicleSortField,
		sortOrder: vehicleSortOrder,
		handleSort: handleVehicleSort,
		currentPage: vehicleCurrentPage,
		setCurrentPage: setVehicleCurrentPage,
		pageSize: vehiclePageSize,
		setPageSize: setVehiclePageSize,
		totalItems: vehicleTotalItems,
		totalPages: vehicleTotalPages,
		paginatedData: vehiclePaginatedData,
	} = useVehicleStatistics();

	const isExternalView = machineFilters.machineType === "Externa";

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			{/* Module Header with Breadcrumbs & Tabs unified in white header with border line UNDER tabs */}
			<div className="bg-white border-b border-slate-200">
				<ModulePageHeader
					title={localizationConstants.machineStatTitle}
					breadcrumbs={machineBreadcrumbs(
						localizationConstants.machineStatBreadcrumb
					)}
					className="border-b-0 pb-1"
				/>

				{/* Top-level Tabs: Maskiner | Fordonspark */}
				<div className="flex items-center gap-8 px-5">
					<button
						type="button"
						onClick={() => setActiveMainTab("machines")}
						className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
							activeMainTab === "machines"
								? "border-b-2 border-slate-900 text-slate-900 -mb-px"
								: "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.machineStatTabMachines} />
					</button>
					<button
						type="button"
						onClick={() => setActiveMainTab("vehicles")}
						className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
							activeMainTab === "vehicles"
								? "border-b-2 border-slate-900 text-slate-900 -mb-px"
								: "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.machineStatTabVehicles} />
					</button>
				</div>
			</div>

			{/* Main Scrollable Body */}
			<div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pt-6 pb-12">
				{/* Tab 1: Maskiner View */}
				{activeMainTab === "machines" && (
					<div className="flex flex-col gap-6">
						{/* 3 Dark Summary KPI Cards */}
						<StatisticsKpiCards
							variant="machines"
							card1={{
								labelKey: localizationConstants.machineStatKpiTotalMachines,
								value: "1.234",
							}}
							card2={{
								labelKey: localizationConstants.machineStatKpiInternalMachines,
								value: "123",
							}}
							card3={{
								labelKey: localizationConstants.machineStatKpiExternalMachines,
								value: "145",
							}}
						/>

						{/* Filter Card */}
						<MachineFiltersCard
							filters={machineFilters}
							onChange={setMachineFilters}
							onApply={applyMachineFilters}
							onReset={resetMachineFilters}
						/>

						{/* Statistics Data Table */}
						<MachineStatisticsTable
							data={machinePaginatedData}
							showSupplierColumn={isExternalView}
							searchQuery={machineSearchQuery}
							onSearchChange={setMachineSearchQuery}
							sortField={machineSortField}
							sortOrder={machineSortOrder}
							onSort={handleMachineSort}
							currentPage={machineCurrentPage}
							totalPages={machineTotalPages}
							pageSize={machinePageSize}
							totalItems={machineTotalItems}
							onPageChange={setMachineCurrentPage}
							onPageSizeChange={setMachinePageSize}
						/>
					</div>
				)}

				{/* Tab 2: Fordonspark View */}
				{activeMainTab === "vehicles" && (
					<div className="flex flex-col gap-6">
						{/* 3 Dark Summary KPI Cards */}
						<StatisticsKpiCards
							variant="vehicles"
							card1={{
								labelKey: localizationConstants.machineStatKpiTotalVehicles,
								value: "1.234",
							}}
							card2={{
								labelKey: localizationConstants.machineStatKpiActiveVehicles,
								value: "123",
							}}
							card3={{
								labelKey: localizationConstants.machineStatKpiTotalMileage,
								value: "1,270 km",
							}}
						/>

						{/* Vehicle Filter Card */}
						<VehicleFiltersCard
							filters={vehicleFilters}
							onChange={setVehicleFilters}
							onApply={applyVehicleFilters}
							onReset={resetVehicleFilters}
						/>

						{/* Vehicle Statistics Data Table */}
						<VehicleStatisticsTable
							data={vehiclePaginatedData}
							searchQuery={vehicleSearchQuery}
							onSearchChange={setVehicleSearchQuery}
							sortField={vehicleSortField}
							sortOrder={vehicleSortOrder}
							onSort={handleVehicleSort}
							currentPage={vehicleCurrentPage}
							totalPages={vehicleTotalPages}
							pageSize={vehiclePageSize}
							totalItems={vehicleTotalItems}
							onPageChange={setVehicleCurrentPage}
							onPageSizeChange={setVehiclePageSize}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
