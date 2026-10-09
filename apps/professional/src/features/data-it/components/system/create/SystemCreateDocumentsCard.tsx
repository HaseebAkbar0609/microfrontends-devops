"use client";

import React from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { SystemCreateDocumentUpload } from "./SystemCreateDocumentUpload";
import { SystemCreateDocumentTable } from "./SystemCreateDocumentTable";
import type { SystemDocument } from "@/features/data-it/types/dataItSystem.types";

interface SystemCreateDocumentsCardProps {
	documents: SystemDocument[];
	onAddDocument: (doc: SystemDocument) => void;
	onRemoveDocument: (id: string) => void;
}

export const SystemCreateDocumentsCard: React.FC<
	SystemCreateDocumentsCardProps
> = ({ documents, onAddDocument, onRemoveDocument }) => {
	const t = useTranslate();

	const handleCommitDocuments = (docs: SystemDocument[]) => {
		docs.forEach((doc) => onAddDocument(doc));
	};

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			<h2 className="border-b border-slate-100 pb-4 text-base font-semibold text-slate-900">
				{t(localizationConstants.dataItSystemCreateDocumentsCard)}
			</h2>

			<div className="space-y-6">
				{/* Multi-pill document selector & upload area */}
				<SystemCreateDocumentUpload
					onCommitDocuments={handleCommitDocuments}
				/>

				{/* Uploaded documents table */}
				<SystemCreateDocumentTable
					documents={documents}
					onRemoveDocument={onRemoveDocument}
				/>
			</div>
		</div>
	);
};

export default SystemCreateDocumentsCard;
