"use client";

import React from "react";
import type { CaseDocument } from "../../../types/cases.types";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { ImageUploadSection } from "./ImageUploadSection";

interface DocumentsTabProps {
	documents: CaseDocument[];
	images: CaseDocument[];
	onAddDocument: (doc: CaseDocument) => void;
	onRemoveDocument: (id: string) => void;
	onAddImage: (img: CaseDocument) => void;
	onRemoveImage: (id: string) => void;
}

export function DocumentsTab({
	documents,
	images,
	onAddDocument,
	onRemoveDocument,
	onAddImage,
	onRemoveImage,
}: DocumentsTabProps) {
	return (
		<div className="space-y-6">
			{/* Section 1: Documents Upload & Table */}
			<DocumentUploadSection
				documents={documents}
				onAddDocument={onAddDocument}
				onRemoveDocument={onRemoveDocument}
			/>

			{/* Section 2: Images Upload & Gallery */}
			<ImageUploadSection
				images={images}
				onAddImage={onAddImage}
				onRemoveImage={onRemoveImage}
			/>
		</div>
	);
}

export default DocumentsTab;
