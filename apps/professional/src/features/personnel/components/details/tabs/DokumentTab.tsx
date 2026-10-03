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
	onDeleteDocument,
	onUploadDocument,
	onPreviewDoc,
}: DokumentTabProps) {
	const initialDocs = React.useMemo(() => {
		if (profileData?.attachedDocs && profileData.attachedDocs.length > 0) {
			return profileData.attachedDocs.map((doc) => ({
				id: doc.id,
				date: doc.date,
				name: doc.name,
				fileFormat: doc.fileFormat,
				fileUrl: doc.fileUrl,
			}));
		}
		return undefined;
	}, [profileData?.attachedDocs]);

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
	} = usePersonalDocuments({
		initialDocs,
		onUploadCallback: onUploadDocument,
		onDeleteCallback: onDeleteDocument,
	});

	const activeMetadata = profileData?.documentsConfig
		? {
				employeeHandbook: profileData.documentsConfig.employeeHandbook,
				policy: profileData.documentsConfig.policy,
				jobDescription: profileData.documentsConfig.jobDescription,
		  }
		: metadata;

	const onDocClick = React.useCallback(
		(name: string) => {
			if (onPreviewDoc) {
				onPreviewDoc(name);
			} else {
				handlePreviewDoc(name);
			}
		},
		[onPreviewDoc, handlePreviewDoc]
	);

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
					onPreviewDoc={onDocClick}
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
