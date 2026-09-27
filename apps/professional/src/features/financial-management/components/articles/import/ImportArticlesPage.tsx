"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useArticleImport } from "../../../hooks/useArticleImport";
import { ArticleFileDropzone } from "./ArticleFileDropzone";
import { ArticleImportMappingForms } from "./ArticleImportMappingForms";
import { ArticleImportResultBanner } from "./ArticleImportResultBanner";
import { ArticleImportActionsBar } from "./ArticleImportActionsBar";

export function ImportArticlesPage() {
	const t = useTranslate();
	const {
		selectedFile,
		parsedData,
		mapping,
		isDragging,
		isImporting,
		importResult,
		basicInfoOpen,
		measurementsOpen,
		fileInputRef,
		setBasicInfoOpen,
		setMeasurementsOpen,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleInputChange,
		handleMappingChange,
		handleImport,
		handleDownloadTemplate,
		handleCancel,
	} = useArticleImport();

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Top Bar with Back Button and Title */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.goBackToRegisterLabel)}
					onClick={handleCancel}
					className="h-8 w-8 shrink-0 cursor-pointer"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</Button>
				<h1 className="text-xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.importArticles} />
				</h1>
			</div>

			{/* Dropzone (shown when no file is selected) */}
			{!selectedFile && (
				<ArticleFileDropzone
					isDragging={isDragging}
					selectedFile={selectedFile}
					fileInputRef={fileInputRef}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onInputChange={handleInputChange}
					onDownloadTemplate={handleDownloadTemplate}
				/>
			)}

			{/* File Summary & 2-Column Mapping Section matching Figma */}
			{selectedFile && parsedData && (
				<div className="flex flex-col gap-6">
					<ArticleImportMappingForms
						file={selectedFile}
						parsedData={parsedData}
						mapping={mapping}
						basicInfoOpen={basicInfoOpen}
						measurementsOpen={measurementsOpen}
						onToggleBasicInfo={() => setBasicInfoOpen((prev) => !prev)}
						onToggleMeasurements={() => setMeasurementsOpen((prev) => !prev)}
						onMappingChange={handleMappingChange}
						onRemoveFile={() => {
							if (fileInputRef.current) fileInputRef.current.value = "";
							window.location.reload();
						}}
						onReupload={() => fileInputRef.current?.click()}
					/>
				</div>
			)}

			{/* Result Banner */}
			{importResult && <ArticleImportResultBanner result={importResult} />}

			{/* Actions Bar */}
			<ArticleImportActionsBar
				hasFile={Boolean(selectedFile)}
				isImporting={isImporting}
				onImport={handleImport}
				onCancel={handleCancel}
			/>
		</div>
	);
}

export default ImportArticlesPage;
