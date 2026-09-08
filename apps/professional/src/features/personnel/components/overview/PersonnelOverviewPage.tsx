"use client";

import React from "react";
import Link from "next/link";
import { Clock, Layers, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_NAV_ITEMS,
	personnelBreadcrumbs,
} from "../../constants/personnelNav.config";
import { usePersonnelOverview } from "../../hooks/usePersonnelOverview";
import { PersonnelOverviewToolbar } from "./PersonnelOverviewToolbar";
import { PersonnelTable } from "./table/PersonnelTable";
import { PersonnelTablePagination } from "./table/PersonnelTablePagination";
import { EmployeeProfileModal } from "./modals/EmployeeProfileModal";
import { DeactivateEmployeeDialog } from "./modals/DeactivateEmployeeDialog";

export function PersonnelOverviewPage() {
	const {
		searchTerm,
		setSearchTerm,
		statusFilter,
		setStatusFilter,
		typeFilter,
		setTypeFilter,
		locationFilter,
		setLocationFilter,
		roleFilter,
		setRoleFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		paginatedEmployees,
		handleResetFilters,
		selectedEmployee,
		setSelectedEmployee,
		employeeToDeactivate,
		setEmployeeToDeactivate,
		handleConfirmDeactivate,
	} = usePersonnelOverview();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Standardized PageHeader */}
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.personalOverviewTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-4">
				{/* Level 1 Tabs matching Figma and Epic TFS-972 */}
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-xs">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList variant="line" className="h-[36px] overflow-x-auto">
							<TabsTrigger value="dashboard" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[0]?.href ?? "#"}>
									<Layers className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.personalDashboardTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="overview" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[1]?.href ?? "#"}>
									<Users className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.personalOverviewTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="create" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[2]?.href ?? "#"}>
									<UserPlus className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.createEmployeeTab} />
								</Link>
							</TabsTrigger>
							<TabsTrigger value="worktime" className="cursor-pointer gap-1.5" asChild>
								<Link href={PERSONNEL_NAV_ITEMS[3]?.href ?? "#"}>
									<Clock className="w-3.5 h-3.5 shrink-0" />
									<Translate text={localizationConstants.worktimeTab} />
								</Link>
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Main Content Card matching Figma Design 1:1 */}
				<div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
					{/* Search & Filter Toolbar */}
					<PersonnelOverviewToolbar
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						statusFilter={statusFilter}
						onStatusChange={setStatusFilter}
						typeFilter={typeFilter}
						onTypeChange={setTypeFilter}
						locationFilter={locationFilter}
						onLocationChange={setLocationFilter}
						roleFilter={roleFilter}
						onRoleChange={setRoleFilter}
						onResetFilters={handleResetFilters}
					/>

					{/* 1:1 Figma Data Table */}
					<PersonnelTable
						employees={paginatedEmployees}
						sortField={sortField}
						sortOrder={sortOrder}
						onSort={handleSort}
						onViewProfile={setSelectedEmployee}
						onDeactivate={setEmployeeToDeactivate}
					/>

					{/* Standardized Pagination Footer */}
					<PersonnelTablePagination
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
					/>
				</div>
			</div>

			{/* Profile Detail Modal */}
			<EmployeeProfileModal
				employee={selectedEmployee}
				isOpen={Boolean(selectedEmployee)}
				onClose={() => setSelectedEmployee(null)}
			/>

			{/* Safe Mutation Confirmation Dialog */}
			<DeactivateEmployeeDialog
				employee={employeeToDeactivate}
				isOpen={Boolean(employeeToDeactivate)}
				onClose={() => setEmployeeToDeactivate(null)}
				onConfirm={handleConfirmDeactivate}
			/>
		</div>
	);
}
