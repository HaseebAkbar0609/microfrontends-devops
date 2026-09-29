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
import { WorkingHoursForm } from "../../../types/createEmployee.types";

interface EditWorkingHoursModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: WorkingHoursForm;
	onSave: (data: WorkingHoursForm) => void;
}

export function EditWorkingHoursModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditWorkingHoursModalProps) {
	const [formData, setFormData] = useState<WorkingHoursForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = (field: keyof WorkingHoursForm, value: string) => {
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
						<Translate text={localizationConstants.modalEditWorkingHoursTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldStartWorkDay} />
							</label>
							<Input
								value={formData.startWorkDay}
								onChange={(e) => handleChange("startWorkDay", e.target.value)}
								className="h-8 text-xs bg-white"
								placeholder="Måndag"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldEndWorkDay} />
							</label>
							<Input
								value={formData.endWorkDay}
								onChange={(e) => handleChange("endWorkDay", e.target.value)}
								className="h-8 text-xs bg-white"
								placeholder="Fredag"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldStartFlexTime} />
							</label>
							<Input
								value={formData.startFlexTime}
								onChange={(e) => handleChange("startFlexTime", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="07:00 - 09:00"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldEndFlexTime} />
							</label>
							<Input
								value={formData.endFlexTime}
								onChange={(e) => handleChange("endFlexTime", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="16:00 - 18:00"
							/>
						</div>
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
