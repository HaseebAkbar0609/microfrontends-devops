"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { customReportRoutes } from "../../../../constants/forecastCustomReports.constants";
import { useCustomReports } from "../../../../hooks/useCustomReports";
import type { CustomReport } from "../../../../types/forecastCustomReports.types";
import { ForecastToolbar } from "../../ForecastToolbar";
import { CustomReportDetailsDialog } from "./CustomReportDetailsDialog";
import { CustomReportsTable } from "./CustomReportsTable";

export interface CustomReportsPanelProps {
	/** Which module the register is mounted in; the builder's link is built from it. */
	basePath?: string;
}

/**
 * Anpassade rapporter: Sök and "Skapa ny rapport" over the saved reports, the
 * frame's centred pagination under them, and the two dialogs the rows open.
 *
 * The toolbar is given no filter groups, so Filter steps aside — a saved
 * report is a name, a column set and a date, with nothing to narrow by.
 */
export function CustomReportsPanel({ basePath }: CustomReportsPanelProps) {
	const routes = customReportRoutes(basePath);
	const list = useCustomReports();
	const [viewing, setViewing] = useState<CustomReport | null>(null);
	const [deleting, setDeleting] = useState<CustomReport | null>(null);

	return (
		<div className="flex flex-col gap-5">
			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[]}
				action={
					<Button
						asChild
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto"
					>
						{/* A link, so the builder opens in a new tab on a middle click too. */}
						<Link href={routes.create}>
							<Plus className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.forecastCustomReportsCreateNew} />
						</Link>
					</Button>
				}
			/>

			<CustomReportsTable
				reports={list.pageRows}
				sortField={list.sortField}
				sortDir={list.sortDir}
				onSort={list.onSort}
				emptyKey={list.emptyKey}
				onView={setViewing}
				onDownload={list.download}
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

			{viewing && (
				<CustomReportDetailsDialog
					report={viewing}
					onDownload={() => list.download(viewing)}
					onClose={() => setViewing(null)}
				/>
			)}

			<ConfirmActionDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title={localizationConstants.forecastCustomReportsDeleteTitle}
				description={localizationConstants.forecastCustomReportsDeleteDescription}
				confirmLabel={localizationConstants.forecastReportsDelete}
				subject={deleting?.name}
				destructive
				onConfirm={() => {
					if (deleting) list.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default CustomReportsPanel;
