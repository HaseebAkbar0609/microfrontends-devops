"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { REPORT_CATEGORY_LABELS } from "../../../constants/forecastReports.constants";
import { useForecastReports } from "../../../hooks/useForecastReports";
import type { ReportDocument } from "../../../types/forecastReports.types";
import { ForecastToolbar, forecastFilterGroup } from "../ForecastToolbar";
import { ReportDetailsDialog } from "./ReportDetailsDialog";
import { ReportUploadDialog } from "./ReportUploadDialog";
import { ReportsTable } from "./ReportsTable";

/**
 * Rapporterlista: Sök, Filter and "Ladda upp ny" over the register, the
 * frame's centred pagination under it, and the three dialogs the rows open.
 * Each dialog is mounted only while it is open, so every opening starts fresh.
 */
export function ReportsListPanel() {
	const t = useTranslate();
	const list = useForecastReports();
	const [uploading, setUploading] = useState(false);
	const [viewing, setViewing] = useState<ReportDocument | null>(null);
	const [deleting, setDeleting] = useState<ReportDocument | null>(null);

	/* A seeded report, and an uploaded one after a reload, holds no file. */
	const openFile = (report: ReportDocument) => {
		if (!openSafeUrl(report.url)) {
			showToast("error", t(localizationConstants.forecastReportsNoFile));
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.forecastReportsFilterCategory,
						REPORT_CATEGORY_LABELS,
						list.filters.category,
						(value) => list.setFilter("category", value),
					),
				]}
				action={
					<Button
						type="button"
						onClick={() => setUploading(true)}
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto"
					>
						<Upload className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastReportsUploadNew} />
					</Button>
				}
			/>

			<ReportsTable
				reports={list.pageRows}
				sortField={list.sortField}
				sortDir={list.sortDir}
				onSort={list.onSort}
				emptyKey={list.emptyKey}
				onView={setViewing}
				onOpenFile={openFile}
				onDelete={setDeleting}
			/>

			<TablePagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>

			{uploading && <ReportUploadDialog onUpload={list.upload} onClose={() => setUploading(false)} />}

			{viewing && (
				<ReportDetailsDialog
					report={viewing}
					onOpenFile={() => openFile(viewing)}
					onClose={() => setViewing(null)}
				/>
			)}

			<ConfirmActionDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title={localizationConstants.forecastReportsDeleteTitle}
				description={localizationConstants.forecastReportsDeleteDescription}
				confirmLabel={localizationConstants.forecastReportsDelete}
				subject={deleting?.fileName}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default ReportsListPanel;
