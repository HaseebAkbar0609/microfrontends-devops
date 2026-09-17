"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../../components/ProjectRowsToolbar";
import { DocumentUploadDialog } from "../form/DocumentUploadDialog";
import { useDocumentList } from "../hooks/useDocumentList";
import type { ProjectDocumentsState } from "../hooks/useProjectDocuments";
import { DOCUMENT_KIND_META, VIEW_KIND, type DocumentView } from "../projectDocuments.config";
import type { ProjectDocument } from "../types";
import { DocumentsTable } from "./DocumentsTable";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a dropdown item closes; defer by a macrotask. A timeout, not
   requestAnimationFrame, which never fires in an occluded page. */
const defer = (fn: () => void) => setTimeout(fn, 0);

export interface DocumentsPanelProps {
	view: DocumentView;
	documents: ProjectDocumentsState;
}

/**
 * One tab: Sök, Filter, print and the upload button over the table, then
 * paging. Arkiv has no upload — a file arrives there by being archived.
 */
export function DocumentsPanel({ view, documents }: DocumentsPanelProps) {
	const list = useDocumentList(view, documents.documents, documents.labels);
	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState<ProjectDocument | null>(null);
	const kind = view === "arkiv" ? null : VIEW_KIND[view];

	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				filter={list.filter}
				onFilterChange={list.setFilter}
				filterOptions={list.filterOptions}
				action={
					kind && (
						<Button
							type="button"
							onClick={() => setUploading(true)}
							className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
						>
							<Plus className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={DOCUMENT_KIND_META[kind].uploadKey} />
						</Button>
					)
				}
			/>

			<DocumentsTable
				list={list}
				labels={documents.labels}
				onOpen={documents.open}
				onToggleArchive={documents.toggleArchive}
				onDelete={(doc) => defer(() => setDeleting(doc))}
			/>

			<TablePagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>

			{uploading && kind && (
				<DocumentUploadDialog
					kind={kind}
					onUpload={(input) => {
						const created = documents.upload(input);
						if (created) list.reveal(created);
						return Boolean(created);
					}}
					onClose={() => setUploading(false)}
				/>
			)}

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectDocumentsDeleteTitle}
				description={localizationConstants.projectDocumentsDeleteBody}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={deleting?.name}
				destructive
				onConfirm={() => {
					if (deleting) documents.remove(deleting);
					setDeleting(null);
				}}
			/>
		</div>
	);
}

export default DocumentsPanel;
