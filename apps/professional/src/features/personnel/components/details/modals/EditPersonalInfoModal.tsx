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
import { PersonalInfoForm } from "../../../types/createEmployee.types";

interface EditPersonalInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialData: PersonalInfoForm;
	onSave: (data: PersonalInfoForm) => void;
}

export function EditPersonalInfoModal({
	isOpen,
	onClose,
	initialData,
	onSave,
}: EditPersonalInfoModalProps) {
	const [formData, setFormData] = useState<PersonalInfoForm>({ ...initialData });

	useEffect(() => {
		if (isOpen) {
			setFormData({ ...initialData });
		}
	}, [isOpen, initialData]);

	const handleChange = (field: keyof PersonalInfoForm, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-xl p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditPersonalInfoTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldFirstName} />
							</label>
							<Input
								value={formData.firstName}
								onChange={(e) => handleChange("firstName", e.target.value)}
								className="h-8 text-xs bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldLastName} />
							</label>
							<Input
								value={formData.lastName}
								onChange={(e) => handleChange("lastName", e.target.value)}
								className="h-8 text-xs bg-white"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldPersonalId} />
							</label>
							<Input
								value={formData.personalId}
								onChange={(e) => handleChange("personalId", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldMobile} />
							</label>
							<Input
								value={formData.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldWorkEmail} />
							</label>
							<Input
								type="email"
								value={formData.workEmail}
								onChange={(e) => handleChange("workEmail", e.target.value)}
								className="h-8 text-xs bg-white"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldPrivateEmail} />
							</label>
							<Input
								type="email"
								value={formData.privateEmail}
								onChange={(e) => handleChange("privateEmail", e.target.value)}
								className="h-8 text-xs bg-white"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldAddress} />
						</label>
						<Input
							value={formData.address}
							onChange={(e) => handleChange("address", e.target.value)}
							className="h-8 text-xs bg-white"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldCity} />
							</label>
							<Input
								value={formData.city}
								onChange={(e) => handleChange("city", e.target.value)}
								className="h-8 text-xs bg-white"
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.fieldPostalCode} />
							</label>
							<Input
								value={formData.postalCode}
								onChange={(e) => handleChange("postalCode", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
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
