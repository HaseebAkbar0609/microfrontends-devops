"use client";

import React from "react";
import { usePersonalDocuments } from "@/features/personnel/hooks/usePersonalDocuments";
import { PersonalDocumentHeaderCard } from "./document/PersonalDocumentHeaderCard";
import { PersonalDocumentUploadBox } from "./document/PersonalDocumentUploadBox";
import { PersonalDocumentTable } from "./document/PersonalDocumentTable";
import { DocumentDeleteDialog } from "./document/DocumentDeleteDialog";
import { DocumentPreviewModal } from "../modals/DocumentPreviewModal";
import { CreateEmployeeFormData } from "@/features/personnel/types/createEmployee.types";

interface DokumentTabProps {
	profileData?: CreateEmployeeFormData;
	onDeleteDocument?: (id: string) => void;
	onUploadDocument?: (tags: string[]) => void;
	onPreviewDoc?: (name: string) => void;
}

export function DokumentTab({
	profileData,
	onDeleteDocument: _onDeleteDocument,
	onUploadDocument: _onUploadDocument,
	onPreviewDoc: _onPreviewDoc,
}: DokumentTabProps) {
	const {
		metadata,
		documents,
		uploadTags,
		docToDelete,
		previewDocName,
		setDocToDelete,
		handleRemoveUploadTag,
		handleAddFiles,
		handleUpload,
		handleConfirmDelete,
		handlePreviewDoc,
		handleClosePreviewDoc,
	} = usePersonalDocuments();

	const activeMetadata = profileData?.documentsConfig
		? {
				employeeHandbook: profileData.documentsConfig.employeeHandbook,
				policy: profileData.documentsConfig.policy,
				jobDescription: profileData.documentsConfig.jobDescription,
		  }
		: metadata;

	return (
		<div className="space-y-6">
			{/* Card 1: Personal dokument (Overview metadata) */}
			<PersonalDocumentHeaderCard metadata={activeMetadata} />

			{/* Card 2: Personal dokument (Upload & Specifikation Table) */}
			<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-6">
				<PersonalDocumentUploadBox
					tags={uploadTags}
					onRemoveTag={handleRemoveUploadTag}
					onFilesSelected={handleAddFiles}
					onUpload={handleUpload}
				/>

				<PersonalDocumentTable
					documents={documents}
					onPreviewDoc={handlePreviewDoc}
					onPromptDelete={setDocToDelete}
				/>
			</div>

			{/* Delete Confirmation Dialog */}
			<DocumentDeleteDialog
				doc={docToDelete}
				onClose={() => setDocToDelete(null)}
				onConfirm={handleConfirmDelete}
			/>

			{/* Document Preview Modal */}
			<DocumentPreviewModal
				isOpen={Boolean(previewDocName)}
				onClose={handleClosePreviewDoc}
				documentName={previewDocName}
			/>
		</div>
	);
}
