"use client";

import React from "react";
import { CreateEmployeeFormData } from "../../../types/createEmployee.types";
import { ViewDocumentsConfigCard } from "../cards/ViewDocumentsConfigCard";
import { ViewAttachedDocumentsCard } from "../cards/ViewAttachedDocumentsCard";

interface DokumentTabProps {
	profileData: CreateEmployeeFormData;
	onDeleteDocument: (id: string) => void;
	onUploadDocument: (tags: string[]) => void;
	onPreviewDoc?: (name: string) => void;
}

export function DokumentTab({
	profileData,
	onDeleteDocument,
	onUploadDocument,
	onPreviewDoc,
}: DokumentTabProps) {
	return (
		<div className="space-y-6">
			{/* Configurations Card */}
			<ViewDocumentsConfigCard config={profileData.documentsConfig} />

			{/* Attached Documents Table & Upload Box */}
			<ViewAttachedDocumentsCard
				items={profileData.attachedDocs}
				onDelete={onDeleteDocument}
				onUpload={onUploadDocument}
				onPreview={onPreviewDoc}
			/>
		</div>
	);
}
