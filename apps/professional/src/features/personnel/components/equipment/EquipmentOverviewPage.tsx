"use client";

import React from "react";
import Link from "next/link";
import { Clock, Layers, UserPlus, Users, Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_NAV_ITEMS,
	PERSONNEL_MODULE_BASE_URL,
	personnelBreadcrumbs,
} from "../../constants/personnelNav.config";
import { useCompanyEquipment } from "../../hooks/useCompanyEquipment";
import { EquipmentToolbar } from "./EquipmentToolbar";
import { EquipmentTable } from "./EquipmentTable";
import { EquipmentTablePagination } from "./EquipmentTablePagination";
import { AddEditAssetModal } from "./modals/AddEditAssetModal";
import { AssetHistoryModal } from "./modals/AssetHistoryModal";
import { DeleteAssetDialog } from "./modals/DeleteAssetDialog";
import { CompanyAssetItem } from "../../types/equipment.types";

const TAB_ICON_MAP: Record<string, React.ElementType> = {
	dashboard: Layers,
	overview: Users,
	equipment: Wrench,
	create: UserPlus,
	worktime: Clock,
};

export function EquipmentOverviewPage() {
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
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-4">
				{/* Level 2 Sub-Module Navigation Tabs — same pattern as Dashboard & Overview pages */}
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-xs">
					<Tabs defaultValue="equipment" className="w-full">
						<TabsList variant="line" className="h-[36px] overflow-x-auto">
							{PERSONNEL_NAV_ITEMS.map((item) => {
								const Icon = TAB_ICON_MAP[item.id] || Users;
								return (
									<TabsTrigger key={item.id} value={item.id} className="cursor-pointer gap-1.5" asChild>
										<Link href={item.href || PERSONNEL_MODULE_BASE_URL}>
											<Icon className="w-3.5 h-3.5 shrink-0" />
											<Translate text={item.labelKey || ""} />
										</Link>
									</TabsTrigger>
								);
							})}
						</TabsList>
					</Tabs>
				</div>

				{/* Company-Wide Equipment & Vehicles Inventory Table */}
				<div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
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
