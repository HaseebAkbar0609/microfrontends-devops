"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { RecordDocumentsTable } from "@/components/table/RecordDocumentsTable";
import localizationConstants from "@/utils/translation/constants";
import {
	DOCUMENT_FILE_RULES,
	DOCUMENT_TABLE_COPY,
} from "../../../../constants/forecastDocuments.constants";
import { useDocumentUploadForm } from "../../../../hooks/useDocumentUploadForm";
import { CreateDocumentFooter } from "./CreateDocumentFooter";
import { CreateDocumentHeader } from "./CreateDocumentHeader";
import { DocumentUploadCard } from "./DocumentUploadCard";

export interface CreateDocumentPageProps {
	/** Which module the centre is being used in; the way back is built from it. */
	basePath?: string;
}

/**
 * "Skapa ny": a batch of files filed under one category.
 *
 * A page rather than a dialog because a batch needs room — the staged table
 * grows with every file taken, and the reader has to be able to see and undo
 * what they have added before saving any of it.
 */
export function CreateDocumentPage({ basePath }: CreateDocumentPageProps) {
	const form = useDocumentUploadForm(basePath);

	return (
		<div className="flex flex-1 flex-col bg-white">
			<CreateDocumentHeader onBack={form.requestLeave} />

			<div className="flex-1 px-6 py-5">
				<DocumentUploadCard form={form}>
					<RecordDocumentsTable
						documents={form.staged}
						types={DOCUMENT_FILE_RULES.types}
						copy={DOCUMENT_TABLE_COPY}
						onRemove={form.removeStaged}
					/>
				</DocumentUploadCard>
			</div>

			<CreateDocumentFooter onCancel={form.requestLeave} onSave={form.submit} />

			<ConfirmActionDialog
				open={form.leaving}
				onOpenChange={(next) => !next && form.setLeaving(false)}
				title={localizationConstants.forecastDocumentsLeaveTitle}
				description={localizationConstants.forecastDocumentsLeaveBody}
				confirmLabel={localizationConstants.forecastDocumentsLeaveConfirm}
				destructive
				onConfirm={() => {
					form.setLeaving(false);
					form.leave();
				}}
			/>
		</div>
	);
}

export default CreateDocumentPage;
