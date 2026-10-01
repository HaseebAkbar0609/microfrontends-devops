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
import { WorkDutiesForm } from "../../../types/createEmployee.types";

interface EditWorkDutiesModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: WorkDutiesForm;
	onSave: (data: WorkDutiesForm) => void;
}

export function EditWorkDutiesModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditWorkDutiesModalProps) {
	const [formData, setFormData] = useState<WorkDutiesForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = (field: keyof WorkDutiesForm, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditWorkDutiesTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldRole} />
							</label>
							<Input
								value={formData.role}
								onChange={(e) => handleChange("role", e.target.value)}
								className="h-8 text-xs bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldCategory} />
							</label>
							<Input
								value={formData.category}
								onChange={(e) => handleChange("category", e.target.value)}
								className="h-8 text-xs bg-white"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldStartDate} />
							</label>
							<Input
								type="date"
								value={formData.startDate}
								onChange={(e) => handleChange("startDate", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldDepartment} />
							</label>
							<Input
								value={formData.department}
								onChange={(e) => handleChange("department", e.target.value)}
								className="h-8 text-xs bg-white"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldCity} />
						</label>
						<Input
							value={formData.location}
							onChange={(e) => handleChange("location", e.target.value)}
							className="h-8 text-xs bg-white"
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
