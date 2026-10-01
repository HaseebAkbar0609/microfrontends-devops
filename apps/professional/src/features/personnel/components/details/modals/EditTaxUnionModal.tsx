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
import { TaxUnionForm } from "../../../types/createEmployee.types";

interface EditTaxUnionModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: TaxUnionForm;
	onSave: (data: TaxUnionForm) => void;
}

export function EditTaxUnionModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditTaxUnionModalProps) {
	const [formData, setFormData] = useState<TaxUnionForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = (field: keyof TaxUnionForm, value: string) => {
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
						<Translate text={localizationConstants.modalEditTaxUnionTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldTaxTable} />
						</label>
						<Input
							value={formData.taxTable}
							onChange={(e) => handleChange("taxTable", e.target.value)}
							className="h-8 text-xs font-mono bg-white"
							placeholder="32"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldCollectiveAgreement} />
						</label>
						<Input
							value={formData.collectiveAgreement}
							onChange={(e) => handleChange("collectiveAgreement", e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="Yes / Ja"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldUnionAffiliation} />
						</label>
						<Input
							value={formData.unionAffiliation}
							onChange={(e) => handleChange("unionAffiliation", e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="Unionen, Byggnads..."
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
