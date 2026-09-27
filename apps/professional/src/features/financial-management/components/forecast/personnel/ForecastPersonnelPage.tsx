"use client";

import React from "react";

import { SectionTabs, type SectionTabItem } from "@/components/layout/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/table/TablePagination";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { useForecastPersonnel } from "../../../hooks/useForecastPersonnel";
import { PersonnelMonthlyTable } from "./monthly/PersonnelMonthlyTable";
import { PersonnelFilterCard } from "./PersonnelFilterCard";
import { PersonnelOverviewTab } from "./overview/PersonnelOverviewTab";

const PERSONNEL_TABS: SectionTabItem[] = [
	{ id: "overview", labelKey: localizationConstants.forecastPersonnelTabOverview },
	{ id: "monthly", labelKey: localizationConstants.forecastPersonnelTabMonthly },
];

/**
 * Prognos › Personal: what the people on the payroll cost, and what each role
 * costs month by month. Both tabs read the employees the Personal module keeps
 * and share one selection.
 */
export function ForecastPersonnelPage() {
	const t = useTranslate();
	const personnel = useForecastPersonnel();

	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastPersonnelTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastPersonnelTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pb-8">
				<SectionTabs
					items={PERSONNEL_TABS}
					paramName="tab"
					ariaLabel={t(localizationConstants.forecastPersonnelTabsLabel)}
				>
					<TabsContent value="overview" className="flex flex-col gap-5 pt-5">
						<PersonnelOverviewTab personnel={personnel} />
					</TabsContent>

					<TabsContent value="monthly" className="flex flex-col gap-5 pt-5">
						<PersonnelFilterCard
							titleKey={localizationConstants.forecastPersonnelSalaryFilterTitle}
							filters={personnel.draft}
							departments={personnel.departments}
							roles={personnel.roles}
							secondField="kategori"
							onChange={personnel.setFilter}
							onToggleRole={personnel.toggleRole}
							onApply={personnel.apply}
							onReset={personnel.reset}
						/>

						<PersonnelMonthlyTable
							rows={personnel.monthlyRows}
							totals={personnel.monthlyTotals}
							monthKeys={personnel.monthKeys}
							sortField={personnel.monthlySortField}
							sortDir={personnel.monthlySortDir}
							onSort={personnel.onSortMonthly}
							emptyKey={personnel.emptyKey}
							isLoading={personnel.isLoading}
						/>

						<TablePagination
							currentPage={personnel.currentPage}
							totalPages={personnel.totalPages}
							pageSize={personnel.pageSize}
							onPageChange={personnel.setPage}
							onPageSizeChange={personnel.setPageSize}
							className="justify-center sm:justify-center"
						/>
					</TabsContent>
				</SectionTabs>
			</div>
		</div>
	);
}

export default ForecastPersonnelPage;
