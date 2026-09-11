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
	BANK_ACCOUNT_TYPE_OPTIONS,
	BANK_NAME_OPTIONS,
} from "../../constants/bank.constants";
import type { BankAccountItem, BankAccountFormData } from "../../types/bank.types";

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
					{/* Bank Name */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1">
							<Translate text={localizationConstants.colBank} />
						</label>
						<Select
							value={formData.bankName}
							onValueChange={(val) => setFormData((p) => ({ ...p, bankName: val }))}
						>
							<SelectTrigger className="h-9 text-sm bg-white border-slate-200">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{BANK_NAME_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.label}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Account Type */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1">
							Kategori / Typ
						</label>
						<Select
							value={formData.accountType}
							onValueChange={(val) =>
								setFormData((p) => ({ ...p, accountType: val }))
							}
						>
							<SelectTrigger className="h-9 text-sm bg-white border-slate-200">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{BANK_ACCOUNT_TYPE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Kontonummer & Valuta */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colAccountNumber} /> *
							</label>
							<Input
								type="text"
								value={formData.accountNumber}
								onChange={(e) =>
									setFormData((p) => ({ ...p, accountNumber: e.target.value }))
								}
								placeholder="5201 1234567"
								className={`h-9 text-sm ${
									errors.accountNumber ? "border-rose-500 bg-rose-50/20" : ""
								}`}
							/>
							{errors.accountNumber && (
								<p className="text-xs text-rose-600 mt-1">{errors.accountNumber}</p>
							)}
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colCurrency} />
							</label>
							<Input
								type="text"
								value={formData.currency}
								onChange={(e) =>
									setFormData((p) => ({ ...p, currency: e.target.value }))
								}
								placeholder="SEK"
								className="h-9 text-sm"
							/>
						</div>
					</div>

					{/* IBAN & SWIFT */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colIban} />
							</label>
							<Input
								type="text"
								value={formData.iban}
								onChange={(e) =>
									setFormData((p) => ({ ...p, iban: e.target.value }))
								}
								placeholder="SE45 5000 0000 0520 1123 4567"
								className="h-9 text-sm font-mono"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								<Translate text={localizationConstants.colSwiftBic} />
							</label>
							<Input
								type="text"
								value={formData.swiftBic}
								onChange={(e) =>
									setFormData((p) => ({ ...p, swiftBic: e.target.value }))
								}
								placeholder="ESSESESS"
								className="h-9 text-sm font-mono"
							/>
						</div>
					</div>

					{/* Saldo */}
					<div>
						<label className="block text-xs font-semibold text-slate-700 mb-1">
							<Translate text={localizationConstants.colBalance} /> (SEK)
						</label>
						<Input
							type="number"
							value={formData.balance || ""}
							onChange={(e) =>
								setFormData((p) => ({
									...p,
									balance: Number(e.target.value) || 0,
								}))
							}
							placeholder="2450000"
							className="h-9 text-sm font-mono"
						/>
					</div>

					{/* Contact Person */}
					<div className="pt-3 border-t border-slate-100 space-y-3">
						<span className="text-xs font-semibold text-slate-900 block">
							<Translate text={localizationConstants.contactPersonHeader} />
						</span>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 mb-1">
									<Translate text={localizationConstants.fieldContactName} />
								</label>
								<Input
									type="text"
									value={formData.contactPerson?.name || ""}
									onChange={(e) =>
										setFormData((p) => ({
											...p,
											contactPerson: {
												...p.contactPerson,
												name: e.target.value,
												role: p.contactPerson?.role || "info",
												email: p.contactPerson?.email || "",
												phone: p.contactPerson?.phone || "",
											},
										}))
									}
									placeholder="Karl Andersson"
									className="h-9 text-sm"
								/>
							</div>

							<div>
								<label className="block text-xs font-medium text-slate-600 mb-1">
									<Translate text={localizationConstants.fieldContactRole} />
								</label>
								<Input
									type="text"
									value={formData.contactPerson?.role || ""}
									onChange={(e) =>
										setFormData((p) => ({
											...p,
											contactPerson: {
												...p.contactPerson,
												role: e.target.value,
												name: p.contactPerson?.name || "",
												email: p.contactPerson?.email || "",
												phone: p.contactPerson?.phone || "",
											},
										}))
									}
									placeholder="info"
									className="h-9 text-sm"
								/>
							</div>

							<div>
								<label className="block text-xs font-medium text-slate-600 mb-1">
									<Translate text={localizationConstants.fieldContactEmail} />
								</label>
								<Input
									type="email"
									value={formData.contactPerson?.email || ""}
									onChange={(e) =>
										setFormData((p) => ({
											...p,
											contactPerson: {
												...p.contactPerson,
												email: e.target.value,
												name: p.contactPerson?.name || "",
												role: p.contactPerson?.role || "info",
												phone: p.contactPerson?.phone || "",
											},
										}))
									}
									placeholder="karl.andersson@seb.se"
									className="h-9 text-sm"
								/>
							</div>

							<div>
								<label className="block text-xs font-medium text-slate-600 mb-1">
									<Translate text={localizationConstants.fieldContactPhone} />
								</label>
								<Input
									type="text"
									value={formData.contactPerson?.phone || ""}
									onChange={(e) =>
										setFormData((p) => ({
											...p,
											contactPerson: {
												...p.contactPerson,
												phone: e.target.value,
												name: p.contactPerson?.name || "",
												role: p.contactPerson?.role || "info",
												email: p.contactPerson?.email || "",
											},
										}))
									}
									placeholder="+46 8 763 80 00"
									className="h-9 text-sm"
								/>
							</div>
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
