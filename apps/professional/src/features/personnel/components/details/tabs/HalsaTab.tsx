"use client";

import React from "react";
import { useHalsa } from "@/features/personnel/hooks/useHalsa";
import { HalsaHeaderToolbar } from "./halsa/header/HalsaHeaderToolbar";
import { FriskvardCardView } from "./halsa/friskvard/FriskvardCardView";
import { EditFriskvardModal } from "./halsa/friskvard/EditFriskvardModal";
import { RehabCardView } from "./halsa/rehab/RehabCardView";
import { EditRehabModal } from "./halsa/rehab/EditRehabModal";
import { DocumentPreviewModal } from "../modals/DocumentPreviewModal";

interface HalsaTabProps {
	employeeName?: string;
}

export function HalsaTab({ employeeName: _employeeName = "Anna Svensson" }: HalsaTabProps) {
	const {
		subView,
		friskvardData,
		rehabData,
		isEditFriskvardOpen,
		isEditRehabOpen,
		previewDocName,
		handleSetSubView,
		handleOpenEditFriskvard,
		handleCloseEditFriskvard,
		handleSaveFriskvard,
		handleOpenEditRehab,
		handleCloseEditRehab,
		handleSaveRehab,
		handleAddRehabDoc,
		handleDeleteDoc,
		handlePreviewDoc,
		handleClosePreviewDoc,
		handleDownloadDoc,
	} = useHalsa();

	return (
		<div className="space-y-4">
			{/* Sub-view switcher: Friskvård v | Rehab v */}
			<HalsaHeaderToolbar
				subView={subView}
				onSelectSubView={handleSetSubView}
			/>

			{/* Sub-view Content */}
			{subView === "friskvard" ? (
				<FriskvardCardView
					data={friskvardData}
					onEdit={handleOpenEditFriskvard}
				/>
			) : (
				<RehabCardView
					data={rehabData}
					onEdit={handleOpenEditRehab}
					onPreviewDoc={handlePreviewDoc}
					onDownloadDoc={handleDownloadDoc}
				/>
			)}

			{/* Edit Modals */}
			<EditFriskvardModal
				isOpen={isEditFriskvardOpen}
				onClose={handleCloseEditFriskvard}
				initialData={friskvardData}
				onSave={handleSaveFriskvard}
			/>

			<EditRehabModal
				isOpen={isEditRehabOpen}
				onClose={handleCloseEditRehab}
				initialData={rehabData}
				onSave={handleSaveRehab}
				onUploadDoc={handleAddRehabDoc}
				onDeleteDoc={handleDeleteDoc}
				onPreviewDoc={handlePreviewDoc}
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
