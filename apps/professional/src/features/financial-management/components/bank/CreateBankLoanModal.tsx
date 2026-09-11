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
import type { BankLoanItem, BankLoanFormData } from "../../types/bank.types";
import { BankLoanBasicFields } from "./BankLoanBasicFields";
import { BankLoanFinancialFields } from "./BankLoanFinancialFields";
import { BankContactPersonFields } from "./BankContactPersonFields";

export interface CreateBankLoanModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: Partial<BankLoanFormData>) => void;
	onSave?: (data: Partial<BankLoanFormData>) => void;
	initialData?: BankLoanItem | null;
	loanToEdit?: BankLoanItem | null;
}

export function CreateBankLoanModal({
	isOpen,
	onClose,
	onSubmit,
	onSave,
	initialData,
	loanToEdit,
}: CreateBankLoanModalProps) {
	const { t } = useTranslation();
	const activeLoan = loanToEdit ?? initialData ?? null;

	const [formData, setFormData] = useState<BankLoanFormData>({
		loanNr: "#5000",
		title: "",
		loanType: "Fastighetsfinansiering",
		bank: "SEB (Skandinaviska Enskilda Banken)",
		startDate: "2025-06-01",
		endDate: "2026-06-01",
		status: "active",
		interestRate: 3.25,
		monthlyCost: 48500,
		originalAmount: 5000000,
		remainingDebt: 3750000,
		repaidPercent: 25.0,
		contactPerson: {
			name: "Karl Andersson",
			role: "info",
			email: "karl.andersson@seb.se",
			phone: "+46 8 763 80 00",
		},
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (activeLoan) {
			setFormData({
				id: activeLoan.id,
				loanNr: activeLoan.loanNr,
				title: activeLoan.title,
				loanType: activeLoan.loanType,
				bank: activeLoan.bank,
				startDate: activeLoan.startDate,
				endDate: activeLoan.endDate,
				status: activeLoan.status,
				interestRate: activeLoan.interestRate,
				monthlyCost: activeLoan.monthlyCost,
				originalAmount: activeLoan.originalAmount,
				remainingDebt: activeLoan.remainingDebt,
				repaidPercent: activeLoan.repaidPercent,
				contactPerson: activeLoan.contactPerson || {
					name: "",
					role: "",
					email: "",
					phone: "",
				},
			});
		} else {
			setFormData({
				loanNr: "#5000",
				title: "",
				loanType: "Fastighetsfinansiering",
				bank: "SEB (Skandinaviska Enskilda Banken)",
				startDate: new Date().toISOString().slice(0, 10),
				endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000)
					.toISOString()
					.slice(0, 10),
				status: "active",
				interestRate: 3.25,
				monthlyCost: 48500,
				originalAmount: 5000000,
				remainingDebt: 3750000,
				repaidPercent: 25.0,
				contactPerson: {
					name: "Karl Andersson",
					role: "info",
					email: "karl.andersson@seb.se",
					phone: "+46 8 763 80 00",
				},
			});
		}
		setErrors({});
	}, [activeLoan, isOpen]);

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.title.trim()) {
			newErrors.title = t(localizationConstants.valTitleRequired);
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
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						<Translate text={localizationConstants.modalCreateLoanTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<BankLoanBasicFields
						formData={formData}
						errors={errors}
						onChange={setFormData}
						onClearError={(field) => setErrors({ ...errors, [field]: "" })}
					/>

					<BankLoanFinancialFields
						formData={formData}
						onChange={setFormData}
					/>

					{/* Contact Person Sub-section */}
					<BankContactPersonFields
						contactPerson={formData.contactPerson || { name: "", role: "", email: "", phone: "" }}
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
