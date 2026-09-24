"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Upload, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
	BANK_BASE_ROUTE,
	BANK_ACCOUNT_TYPE_OPTIONS,
	BANK_NAME_OPTIONS,
} from "../../../constants/bank.constants";
import { bankRepository } from "../../../utils/bankRepository";
import type { BankAccountFormData, BankDocumentItem } from "../../../types/bank.types";
import { toast } from "sonner";

export function CreateBankAccountPage() {
	const router = useRouter();
	const { t } = useTranslation();

	const [formData, setFormData] = useState<BankAccountFormData>({
		bankName: "",
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
		documents: [],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.bankName.trim()) {
			newErrors.bankName = t(localizationConstants.valBankRequired);
		}
		if (!formData.accountNumber.trim()) {
			newErrors.accountNumber = t(localizationConstants.valAccountNumberRequired);
		}
		if (!formData.iban.trim()) {
			newErrors.iban = t(localizationConstants.valIbanRequired);
		}
		if (!formData.swiftBic.trim()) {
			newErrors.swiftBic = t(localizationConstants.valSwiftRequired);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validate()) return;
		bankRepository.createAccount(formData);
		toast.success(t(localizationConstants.toastAccountCreated));
		router.push(BANK_BASE_ROUTE);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newDocs: BankDocumentItem[] = Array.from(files).map((file) => ({
			id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			name: file.name,
			date: new Date().toISOString().split("T")[0],
			fileType: file.name.split(".").pop()?.toUpperCase() || "PDF",
			fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
		}));

		setFormData((prev) => ({
			...prev,
			documents: [...(prev.documents || []), ...newDocs],
		}));
	};

	const handleRemoveDoc = (id: string) => {
		setFormData((prev) => ({
			...prev,
			documents: (prev.documents || []).filter((d) => d.id !== id),
		}));
	};

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen px-6 pt-4 pb-16">
			{/* Top Header */}
			<div className="flex items-center justify-between gap-4 mb-6">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.push(BANK_BASE_ROUTE)}
						className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
						aria-label={t(localizationConstants.btnBackToList)}
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
							<Translate text={localizationConstants.titleCreateAccountPage} />
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push(BANK_BASE_ROUTE)}
						className="h-9 px-4 text-xs font-semibold cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.btnCancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold gap-2 cursor-pointer shadow-sm"
					>
						<Save className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.btnSave} />
					</Button>
				</div>
			</div>

			{/* Form Container */}
			<div className="max-w-4xl space-y-6">
				{/* Account Information Card */}
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
					<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
						<Translate text={localizationConstants.sectionAccountInfo} />
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldAccountType} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Select
								value={formData.accountType}
								onValueChange={(val) => setFormData((p) => ({ ...p, accountType: val }))}
							>
								<SelectTrigger className="w-full h-10 text-xs bg-white border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{BANK_ACCOUNT_TYPE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
											<Translate text={opt.labelKey} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldBank} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Select
								value={formData.bankName}
								onValueChange={(val) => {
									setFormData((p) => ({ ...p, bankName: val }));
									if (errors.bankName) setErrors((e) => ({ ...e, bankName: "" }));
								}}
							>
								<SelectTrigger className={`w-full h-10 text-xs bg-white border-slate-200 ${errors.bankName ? "border-rose-400 focus:ring-rose-400" : ""}`}>
									<SelectValue placeholder={t(localizationConstants.fieldBank)} />
								</SelectTrigger>
								<SelectContent>
									{BANK_NAME_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.bankName && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.bankName}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colAccountNumber} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="text"
								value={formData.accountNumber}
								onChange={(e) => {
									setFormData((p) => ({ ...p, accountNumber: e.target.value }));
									if (errors.accountNumber) setErrors((err) => ({ ...err, accountNumber: "" }));
								}}
								placeholder="e.g. 5201 1234567"
								className={`h-10 text-xs bg-white border-slate-200 ${errors.accountNumber ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.accountNumber && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.accountNumber}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colIban} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="text"
								value={formData.iban}
								onChange={(e) => {
									setFormData((p) => ({ ...p, iban: e.target.value }));
									if (errors.iban) setErrors((err) => ({ ...err, iban: "" }));
								}}
								placeholder="e.g. SE45 5000 0000 0520 1123 4567"
								className={`h-10 text-xs bg-white font-mono border-slate-200 ${errors.iban ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.iban && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.iban}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colSwiftBic} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="text"
								value={formData.swiftBic}
								onChange={(e) => {
									setFormData((p) => ({ ...p, swiftBic: e.target.value }));
									if (errors.swiftBic) setErrors((err) => ({ ...err, swiftBic: "" }));
								}}
								placeholder="e.g. ESSESESS"
								className={`h-10 text-xs bg-white font-mono border-slate-200 ${errors.swiftBic ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.swiftBic && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.swiftBic}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colCurrency} />
							</Label>
							<Select
								value={formData.currency}
								onValueChange={(val) => setFormData((p) => ({ ...p, currency: val }))}
							>
								<SelectTrigger className="w-full h-10 text-xs bg-white border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="SEK" className="text-xs">SEK (kr)</SelectItem>
									<SelectItem value="EUR" className="text-xs">EUR (€)</SelectItem>
									<SelectItem value="USD" className="text-xs">USD ($)</SelectItem>
									<SelectItem value="GBP" className="text-xs">GBP (£)</SelectItem>
									<SelectItem value="NOK" className="text-xs">NOK (kr)</SelectItem>
									<SelectItem value="DKK" className="text-xs">DKK (kr)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colBalance} />
							</Label>
							<Input
								type="number"
								value={formData.balance || ""}
								onChange={(e) => setFormData((p) => ({ ...p, balance: Number(e.target.value) || 0 }))}
								placeholder="0"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>
					</div>
				</div>

				{/* Contact Person Card */}
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
					<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
						<Translate text={localizationConstants.contactPersonHeader} />
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldContactName} />
							</Label>
							<Input
								type="text"
								value={formData.contactPerson?.name || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										contactPerson: { ...(p.contactPerson || { role: "", email: "", phone: "" }), name: e.target.value },
									}))
								}
								placeholder="e.g. Karl Andersson"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldContactRole} />
							</Label>
							<Input
								type="text"
								value={formData.contactPerson?.role || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										contactPerson: { ...(p.contactPerson || { name: "", email: "", phone: "" }), role: e.target.value },
									}))
								}
								placeholder="e.g. Account Manager"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldContactEmail} />
							</Label>
							<Input
								type="email"
								value={formData.contactPerson?.email || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										contactPerson: { ...(p.contactPerson || { name: "", role: "", phone: "" }), email: e.target.value },
									}))
								}
								placeholder="karl.andersson@seb.se"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldContactPhone} />
							</Label>
							<Input
								type="text"
								value={formData.contactPerson?.phone || ""}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										contactPerson: { ...(p.contactPerson || { name: "", role: "", email: "" }), phone: e.target.value },
									}))
								}
								placeholder="+46 8 763 80 00"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>
					</div>
				</div>

				{/* Document Upload Card */}
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
					<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
						<Translate text={localizationConstants.sectionDocuments} />
					</h2>

					<label className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
						<Upload className="w-8 h-8 text-slate-400 mb-2" />
						<span className="text-xs font-semibold text-slate-700 mb-1">
							<Translate text={localizationConstants.uploadFilesTitle} />
						</span>
						<span className="text-[11px] text-slate-400">
							<Translate text={localizationConstants.uploadFilesSubtitle} />
						</span>
						<input
							type="file"
							multiple
							accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
							onChange={handleFileUpload}
							className="hidden"
						/>
					</label>

					{/* Uploaded Documents List */}
					{formData.documents && formData.documents.length > 0 && (
						<div className="space-y-2 pt-2">
							{formData.documents.map((doc) => (
								<div
									key={doc.id}
									className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
								>
									<div className="flex items-center gap-2.5">
										<FileText className="w-4 h-4 text-slate-500 shrink-0" />
										<div>
											<p className="font-semibold text-slate-800">{doc.name}</p>
											<p className="text-[11px] text-slate-400">{doc.date} • {doc.fileType}</p>
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveDoc(doc.id)}
										className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default CreateBankAccountPage;
