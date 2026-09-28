"use client";

import { useRef, useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CUSTOM_REPORT_NAME_MAX_LENGTH } from "../../../../../constants/forecastCustomReports.constants";

export interface CustomReportNameDialogProps {
	/**
	 * Files the report, or says why it could not be. `null` means saved, and
	 * only then does the dialog close.
	 */
	onSave: (name: string) => TranslationKeys | null;
	onClose: () => void;
}

/**
 * "Rapportens namn": the one thing the register needs that the builder cannot
 * work out for itself. The caller mounts it only while open, so every opening
 * starts empty.
 */
export function CustomReportNameDialog({ onSave, onClose }: CustomReportNameDialogProps) {
	const t = useTranslate();
	const [name, setName] = useState("");
	const [error, setError] = useState<TranslationKeys | null>(null);
	/* Saving also navigates, so a second press must not file a second report. */
	const saved = useRef(false);

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		if (saved.current) return;

		const reason = onSave(name);
		if (reason) {
			setError(reason);
			return;
		}
		saved.current = true;
	};

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastCustomReportsNameTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={submit} noValidate className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="custom-report-name" className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.forecastCustomReportsColName} />
							<span aria-hidden className="text-red-600">*</span>
						</Label>
						<Input
							id="custom-report-name"
							value={name}
							onChange={(event) => {
								setName(event.target.value);
								setError(null);
							}}
							placeholder={t(localizationConstants.forecastCustomReportsNamePlaceholder)}
							maxLength={CUSTOM_REPORT_NAME_MAX_LENGTH}
							autoFocus
							className="h-10 border-slate-200"
						/>
						{error && (
							<p className="text-xs text-red-600">
								{t(error, { max: CUSTOM_REPORT_NAME_MAX_LENGTH })}
							</p>
						)}
					</div>

					<DialogFooter className="gap-2 sm:gap-3">
						<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
							<Translate text={localizationConstants.buttonClose} />
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

export default CustomReportNameDialog;
