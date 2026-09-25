"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { REPORT_CATEGORIES, REPORT_CATEGORY_LABELS } from "../../../constants/forecastReports.constants";
import type { ReportCategory, ReportUploadInput } from "../../../types/forecastReports.types";
import { ReportFilePicker } from "./ReportFilePicker";

export interface ReportUploadDialogProps {
	/** Stores the report, or refuses it; the dialog closes only on a yes. */
	onUpload: (input: ReportUploadInput) => boolean;
	onClose: () => void;
}

/**
 * "Ladda upp ny": which part of the forecast the report covers, and the file
 * itself. The caller mounts it only while open, so every opening starts empty.
 */
export function ReportUploadDialog({ onUpload, onClose }: ReportUploadDialogProps) {
	const t = useTranslate();
	const [category, setCategory] = useState<ReportCategory | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [categoryError, setCategoryError] = useState<TranslationKeys | null>(null);
	const [fileError, setFileError] = useState<TranslationKeys | null>(null);

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		setCategoryError(category ? null : localizationConstants.forecastReportsCategoryRequired);
		if (!file) setFileError(localizationConstants.forecastReportsFileRequired);
		if (!category || !file) return;

		if (onUpload({ category, file })) onClose();
	};

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastReportsUploadTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={submit} noValidate className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="report-category" className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.forecastReportsColCategory} />
							<span aria-hidden className="text-red-600">*</span>
						</Label>
						<Select
							value={category ?? undefined}
							onValueChange={(next) => {
								setCategory(next as ReportCategory);
								setCategoryError(null);
							}}
						>
							<SelectTrigger id="report-category" className="h-10 w-full cursor-pointer border-slate-200">
								<SelectValue placeholder={t(localizationConstants.forecastReportsCategoryPlaceholder)} />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{REPORT_CATEGORIES.map((option) => (
									<SelectItem key={option} value={option} className="cursor-pointer">
										<Translate text={REPORT_CATEGORY_LABELS[option]} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{categoryError && (
							<p className="text-xs text-red-600">
								<Translate text={categoryError} />
							</p>
						)}
					</div>

					<ReportFilePicker file={file} onChange={setFile} error={fileError} onError={setFileError} />

					<DialogFooter className="gap-2 sm:gap-3">
						<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
							<Save className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.buttonSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default ReportUploadDialog;
