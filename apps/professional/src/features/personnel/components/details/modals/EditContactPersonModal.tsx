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
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { EmergencyContactItem } from "../../../types/createEmployee.types";

interface EditContactPersonModalProps {
	isOpen: boolean;
	onClose: () => void;
	contact: EmergencyContactItem | null;
	onSave: (contact: EmergencyContactItem) => void;
}

export function EditContactPersonModal({
	isOpen,
	onClose,
	contact,
	onSave,
}: EditContactPersonModalProps) {
	const [formData, setFormData] = useState<EmergencyContactItem | null>(contact);

	useEffect(() => {
		if (isOpen && contact) {
			setFormData({ ...contact });
		}
	}, [isOpen, contact]);

	if (!formData) return null;

	const handleChange = (field: keyof EmergencyContactItem, value: string) => {
		setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData) {
			onSave(formData);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-xl">
				<DialogHeader className="pb-3 border-b border-slate-100">
					<DialogTitle className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.modalEditContactPersonTitle} />
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
								<Translate text={localizationConstants.fieldMobile} />
							</label>
							<Input
								value={formData.mobileNumber}
								onChange={(e) => handleChange("mobileNumber", e.target.value)}
								className="h-8 text-xs font-mono bg-white"
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
							<Translate text={localizationConstants.fieldRelation} />
						</label>
						<Input
							value={formData.relation}
							onChange={(e) => handleChange("relation", e.target.value)}
							className="h-8 text-xs bg-white"
							placeholder="Fru, Make, Far, Mor..."
							required
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldComment} />
						</label>
						<Textarea
							value={formData.comment}
							onChange={(e) => handleChange("comment", e.target.value)}
							rows={3}
							className="text-xs bg-white resize-none"
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
