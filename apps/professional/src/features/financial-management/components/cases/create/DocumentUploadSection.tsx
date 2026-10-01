"use client";

import React from "react";

import { RecordDocumentsTable } from "@/components/table/RecordDocumentsTable";
import localizationConstants from "@/utils/translation/constants";
import {
	CASE_DOCUMENT_FILE_ACCEPT,
	CASE_DOCUMENT_FILE_RULES,
	CASE_DOCUMENT_TABLE_COPY,
} from "../../../constants/cases.constants";
import { useCaseAttachments } from "../../../hooks/useCaseAttachments";
import type { CaseDocument } from "../../../types/cases.types";
import { CaseUploadCard } from "./CaseUploadCard";

interface DocumentUploadSectionProps {
	documents: CaseDocument[];
	onAddDocument: (doc: CaseDocument) => void;
	onRemoveDocument: (id: string) => void;
}

/** "Dokument": the files this case comes with. */
export function DocumentUploadSection({
	documents,
	onAddDocument,
	onRemoveDocument,
}: DocumentUploadSectionProps) {
	const attachments = useCaseAttachments({
		documents,
		rules: CASE_DOCUMENT_FILE_RULES,
		category: "document",
		onAdd: onAddDocument,
		onRemove: onRemoveDocument,
	});

	return (
		<CaseUploadCard
			titleKey={localizationConstants.casesDocumentsSectionTitle}
			headingKey={localizationConstants.casesUploadYourFiles}
			hintKey={localizationConstants.casesUploadFormats}
			accept={CASE_DOCUMENT_FILE_ACCEPT}
			maxCount={CASE_DOCUMENT_FILE_RULES.maxCount}
			pending={attachments.pending}
			placeholderKey={localizationConstants.casesSelectFiles}
			onSelect={attachments.select}
			onRemovePending={attachments.removePending}
			onUpload={attachments.upload}
			rejection={attachments.rejection}
		>
			<RecordDocumentsTable
				documents={documents}
				types={CASE_DOCUMENT_FILE_RULES.types}
				copy={CASE_DOCUMENT_TABLE_COPY}
				onRemove={attachments.remove}
			/>
		</CaseUploadCard>
	);
}

export default DocumentUploadSection;
