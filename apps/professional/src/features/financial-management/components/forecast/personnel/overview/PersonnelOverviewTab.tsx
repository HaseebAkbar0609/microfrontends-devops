"use client";

import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ForecastPersonnelState } from "../../../../hooks/useForecastPersonnel";
import { PersonnelFilterCard } from "../PersonnelFilterCard";
import { PersonnelKpiCards } from "./PersonnelKpiCards";
import { PersonnelDistributionPanel, PersonnelTrendPanel } from "./PersonnelPanels";
import { StaffingOverviewTable } from "./StaffingOverviewTable";
import { UpcomingChangesPanel } from "./UpcomingChangesPanel";

export interface PersonnelOverviewTabProps {
	personnel: ForecastPersonnelState;
}

/** Översikt: what the payroll costs, how it moves, and who is on it. */
export function PersonnelOverviewTab({ personnel }: PersonnelOverviewTabProps) {
	return (
		<>
			<PersonnelFilterCard
				titleKey={localizationConstants.forecastPersonnelFilterTitle}
				filters={personnel.draft}
				departments={personnel.departments}
				roles={personnel.roles}
				secondField="department"
				onChange={personnel.setFilter}
				onToggleRole={personnel.toggleRole}
				onApply={personnel.apply}
				onReset={personnel.reset}
			/>

			<PersonnelKpiCards summary={personnel.summary} isLoading={personnel.isLoading} />

			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<PersonnelTrendPanel points={personnel.trend} />
				</div>
				<PersonnelDistributionPanel slices={personnel.distribution} />
			</div>

			<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
				<section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
					<h3 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastPersonnelStaffingTitle} />
					</h3>

					<StaffingOverviewTable
						employees={personnel.staffingRows}
						sortField={personnel.staffingSortField}
						sortDir={personnel.staffingSortDir}
						onSort={personnel.onSortStaffing}
						emptyKey={personnel.emptyKey}
						isLoading={personnel.isLoading}
					/>

					<TablePagination
						currentPage={personnel.staffingPage}
						totalPages={personnel.staffingTotalPages}
						pageSize={personnel.pageSize}
						onPageChange={personnel.setStaffingPage}
						onPageSizeChange={personnel.setPageSize}
						className="justify-center sm:justify-center"
					/>
				</section>

				<UpcomingChangesPanel changes={personnel.changes} />
			</div>
		</>
	);
}

export default PersonnelOverviewTab;
