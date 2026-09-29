"use client";

import React, { useMemo } from "react";
import { CreateEmployeeFormData } from "../../../types/createEmployee.types";
import { ViewJobDescriptionCard, JobDescriptionItem } from "../cards/ViewJobDescriptionCard";
import { ViewCompetenceListCard } from "../cards/ViewCompetenceListCard";

interface KompetensTabProps {
	profileData: CreateEmployeeFormData;
	onAddCompetence: () => void;
	onDeleteCompetence: (id: string) => void;
	onUploadJobDescription: (tags: string[]) => void;
	onPreviewDoc?: (name: string) => void;
}

export function KompetensTab({
	profileData,
	onAddCompetence,
	onDeleteCompetence,
	onUploadJobDescription,
	onPreviewDoc,
}: KompetensTabProps) {
	// Derive job description table items matching Screenshot 4
	const jobDescriptionItems: JobDescriptionItem[] = useMemo(() => {
		return profileData.competenceDocs.map((doc) => ({
			id: doc.id,
			date: doc.date,
			name: doc.name,
			fileType: doc.fileType === "doc" ? "doc" : "pdf",
		}));
	}, [profileData.competenceDocs]);

	return (
		<div className="space-y-6">
			{/* Arbetsbeskrivning Card matching Screenshot 4 1:1 */}
			<ViewJobDescriptionCard
				items={jobDescriptionItems}
				onDelete={onDeleteCompetence}
				onUpload={onUploadJobDescription}
				onPreview={onPreviewDoc}
			/>

			{/* Detailed Competence & Certificates Table */}
			<ViewCompetenceListCard
				items={profileData.competenceDocs}
				onAdd={onAddCompetence}
				onDelete={onDeleteCompetence}
				onPreview={onPreviewDoc}
			/>
		</div>
	);
}
