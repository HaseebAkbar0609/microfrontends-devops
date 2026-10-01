"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { WorkInfoForm } from "../../../types/createEmployee.types";

interface EditWorkInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: WorkInfoForm;
	onSave: (data: WorkInfoForm) => void;
}

export function EditWorkInfoModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditWorkInfoModalProps) {
	const [formData, setFormData] = useState<WorkInfoForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = (field: keyof WorkInfoForm, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditWorkInfoTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldWorkingHours} />
						</label>
						<Input
							value={formData.workingHours}
							onChange={(e) => handleChange("workingHours", e.target.value)}
							className="h-8 text-xs font-mono bg-white"
							placeholder="40"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldEmploymentForm} />
						</label>
						<Input
							value={formData.employmentForm}
							onChange={(e) => handleChange("employmentForm", e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="Fast, Provanställning..."
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldAnnualVacation} />
						</label>
						<Input
							value={formData.annualVacationDays}
							onChange={(e) => handleChange("annualVacationDays", e.target.value)}
							className="h-8 text-xs font-mono bg-white"
							placeholder="30"
						/>
					</div>

					<DialogFooter className="pt-3 border-t border-slate-100 flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onClose}
							className="h-8 px-4 text-xs"
						>
							<Translate text={localizationConstants.btnCancelCard} />
						</Button>
						<Button
							type="submit"
							size="sm"
							className="h-8 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white shadow-2xs"
						>
							<Translate text={localizationConstants.btnSaveChanges} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
