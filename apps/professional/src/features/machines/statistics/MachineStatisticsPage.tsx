"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { machineBreadcrumbs } from "@/features/machines/data/machineNav.config";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMachineStatistics } from "./hooks/useMachineStatistics";
import { useVehicleStatistics } from "./hooks/useVehicleStatistics";
import { StatisticsKpiCards } from "./components/StatisticsKpiCards";
import { MachineFiltersCard } from "./components/MachineFiltersCard";
import { MachineStatisticsTable } from "./components/MachineStatisticsTable";
import { VehicleFiltersCard } from "./components/VehicleFiltersCard";
import { VehicleStatisticsTable } from "./components/VehicleStatisticsTable";

export function MachineStatisticsPage() {
	const [activeMainTab, setActiveMainTab] = useState<"machines" | "vehicles">(
		"machines",
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
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Title with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.machineStatTitle}
				breadcrumbs={machineBreadcrumbs(
					localizationConstants.machineStatBreadcrumb,
				)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area with 2-level Tab Row */}
			<div className="flex flex-1 flex-col px-6 pt-2 pb-12 overflow-y-auto">
				<Tabs
					value={activeMainTab}
					onValueChange={(v) => setActiveMainTab(v as "machines" | "vehicles")}
					className="flex-1"
				>
					<div className="flex items-center border-b border-slate-200 mb-6 bg-white px-4 rounded-t-lg h-[44px]">
						<TabsList variant="line" className="h-[36px]">
							<TabsTrigger value="machines" className="cursor-pointer">
								<Translate text={localizationConstants.machineStatTabMachines} />
							</TabsTrigger>
							<TabsTrigger value="vehicles" className="cursor-pointer">
								<Translate text={localizationConstants.machineStatTabVehicles} />
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Tab 1: Maskiner View */}
					<TabsContent value="machines" className="mt-0 flex flex-col gap-6">
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
					</TabsContent>

					{/* Tab 2: Fordonspark View */}
					<TabsContent value="vehicles" className="mt-0 flex flex-col gap-6">
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
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default MachineStatisticsPage;
