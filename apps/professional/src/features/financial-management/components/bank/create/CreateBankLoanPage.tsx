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
	LOAN_TYPE_OPTIONS,
	BANK_NAME_OPTIONS,
} from "../../../constants/bank.constants";
import { bankRepository } from "../../../utils/bankRepository";
import type { BankLoanFormData, BankDocumentItem } from "../../../types/bank.types";
import { toast } from "sonner";

export function CreateBankLoanPage() {
	const router = useRouter();
	const { t } = useTranslation();

	const [formData, setFormData] = useState<BankLoanFormData>({
		title: "",
		loanType: "Företagslån",
		bank: "",
		supplier: "",
		paymentTerms: "30 dagar",
		discount: "2% (10 dagar)",
		overdueInterest: "8%",
		startDate: new Date().toISOString().split("T")[0],
		endDate: "",
		status: "active",
		interestRate: 0,
		monthlyCost: 0,
		originalAmount: 0,
		remainingDebt: 0,
		repaidPercent: 0,
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
		if (!formData.title.trim()) {
			newErrors.title = t(localizationConstants.valTitleRequired);
		}
		if (!formData.bank.trim()) {
			newErrors.bank = t(localizationConstants.valBankRequired);
		}
		if (!formData.startDate) {
			newErrors.startDate = t(localizationConstants.valStartDateRequired);
		}
		if (!formData.endDate) {
			newErrors.endDate = t(localizationConstants.valEndDateRequired);
		}
		if (!formData.originalAmount || Number(formData.originalAmount) <= 0) {
			newErrors.originalAmount = t(localizationConstants.valOriginalAmountRequired);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validate()) return;
		bankRepository.createLoan(formData);
		toast.success(t(localizationConstants.toastLoanCreated));
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
							<Translate text={localizationConstants.titleCreateLoanPage} />
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
				{/* Loan Information Card */}
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
					<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
						<Translate text={localizationConstants.sectionLoanTerms} />
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colVillkorsnamn} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="text"
								value={formData.title}
								onChange={(e) => {
									setFormData((p) => ({ ...p, title: e.target.value }));
									if (errors.title) setErrors((err) => ({ ...err, title: "" }));
								}}
								placeholder="e.g. Standard leverantörsvillkor"
								className={`h-10 text-xs bg-white border-slate-200 ${errors.title ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.title && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.title}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colLoanType} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Select
								value={formData.loanType}
								onValueChange={(val) => setFormData((p) => ({ ...p, loanType: val }))}
							>
								<SelectTrigger className="w-full h-10 text-xs bg-white border-slate-200">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LOAN_TYPE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
											<Translate text={opt.labelKey} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colBank} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Select
								value={formData.bank}
								onValueChange={(val) => {
									setFormData((p) => ({ ...p, bank: val, supplier: val }));
									if (errors.bank) setErrors((e) => ({ ...e, bank: "" }));
								}}
							>
								<SelectTrigger className={`w-full h-10 text-xs bg-white border-slate-200 ${errors.bank ? "border-rose-400 focus:ring-rose-400" : ""}`}>
									<SelectValue placeholder={t(localizationConstants.colBank)} />
								</SelectTrigger>
								<SelectContent>
									{BANK_NAME_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.bank && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.bank}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colBetalningstid} />
							</Label>
							<Input
								type="text"
								value={formData.paymentTerms}
								onChange={(e) => setFormData((p) => ({ ...p, paymentTerms: e.target.value }))}
								placeholder="30 dagar"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colRabatt} />
							</Label>
							<Input
								type="text"
								value={formData.discount}
								onChange={(e) => setFormData((p) => ({ ...p, discount: e.target.value }))}
								placeholder="2% (10 dagar)"
								className="h-10 text-xs bg-white border-slate-200 text-emerald-600 font-medium"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colDrojsmal} />
							</Label>
							<Input
								type="text"
								value={formData.overdueInterest}
								onChange={(e) => setFormData((p) => ({ ...p, overdueInterest: e.target.value }))}
								placeholder="8%"
								className="h-10 text-xs bg-white border-slate-200 text-rose-600 font-medium"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colStartDate} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="date"
								value={formData.startDate}
								onChange={(e) => {
									setFormData((p) => ({ ...p, startDate: e.target.value }));
									if (errors.startDate) setErrors((err) => ({ ...err, startDate: "" }));
								}}
								className={`h-10 text-xs bg-white border-slate-200 ${errors.startDate ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.startDate && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.startDate}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.colEndDate} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="date"
								value={formData.endDate}
								onChange={(e) => {
									setFormData((p) => ({ ...p, endDate: e.target.value }));
									if (errors.endDate) setErrors((err) => ({ ...err, endDate: "" }));
								}}
								className={`h-10 text-xs bg-white border-slate-200 ${errors.endDate ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.endDate && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.endDate}</p>
							)}
						</div>
					</div>
				</div>

				{/* Financials Card */}
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
					<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
						<Translate text={localizationConstants.sectionFinancials} />
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldOriginalAmount} />
								<span className="text-rose-500 ml-1">*</span>
							</Label>
							<Input
								type="number"
								value={formData.originalAmount || ""}
								onChange={(e) => {
									const val = Number(e.target.value) || 0;
									setFormData((p) => ({ ...p, originalAmount: val, remainingDebt: val }));
									if (errors.originalAmount) setErrors((err) => ({ ...err, originalAmount: "" }));
								}}
								placeholder="0"
								className={`h-10 text-xs bg-white border-slate-200 ${errors.originalAmount ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
							/>
							{errors.originalAmount && (
								<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.originalAmount}</p>
							)}
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldMonthlyCost} />
							</Label>
							<Input
								type="number"
								value={formData.monthlyCost || ""}
								onChange={(e) => setFormData((p) => ({ ...p, monthlyCost: Number(e.target.value) || 0 }))}
								placeholder="0"
								className="h-10 text-xs bg-white border-slate-200"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.fieldInterestRate} /> (%)
							</Label>
							<Input
								type="number"
								step="0.01"
								value={formData.interestRate || ""}
								onChange={(e) => setFormData((p) => ({ ...p, interestRate: Number(e.target.value) || 0 }))}
								placeholder="0.00"
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
								placeholder="e.g. Bank Advisor"
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

export default CreateBankLoanPage;
