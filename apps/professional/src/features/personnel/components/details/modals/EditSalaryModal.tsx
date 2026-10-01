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
import { SalaryCompensationForm } from "../../../types/createEmployee.types";

interface EditSalaryModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: SalaryCompensationForm;
	onSave: (data: SalaryCompensationForm) => void;
}

export function EditSalaryModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditSalaryModalProps) {
	const [formData, setFormData] = useState<SalaryCompensationForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = <K extends keyof SalaryCompensationForm>(
		field: K,
		value: SalaryCompensationForm[K]
	) => {
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
						<Translate text={localizationConstants.modalEditSalaryTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldPaymentDay} />
						</label>
						<Input
							value={formData.paymentDay}
							onChange={(e) => handleChange("paymentDay", e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="25:e varje månad"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldHourlyRate} />
							</label>
							<Input
								value={formData.hourlyRate}
								onChange={(e) => handleChange("hourlyRate", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="225"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldGrossSalary} />
							</label>
							<Input
								value={formData.grossSalary}
								onChange={(e) => handleChange("grossSalary", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="35 000 kr"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 pt-2">
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.overtimeCompensation}
								onChange={(e) => handleChange("overtimeCompensation", e.target.checked)}
								className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.fieldOvertimeCompensation} />
						</label>

						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.travelCompensation}
								onChange={(e) => handleChange("travelCompensation", e.target.checked)}
								className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.fieldTravelCompensation} />
						</label>
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
