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
import { HealthSupportForm } from "../../../types/createEmployee.types";

interface EditHealthSupportModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: HealthSupportForm;
	onSave: (data: HealthSupportForm) => void;
}

export function EditHealthSupportModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditHealthSupportModalProps) {
	const [formData, setFormData] = useState<HealthSupportForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = <K extends keyof HealthSupportForm>(
		field: K,
		value: HealthSupportForm[K]
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
						<Translate text={localizationConstants.modalEditHealthSupportTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldWorkEnvProvider} />
						</label>
						<Input
							value={formData.workEnvironmentProvider}
							onChange={(e) => handleChange("workEnvironmentProvider", e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="AXA - Global Hälsovård, Feelgood..."
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldCoverageStartDate} />
						</label>
						<Input
							type="date"
							value={formData.coverageStartDate}
							onChange={(e) => handleChange("coverageStartDate", e.target.value)}
							className="h-8 text-xs font-mono bg-white"
						/>
					</div>

					<div className="space-y-3 pt-2">
						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.mandatoryMedicalCheckRequired}
								onChange={(e) =>
									handleChange("mandatoryMedicalCheckRequired", e.target.checked)
								}
								className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.fieldMedicalCheckRequired} />
						</label>

						<label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.wellnessAllowance}
								onChange={(e) => handleChange("wellnessAllowance", e.target.checked)}
								className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							/>
							<Translate text={localizationConstants.fieldWellnessAllowance} />
						</label>

						{formData.wellnessAllowance && (
							<div className="space-y-1 pl-6">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.fieldAmount} /> (kr/mån)
								</label>
								<Input
									value={formData.wellnessAmount}
									onChange={(e) => handleChange("wellnessAmount", e.target.value)}
									className="h-8 text-xs font-mono bg-white w-32"
									placeholder="500"
								/>
							</div>
						)}
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
