"use client";

import { notFound } from "next/navigation";

import { ModulePageHeader } from "@/components/layout/navigation";
import { DataTable } from "@/components/table/DataTable";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../data/projectNav.config";
import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { StaffLedgerFilters } from "./components/StaffLedgerFilters";
import { useProjectStaffLedger } from "./hooks/useProjectStaffLedger";
import { STAFF_LEDGER_COLUMNS } from "./staffLedgerColumns";

export interface ProjectStaffLedgerPageProps {
	projectId: string;
}

/**
 * Personal-liggare — who was on site, and when.
 *
 * Pattern 3, as the record's three other sections are: the record row carries
 * the section tabs. Read-only throughout: a personalliggare is the log of what
 * happened, so the frame draws no add, edit or delete and neither does this.
 */
export function ProjectStaffLedgerPage({
	projectId,
}: ProjectStaffLedgerPageProps) {
	const ledger = useProjectStaffLedger(projectId);

	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	/* An id that matches no project is a 404, not an empty ledger. After the
	   hooks, not before: `notFound()` throws, and a guard above them would skip
	   the rest on that render. */
	if (!ledger.exists) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={project?.projectNr ?? projectId}
							sectionKey={
								localizationConstants.projectStaffLedgerTitle
							}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-5 p-6">
				<StaffLedgerFilters
					supplier={ledger.supplier}
					onSupplierChange={ledger.setSupplier}
					supplierOptions={ledger.supplierOptions}
					dateFrom={ledger.dateFrom}
					onDateFromChange={ledger.setDateFrom}
					dateTo={ledger.dateTo}
					onDateToChange={ledger.setDateTo}
					dateRangeInvalid={ledger.dateRangeInvalid}
					onSiteOnly={ledger.onSiteOnly}
					onOnSiteOnlyChange={ledger.setOnSiteOnly}
				/>

				{/* The table is always rendered, so the headers stay on screen
				    while the reader adjusts a filter that matched nothing.
				    `bordered` rather than a wrapper div, so the rounded corner
				    belongs to the same element that clips the scroll. */}
				<DataTable
					data={ledger.rows}
					columns={STAFF_LEDGER_COLUMNS}
					rowKey={(row) => row.id}
					bordered
					sortBy={ledger.sortField ?? undefined}
					sortOrder={ledger.sortDir ?? undefined}
					onSort={ledger.onSort}
					emptyMessageKey={
						ledger.isEmpty
							? localizationConstants.projectStaffLedgerEmpty
							: localizationConstants.projectStaffLedgerNoMatches
					}
				/>

				<TablePagination
					currentPage={ledger.page}
					totalPages={ledger.totalPages}
					pageSize={ledger.pageSize}
					onPageChange={ledger.setPage}
					onPageSizeChange={ledger.setPageSize}
					className="justify-center sm:justify-center"
				/>
			</div>
		</div>
	);
}

export default ProjectStaffLedgerPage;
