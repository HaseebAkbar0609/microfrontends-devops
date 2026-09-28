"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { useCustomReportBuilder } from "../../../../../hooks/useCustomReportBuilder";
import { CustomReportBuilderFooter } from "./CustomReportBuilderFooter";
import { CustomReportBuilderHeader } from "./CustomReportBuilderHeader";
import { CustomReportColumnPanel } from "./CustomReportColumnPanel";
import { CustomReportNameDialog } from "./CustomReportNameDialog";
import { CustomReportPreviewDialog } from "./CustomReportPreviewDialog";
import { CustomReportPreviewTable } from "./CustomReportPreviewTable";

export interface CustomReportBuilderPageProps {
	/** Which module the builder is mounted in; the way back is built from it. */
	basePath?: string;
}

/**
 * Skapa ny rapport: the forecast under the columns chosen for it, and the card
 * that chooses them. The Prognos row of pages steps aside for this screen, so
 * it carries its own header and its own sticky footer.
 */
export function CustomReportBuilderPage({ basePath }: CustomReportBuilderPageProps) {
	const builder = useCustomReportBuilder(basePath);
	const { list } = builder;

	return (
		<div className="flex flex-1 flex-col bg-white">
			<CustomReportBuilderHeader onBack={builder.requestLeave} />

			<div className="flex-1 px-6 py-5">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="flex flex-col gap-5 lg:col-span-2">
						<CustomReportPreviewTable
							rows={list.pageRows}
							columns={builder.appliedList}
							sortField={list.sortField}
							sortDir={list.sortDir}
							onSort={list.onSort}
							emptyKey={list.emptyKey}
						/>

						<TablePagination
							currentPage={list.currentPage}
							totalPages={list.totalPages}
							pageSize={list.pageSize}
							onPageChange={list.setPage}
							onPageSizeChange={list.setPageSize}
							className="justify-center sm:justify-center"
						/>
					</div>

					<CustomReportColumnPanel
						draftColumns={builder.draftColumns}
						onToggleColumn={builder.toggleColumn}
						onApply={builder.applyColumns}
						onDiscard={builder.discardColumns}
						pendingChanges={builder.pendingChanges}
						pendingCount={builder.pendingCount}
						lastColumnBlocked={builder.lastColumnBlocked}
					/>
				</div>
			</div>

			<CustomReportBuilderFooter
				onCancel={builder.requestLeave}
				onPreview={() => builder.setPreviewing(true)}
				onSave={() => builder.setNaming(true)}
			/>

			{builder.previewing && (
				<CustomReportPreviewDialog
					rows={list.allRows}
					columns={builder.appliedList}
					emptyKey={list.emptyKey}
					pendingChanges={builder.pendingChanges}
					onClose={() => builder.setPreviewing(false)}
				/>
			)}

			{builder.naming && (
				<CustomReportNameDialog onSave={builder.saveReport} onClose={() => builder.setNaming(false)} />
			)}

			<ConfirmActionDialog
				open={builder.leaving}
				onOpenChange={builder.setLeaving}
				title={localizationConstants.forecastCustomReportsLeaveTitle}
				description={localizationConstants.forecastCustomReportsLeaveDescription}
				confirmLabel={localizationConstants.forecastCustomReportsLeaveConfirm}
				onConfirm={builder.leave}
			/>
		</div>
	);
}

export default CustomReportBuilderPage;
