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
import { BankInfoForm } from "../../../types/createEmployee.types";

interface EditBankInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: BankInfoForm;
	onSave: (data: BankInfoForm) => void;
}

export function EditBankInfoModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditBankInfoModalProps) {
	const [formData, setFormData] = useState<BankInfoForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = (field: keyof BankInfoForm, value: string) => {
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
						<Translate text={localizationConstants.modalEditBankInfoTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldBank} />
							</label>
							<Input
								value={formData.bankName}
								onChange={(e) => handleChange("bankName", e.target.value)}
								className="h-8 text-xs bg-white"
								placeholder="Swedbank, SEB..."
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldClearingNo} />
							</label>
							<Input
								value={formData.clearingNumber}
								onChange={(e) => handleChange("clearingNumber", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="6185"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldAccountNo} />
							</label>
							<Input
								value={formData.accountNumber}
								onChange={(e) => handleChange("accountNumber", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="4563 5000"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldSwishNo} />
							</label>
							<Input
								value={formData.swishNumber}
								onChange={(e) => handleChange("swishNumber", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="070-560 50 60"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldIban} />
							</label>
							<Input
								value={formData.iban}
								onChange={(e) => handleChange("iban", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								placeholder="SE456390056111"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldBic} />
							</label>
							<Input
								value={formData.bic}
								onChange={(e) => handleChange("bic", e.target.value.toUpperCase())}
								className="h-8 text-xs font-mono bg-white uppercase"
								placeholder="ESBVGSSB"
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
