"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import type { CaseDocument } from "../../../types/cases.types";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { ImageUploadSection } from "./ImageUploadSection";

interface DocumentsTabProps {
	documents: CaseDocument[];
	images: CaseDocument[];
	error?: string;
	onAddDocument: (doc: CaseDocument) => void;
	onRemoveDocument: (id: string) => void;
	onAddImage: (img: CaseDocument) => void;
	onRemoveImage: (id: string) => void;
}

export function DocumentsTab({
	documents,
	images,
	error,
	onAddDocument,
	onRemoveDocument,
	onAddImage,
	onRemoveImage,
}: DocumentsTabProps) {
	return (
		<div className="space-y-6">
			{/* Validation Error Banner if user tries to save without attachments */}
			{error && (
				<div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2.5">
					<AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
					<span>{error}</span>
				</div>
			)}

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
