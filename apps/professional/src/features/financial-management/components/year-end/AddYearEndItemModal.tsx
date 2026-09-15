"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud, Save, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	AVAILABLE_FISCAL_YEARS,
	YEAR_END_CATEGORIES_LIST,
} from "../../constants/yearEnd.constants";
import type {
	YearEndItem,
	YearEndFormData,
	YearEndTabType,
	YearEndCategory,
	YearEndStatus,
} from "../../types/yearEnd.types";

interface AddYearEndItemModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: YearEndFormData) => void;
	editingItem?: YearEndItem | null;
	activeTab: YearEndTabType;
	selectedYear: number;
}

export function AddYearEndItemModal({
	isOpen,
	onClose,
	onSave,
	editingItem,
	activeTab,
	selectedYear,
}: AddYearEndItemModalProps) {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [category, setCategory] = useState<YearEndCategory>("Årsredovisning");
	const [name, setName] = useState("");
	const [fiscalYear, setFiscalYear] = useState<number>(selectedYear);
	const [fileName, setFileName] = useState("Kontrakt.pdf");
	const [fileType, setFileType] = useState<"PDF" | "DOC">("PDF");
	const [status, setStatus] = useState<YearEndStatus>("completed");
	const [notes, setNotes] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (editingItem) {
			setCategory(editingItem.category);
			setName(editingItem.name);
			setFiscalYear(editingItem.fiscalYear);
			setFileName(editingItem.fileName);
			setFileType(editingItem.fileType === "DOC" ? "DOC" : "PDF");
			setStatus(editingItem.status);
			setNotes(editingItem.notes || "");
		} else {
			setCategory("Årsredovisning");
			setName(
				activeTab === "checklist"
					? "Checklist 01"
					: `${selectedYear}-01-01-${selectedYear}-12-31`,
			);
			setFiscalYear(selectedYear);
			setFileName(activeTab === "checklist" ? "Checklist 01" : "Kontrakt.pdf");
			setFileType("PDF");
			setStatus("completed");
			setNotes("");
		}
		setErrors({});
	}, [editingItem, activeTab, selectedYear, isOpen]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const file = files[0];
		const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
		setFileName(file.name);
		setFileType(ext === "DOC" || ext === "DOCX" ? "DOC" : "PDF");
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!name.trim()) {
			newErrors.name = t(localizationConstants.valNameRequired);
		}
		if (!category) {
			newErrors.category = t(localizationConstants.valCategoryRequiredYearEnd);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		onSave({
			id: editingItem?.id,
			srNr: editingItem?.srNr,
			tab: activeTab,
			fiscalYear,
			category,
			name: name.trim(),
			fileName,
			fileType,
			status,
			notes: notes.trim(),
		});

		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg p-0 overflow-hidden bg-white">
				<DialogHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
					<DialogTitle className="text-base font-bold text-slate-900">
						<Translate
							text={
								editingItem
									? localizationConstants.titleEditYearEndItem
									: localizationConstants.titleAddYearEndItem
							}
						/>
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
					{/* Kategori & År */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1 block">
								<Translate text={localizationConstants.fieldCategory} /> *
							</Label>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value as YearEndCategory)}
								className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
							>
								{YEAR_END_CATEGORIES_LIST.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1 block">
								<Translate text={localizationConstants.fieldFiscalYear} /> *
							</Label>
							<select
								value={fiscalYear}
								onChange={(e) => setFiscalYear(Number(e.target.value))}
								className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
							>
								{AVAILABLE_FISCAL_YEARS.map((y) => (
									<option key={y} value={y}>
										{y}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Benämning */}
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1 block">
							<Translate text={localizationConstants.fieldNameOrPeriod} /> *
						</Label>
						<Input
							type="text"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (errors.name) {
									const n = { ...errors };
									delete n.name;
									setErrors(n);
								}
							}}
							placeholder={
								activeTab === "checklist"
									? "Checklist 01"
									: "2025-01-01-2025-12-31"
							}
							className={`h-9 text-xs rounded-lg ${
								errors.name ? "border-rose-500" : "border-slate-200"
							}`}
						/>
						{errors.name && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>
						)}
					</div>

					{/* File Upload Zone */}
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1 block">
							<Translate text={localizationConstants.colFile} />
						</Label>
						<div
							onClick={() => fileInputRef.current?.click()}
							className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-slate-400 transition-colors bg-slate-50/50"
						>
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
								onChange={handleFileSelect}
								className="hidden"
							/>
							<div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
								<UploadCloud className="h-5 w-5 text-slate-400" />
								<p className="text-xs font-medium">
									<Translate text={localizationConstants.fieldDropFileOrBrowse} />
								</p>
								<p className="text-[10px] text-slate-400 font-mono">
									Vald fil: <span className="font-bold text-slate-700">{fileName}</span> ({fileType})
								</p>
							</div>
						</div>
					</div>

					{/* Status */}
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1 block">
							<Translate text={localizationConstants.colStatus} />
						</Label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value as YearEndStatus)}
							className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
						>
							<option value="completed">{t(localizationConstants.statusCompleted)}</option>
							<option value="in_progress">{t(localizationConstants.statusInProgress)}</option>
							<option value="not_started">{t(localizationConstants.statusNotStarted)}</option>
						</select>
					</div>

					{/* Noteringar */}
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1 block">
							<Translate text={localizationConstants.fieldNotes} />
						</Label>
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Anteckningar eller specifikation..."
							rows={3}
							className="text-xs rounded-lg border-slate-200 resize-none"
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="h-8 px-3 text-xs border-slate-200"
						>
							<X className="h-3.5 w-3.5 mr-1" />
							<Translate text={localizationConstants.actionCancel} />
						</Button>
						<Button
							type="submit"
							size="sm"
							className="h-8 px-4 text-xs bg-slate-900 text-white hover:bg-slate-800 gap-1"
						>
							<Save className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.actionSave} />
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddYearEndItemModal;
