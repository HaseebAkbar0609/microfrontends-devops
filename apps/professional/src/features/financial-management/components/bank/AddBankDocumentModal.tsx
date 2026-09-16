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
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankDocumentItem, BankLoanItem } from "../../types/bank.types";
import { BankDocumentUploadArea } from "./BankDocumentUploadArea";

interface AddBankDocumentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Omit<BankDocumentItem, "id">) => void;
	loans?: BankLoanItem[];
	accounts?: import("../../types/bank.types").BankAccountItem[];
	defaultLoanId?: string;
	defaultAccountId?: string;
}

export function AddBankDocumentModal({
	isOpen,
	onClose,
	onSubmit,
	loans = [],
	accounts = [],
	defaultLoanId = "",
	defaultAccountId = "",
}: AddBankDocumentModalProps) {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [fileType, setFileType] = useState("PDF");
	const [loanId, setLoanId] = useState(defaultLoanId);
	const [accountId, setAccountId] = useState(defaultAccountId);
	const [fileName, setFileName] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (isOpen) {
			setName("");
			setDate(new Date().toISOString().split("T")[0]);
			setFileType("PDF");
			setLoanId(defaultLoanId);
			setAccountId(defaultAccountId);
			setFileName("");
			setError("");
		}
	}, [isOpen, defaultLoanId, defaultAccountId]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError(t(localizationConstants.valTitleRequired));
			return;
		}

		onSubmit({
			name: name.endsWith(`.${fileType.toLowerCase()}`) ? name : `${name}.${fileType.toLowerCase()}`,
			date,
			fileType,
			loanId: loanId || undefined,
			accountId: accountId || undefined,
			fileSize: "1.2 MB",
		});
		onClose();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFileName(file.name);
			if (!name) {
				setName(file.name);
			}
			const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
			setFileType(ext);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white p-6 rounded-2xl">
				<DialogHeader className="mb-4">
					<DialogTitle className="text-xl font-bold text-[#1E293B]">
						<Translate text={localizationConstants.modalAddDocumentTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label className="text-xs font-semibold text-[#475569] mb-1 block">
							<Translate text={localizationConstants.colBankDocName} /> *
						</Label>
						<Input
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (error) setError("");
							}}
							placeholder="skuldebrev.pdf"
							className={`h-11 rounded-lg border text-sm ${
								error ? "border-red-500" : "border-[#E2E8F0]"
							}`}
						/>
						{error && (
							<p className="text-xs text-red-500 mt-1">{error}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label className="text-xs font-semibold text-[#475569] mb-1 block">
								<Translate text={localizationConstants.colDocDate} />
							</Label>
							<Input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="h-11 rounded-lg border border-[#E2E8F0] text-sm"
							/>
						</div>

						<div>
							<Label className="text-xs font-semibold text-[#475569] mb-1 block">
								<Translate text={localizationConstants.colDocFileType} />
							</Label>
							<select
								value={fileType}
								onChange={(e) => setFileType(e.target.value)}
								className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
							>
								<option value="PDF">PDF</option>
								<option value="DOCX">DOCX</option>
								<option value="XLSX">XLSX</option>
								<option value="PNG">PNG</option>
							</select>
						</div>
					</div>

					{accounts.length > 0 && !defaultAccountId && !loanId && (
						<div>
							<Label className="text-xs font-semibold text-[#475569] mb-1 block">
								<Translate text={localizationConstants.tabBankAccounts} />
							</Label>
							<select
								value={accountId}
								onChange={(e) => setAccountId(e.target.value)}
								className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
							>
								<option value="">-- {t(localizationConstants.optionNoLoanDoc)} --</option>
								{accounts.map((a) => (
									<option key={a.id} value={a.id}>
										{a.bankName} ({a.accountNumber || a.iban})
									</option>
								))}
							</select>
						</div>
					)}

					{loans.length > 0 && !defaultLoanId && !accountId && (
						<div>
							<Label className="text-xs font-semibold text-[#475569] mb-1 block">
								<Translate text={localizationConstants.tabBankLoans} />
							</Label>
							<select
								value={loanId}
								onChange={(e) => setLoanId(e.target.value)}
								className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
							>
								<option value="">-- {t(localizationConstants.optionNoLoanDoc)} --</option>
								{loans.map((l) => (
									<option key={l.id} value={l.id}>
										{l.loanNr} - {l.title}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Drag & drop upload area */}
					<BankDocumentUploadArea
						fileName={fileName}
						onFileSelect={handleFileSelect}
					/>

					<DialogFooter className="pt-3 gap-2 flex justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="h-11 px-5 border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 rounded-lg text-sm"
						>
							<Translate text={localizationConstants.btnCancel} />
						</Button>
						<Button
							type="submit"
							className="h-11 px-6 bg-[#0E1726] hover:bg-slate-800 text-white rounded-lg text-sm font-medium"
						>
							<Translate text={localizationConstants.btnSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
