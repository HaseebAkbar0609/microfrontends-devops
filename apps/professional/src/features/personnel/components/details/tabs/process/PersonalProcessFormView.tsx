"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	PersonalProcessItem,
	PersonalProcessFormData,
} from "@/features/personnel/types/personalProcess.types";
import { usePersonalProcessForm } from "@/features/personnel/hooks/usePersonalProcessForm";
import { ProcessBasicInfoCard } from "./form/ProcessBasicInfoCard";
import { ProcessChecklistCard } from "./form/ProcessChecklistCard";
import { ProcessDocumentsCard } from "./form/ProcessDocumentsCard";
import { ProcessFormActions } from "./form/ProcessFormActions";

interface PersonalProcessFormViewProps {
	initialProcess: PersonalProcessItem | null;
	onSave: (data: PersonalProcessFormData) => void;
	onCancel: () => void;
	onPreviewDoc: (name: string) => void;
}

export function PersonalProcessFormView({
	initialProcess,
	onSave,
	onCancel,
	onPreviewDoc,
}: PersonalProcessFormViewProps) {
	const {
		isEditMode,
		id,
		title,
		setTitle,
		date,
		setDate,
		checklist,
		documents,
		uploadTags,
		handleToggleChecklist,
		handleUpdateChecklistTitle,
		handleAddChecklistRow,
		handleDeleteChecklistRow,
		handleRemoveUploadTag,
		handleAddFiles,
		handleUploadDocuments,
		handleDeleteDocument,
		handleSubmit,
	} = usePersonalProcessForm({
		initialProcess,
		onSave,
		onCancel,
	});

	return (
		<div className="space-y-6">
			{/* Top Header with Back Navigation */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onCancel}
					className="h-8 w-8 text-slate-700 hover:text-slate-900 rounded-md cursor-pointer"
				>
					<ArrowLeft className="w-4 h-4" />
				</Button>
				<h2 className="text-lg font-bold text-slate-900 tracking-tight">
					{isEditMode ? (
						<span>{initialProcess?.title || <Translate text={localizationConstants.processHeaderBackEdit} />}</span>
					) : (
						<Translate text={localizationConstants.processHeaderBackCreate} />
					)}
				</h2>
			</div>

			{/* Form Content */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Card 1: Grundinformation */}
				<ProcessBasicInfoCard
					id={id}
					title={title}
					onTitleChange={setTitle}
					date={date}
					onDateChange={setDate}
				/>

				{/* Card 2: Anpassad checklista */}
				<ProcessChecklistCard
					checklist={checklist}
					onToggleItem={handleToggleChecklist}
					onUpdateTitle={handleUpdateChecklistTitle}
					onAddRow={handleAddChecklistRow}
					onDeleteRow={handleDeleteChecklistRow}
				/>

				{/* Card 3: Dokument */}
				<ProcessDocumentsCard
					documents={documents}
					uploadTags={uploadTags}
					onRemoveTag={handleRemoveUploadTag}
					onFilesSelected={handleAddFiles}
					onUpload={handleUploadDocuments}
					onDeleteDoc={handleDeleteDocument}
					onPreviewDoc={onPreviewDoc}
				/>

				{/* Footer Actions */}
				<ProcessFormActions onCancel={onCancel} />
			</form>
		</div>
	);
}
