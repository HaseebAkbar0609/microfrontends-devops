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
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankAccountItem, BankAccountFormData } from "../../types/bank.types";
import { BankAccountFormFields } from "./BankAccountFormFields";
import { BankContactPersonFields } from "./BankContactPersonFields";

export interface CreateBankAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: BankAccountFormData) => void;
	onSave?: (data: BankAccountFormData) => void;
	initialData?: BankAccountItem | null;
	accountToEdit?: BankAccountItem | null;
}

export function CreateBankAccountModal({
	isOpen,
	onClose,
	onSubmit,
	onSave,
	initialData,
	accountToEdit,
}: CreateBankAccountModalProps) {
	const { t } = useTranslation();
	const activeAccount = accountToEdit ?? initialData ?? null;

	const [formData, setFormData] = useState<BankAccountFormData>({
		bankName: "SEB (Skandinaviska Enskilda Banken)",
		accountType: "Företagskonto",
		accountNumber: "",
		iban: "",
		swiftBic: "",
		currency: "SEK",
		balance: 0,
		contactPerson: {
			name: "",
			role: "",
			email: "",
			phone: "",
		},
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (activeAccount) {
			setFormData({
				id: activeAccount.id,
				bankName: activeAccount.bankName,
				accountType: activeAccount.accountType,
				accountNumber: activeAccount.accountNumber,
				iban: activeAccount.iban,
				swiftBic: activeAccount.swiftBic,
				currency: activeAccount.currency,
				balance: activeAccount.balance,
				contactPerson: activeAccount.contactPerson || {
					name: "",
					role: "",
					email: "",
					phone: "",
				},
			});
		} else {
			setFormData({
				bankName: "SEB (Skandinaviska Enskilda Banken)",
				accountType: "Företagskonto",
				accountNumber: "",
				iban: "",
				swiftBic: "",
				currency: "SEK",
				balance: 0,
				contactPerson: {
					name: "",
					role: "",
					email: "",
					phone: "",
				},
			});
		}
		setErrors({});
	}, [activeAccount, isOpen]);

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.accountNumber.trim()) {
			newErrors.accountNumber = t(localizationConstants.valAccountNumberRequired);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		const saveFn = onSubmit || onSave;
		if (saveFn) {
			saveFn(formData);
		}
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						<Translate text={localizationConstants.modalCreateAccountTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<BankAccountFormFields
						formData={formData}
						errors={errors}
						onChange={setFormData}
						onClearError={(field) => setErrors({ ...errors, [field]: "" })}
					/>

					{/* Contact Person Sub-section */}
					<BankContactPersonFields
						contactPerson={formData.contactPerson}
						onChange={(cp) => setFormData({ ...formData, contactPerson: cp })}
					/>

					<DialogFooter className="pt-4 gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="text-xs h-9"
						>
							<Translate text={localizationConstants.btnCancel} />
						</Button>
						<Button
							type="submit"
							className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-9 px-4"
						>
							<Translate text={localizationConstants.btnSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
