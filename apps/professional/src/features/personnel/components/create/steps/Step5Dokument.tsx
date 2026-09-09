"use client";

import React from "react";
import {
	EmployeeDocumentsForm,
	AttachedDocItem,
} from "@/features/personnel/types/createEmployee.types";
import { DocumentConfigCard } from "./step5/DocumentConfigCard";
import { AttachedDocumentsTableCard } from "./step5/AttachedDocumentsTableCard";

interface Step5DokumentProps {
	config: EmployeeDocumentsForm;
	uploadedTags: string[];
	attachedDocs: AttachedDocItem[];
	onUpdateConfig: (field: keyof EmployeeDocumentsForm, value: string) => void;
	onRemoveTag: (tag: string) => void;
	onAddDoc: (doc: Omit<AttachedDocItem, "id">) => void;
	onRemoveDoc: (id: string) => void;
}

export function Step5Dokument({
	config,
	uploadedTags,
	attachedDocs,
	onUpdateConfig,
	onRemoveTag,
	onAddDoc,
	onRemoveDoc,
}: Step5DokumentProps) {
	return (
		<div className="space-y-6">
			{/* Configurations & Upload Card */}
			<DocumentConfigCard
				config={config}
				uploadedTags={uploadedTags}
				onUpdateConfig={onUpdateConfig}
				onRemoveTag={onRemoveTag}
				onAddDoc={onAddDoc}
			/>

			{/* Attached Documents Table */}
			<AttachedDocumentsTableCard
				attachedDocs={attachedDocs}
				onRemoveDoc={onRemoveDoc}
			/>
		</div>
	);
}
