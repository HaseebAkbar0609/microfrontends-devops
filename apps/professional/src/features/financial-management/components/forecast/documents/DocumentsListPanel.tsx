"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DOCUMENT_CATEGORY_LABELS,
	documentRoutes,
} from "../../../constants/forecastDocuments.constants";
import { useForecastDocuments } from "../../../hooks/useForecastDocuments";
import type { ForecastDocument } from "../../../types/forecastDocuments.types";
import { ForecastToolbar, forecastFilterGroup } from "../ForecastToolbar";
import { DocumentDetailsDialog } from "./DocumentDetailsDialog";
import { DocumentsTable } from "./DocumentsTable";

export interface DocumentsListPanelProps {
	/** Which module the centre is being read in; every link is built from it. */
	basePath?: string;
}

/**
 * Dokumentcenter: Sök, Filter and "Ladda upp ny" over the register, the
 * frame's centred pagination under it, and the two dialogs the rows open.
 *
 * Uploading is a page of its own rather than a dialog, because a batch of
 * files needs more room than a dialog gives.
 */
export function DocumentsListPanel({ basePath }: DocumentsListPanelProps) {
	const t = useTranslate();
	const router = useRouter();
	const routes = documentRoutes(basePath);
	const list = useForecastDocuments();
	const [viewing, setViewing] = useState<ForecastDocument | null>(null);
	const [deleting, setDeleting] = useState<ForecastDocument | null>(null);

	/* A seeded document, and a new one after a reload, holds no file. */
	const openFile = (document: ForecastDocument) => {
		if (!openSafeUrl(document.url)) {
			showToast("error", t(localizationConstants.forecastDocumentsNoFile));
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.forecastDocumentsFilterCategory,
						DOCUMENT_CATEGORY_LABELS,
						list.filters.category,
						(value) => list.setFilter("category", value),
					),
				]}
				action={
					<Button
						type="button"
						onClick={() => router.push(routes.create)}
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 sm:w-auto"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastDocumentsUploadNew} />
					</Button>
				}
			/>

			<DocumentsTable
				documents={list.pageRows}
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

			{viewing && (
				<DocumentDetailsDialog
					document={viewing}
					onOpenFile={() => openFile(viewing)}
					onClose={() => setViewing(null)}
				/>
			)}

			<ConfirmActionDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title={localizationConstants.forecastDocumentsDeleteTitle}
				description={localizationConstants.forecastDocumentsDeleteDescription}
				confirmLabel={localizationConstants.forecastDocumentsDelete}
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

export default DocumentsListPanel;
