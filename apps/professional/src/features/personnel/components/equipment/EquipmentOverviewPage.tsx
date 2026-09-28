"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useCompanyEquipment } from "../../hooks/useCompanyEquipment";
import { EquipmentToolbar } from "./EquipmentToolbar";
import { EquipmentTable } from "./EquipmentTable";
import { EquipmentTablePagination } from "./EquipmentTablePagination";
import { EquipmentCardsGrid } from "./EquipmentCardsGrid";
import { PersonalkortHeader } from "./PersonalkortHeader";
import { AddEditAssetModal } from "./modals/AddEditAssetModal";
import { AssetHistoryModal } from "./modals/AssetHistoryModal";
import { DeleteAssetDialog } from "./modals/DeleteAssetDialog";
import { personnelBreadcrumbs } from "../../constants/personnelNav.config";
import { CompanyAssetItem, PersonalkortTabType } from "../../types/equipment.types";

export function EquipmentOverviewPage() {
	const [activeView, setActiveView] = useState<"inventory" | "personalkort">("inventory");
	const [personalkortTab, setPersonalkortTab] = useState<PersonalkortTabType>("utrustning_fordon");
	const [selectedEmployeeName] = useState<string>("Anna Svensson");

	const {
		paginatedAssets,
		searchTerm,
		setSearchTerm,
		categoryFilter,
		setCategoryFilter,
		statusFilter,
		setStatusFilter,
		departmentFilter,
		setDepartmentFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		handleResetFilters,
		selectedAssetForHistory,
		setSelectedAssetForHistory,
		assetToEdit,
		setAssetToEdit,
		isAddAssetModalOpen,
		setIsAddAssetModalOpen,
		assetToDelete,
		setAssetToDelete,
		handleCreateAsset,
		handleUpdateAsset,
		handleDeleteAsset,
	} = useCompanyEquipment();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.equipmentAndVehiclesTab}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.equipmentAndVehiclesTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			{/* Main Content Area */}
			<div className="flex flex-1 flex-col px-6 py-4 space-y-6">
				{/* Top View Selector Tabs (Företagsinventarier vs Personalkort) */}
				<div className="flex items-center justify-between border-b border-slate-200 pb-3">
					<Tabs
						value={activeView}
						onValueChange={(val) => setActiveView(val as "inventory" | "personalkort")}
					>
						<TabsList className="bg-slate-200/70 p-0.5 rounded-lg">
							<TabsTrigger
								value="inventory"
								className="text-xs font-medium px-4 py-1.5 rounded-md cursor-pointer data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
							>
								<Translate text={localizationConstants.tabCompanyInventory} />
							</TabsTrigger>
							<TabsTrigger
								value="personalkort"
								className="text-xs font-medium px-4 py-1.5 rounded-md cursor-pointer data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs"
							>
								<Translate text={localizationConstants.tabEmployeeEquipment} />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* View 1: Company-Wide Inventory Table View */}
				{activeView === "inventory" && (
					<div className="space-y-4">
						<EquipmentToolbar
							searchTerm={searchTerm}
							onSearchChange={setSearchTerm}
							categoryFilter={categoryFilter}
							onCategoryChange={setCategoryFilter}
							statusFilter={statusFilter}
							onStatusChange={setStatusFilter}
							departmentFilter={departmentFilter}
							onDepartmentChange={setDepartmentFilter}
							onResetFilters={handleResetFilters}
							onAddAsset={() => setIsAddAssetModalOpen(true)}
						/>

						<EquipmentTable
							assets={paginatedAssets}
							sortField={sortField}
							sortOrder={sortOrder}
							onSort={handleSort}
							onViewHistory={(asset: CompanyAssetItem) => setSelectedAssetForHistory(asset)}
							onEdit={(asset: CompanyAssetItem) => setAssetToEdit(asset)}
							onDelete={(asset: CompanyAssetItem) => setAssetToDelete(asset)}
						/>

						<EquipmentTablePagination
							currentPage={currentPage}
							totalPages={totalPages}
							pageSize={pageSize}
							onPageChange={setCurrentPage}
							onPageSizeChange={setPageSize}
						/>
					</div>
				)}

				{/* View 2: Personalkort (Employee Card) Equipment & Vehicles View (1:1 Figma Design) */}
				{activeView === "personalkort" && (
					<div className="space-y-6">
						<PersonalkortHeader
							employeeName={selectedEmployeeName}
							activeTab={personalkortTab}
							onTabChange={setPersonalkortTab}
							onBack={() => setActiveView("inventory")}
						/>

						{personalkortTab === "utrustning_fordon" && (
							<EquipmentCardsGrid
								employeeName={selectedEmployeeName}
							/>
						)}

						{personalkortTab !== "utrustning_fordon" && (
							<div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-xs">
								<p className="text-sm">
									<Translate text={localizationConstants.tabEmployeeEquipment} /> —{" "}
									<span className="font-semibold text-slate-700">{personalkortTab}</span>
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Asset Creation & Editing Modal */}
			<AddEditAssetModal
				isOpen={isAddAssetModalOpen || !!assetToEdit}
				assetToEdit={assetToEdit}
				onClose={() => {
					setIsAddAssetModalOpen(false);
					setAssetToEdit(null);
				}}
				onSave={(data) => {
					if (assetToEdit) {
						handleUpdateAsset(assetToEdit.id, data);
					} else {
						handleCreateAsset(data);
					}
				}}
			/>

			{/* Asset History & Maintenance Logs Modal */}
			<AssetHistoryModal
				isOpen={!!selectedAssetForHistory}
				asset={selectedAssetForHistory}
				onClose={() => setSelectedAssetForHistory(null)}
			/>

			{/* Asset Deletion Confirmation Dialog */}
			<DeleteAssetDialog
				isOpen={!!assetToDelete}
				asset={assetToDelete}
				onClose={() => setAssetToDelete(null)}
				onConfirm={handleDeleteAsset}
			/>
		</div>
	);
}

export default EquipmentOverviewPage;
