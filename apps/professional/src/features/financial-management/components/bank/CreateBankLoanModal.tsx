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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	LOAN_TYPE_OPTIONS,
	BANK_NAME_OPTIONS,
} from "../../constants/bank.constants";
import type { BankLoanItem, BankLoanFormData } from "../../types/bank.types";

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
		bank: "SEB",
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
				bank: "SEB",
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
					{/* Titel & Lån nr */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="sm:col-span-2">
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colLoanTitle} /> *
							</label>
							<Input
								type="text"
								value={formData.title}
								onChange={(e) =>
									setFormData((p) => ({ ...p, title: e.target.value }))
								}
								placeholder="Fastighetslån 1"
								className={`h-9 text-sm ${
									errors.title ? "border-rose-500 bg-rose-50/20" : ""
								}`}
							/>
							{errors.title && (
								<p className="text-xs text-rose-600 mt-1">{errors.title}</p>
							)}
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colLoanId} />
							</label>
							<Input
								type="text"
								value={formData.loanNr}
								onChange={(e) =>
									setFormData((p) => ({ ...p, loanNr: e.target.value }))
								}
								placeholder="#5000"
								className="h-9 text-sm font-mono"
							/>
						</div>
					</div>

					{/* Lånetyp & Bank */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colLoanType} />
							</label>
							<Select
								value={formData.loanType}
								onValueChange={(val) => setFormData((p) => ({ ...p, loanType: val }))}
							>
								<SelectTrigger className="h-9 text-sm bg-white border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LOAN_TYPE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colBank} />
							</label>
							<Select
								value={formData.bank}
								onValueChange={(val) => setFormData((p) => ({ ...p, bank: val }))}
							>
								<SelectTrigger className="h-9 text-sm bg-white border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{BANK_NAME_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Start Datum & Slut Datum */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colStartDate} />
							</label>
							<Input
								type="date"
								value={formData.startDate}
								onChange={(e) =>
									setFormData((p) => ({ ...p, startDate: e.target.value }))
								}
								className="h-9 text-sm"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colEndDate} />
							</label>
							<Input
								type="date"
								value={formData.endDate}
								onChange={(e) =>
									setFormData((p) => ({ ...p, endDate: e.target.value }))
								}
								className="h-9 text-sm"
							/>
						</div>
					</div>

					{/* Ränta, Månadskostnad, Ursprungligt belopp, Kvarstående skuld */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.fieldInterestRate} /> (%)
							</label>
							<Input
								type="number"
								step="0.01"
								value={formData.interestRate || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										interestRate: Number(e.target.value) || 0,
									}))
								}
								placeholder="3.25"
								className="h-9 text-sm font-mono"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.fieldMonthlyCost} />
							</label>
							<Input
								type="number"
								value={formData.monthlyCost || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										monthlyCost: Number(e.target.value) || 0,
									}))
								}
								placeholder="48500"
								className="h-9 text-sm font-mono"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.fieldOriginalAmount} />
							</label>
							<Input
								type="number"
								value={formData.originalAmount || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										originalAmount: Number(e.target.value) || 0,
									}))
								}
								placeholder="5000000"
								className="h-9 text-sm font-mono"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.fieldRemainingDebt} />
							</label>
							<Input
								type="number"
								value={formData.remainingDebt || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										remainingDebt: Number(e.target.value) || 0,
									}))
								}
								placeholder="3750000"
								className="h-9 text-sm font-mono"
							/>
						</div>
					</div>

					<DialogFooter className="pt-3 gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.btnCancel} />
						</Button>
						<Button
							type="submit"
							className="bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
						>
							<Translate text={localizationConstants.btnSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
