"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	BANK_NAME_OPTIONS,
	LOAN_TYPE_OPTIONS,
} from "../../constants/bank.constants";
import type { BankLoanFormData } from "../../types/bank.types";
import { BankContactPersonFields } from "./BankContactPersonFields";

export interface BankLoanBasicStepProps {
	formData: BankLoanFormData;
	errors: Record<string, string>;
	onChange: (data: BankLoanFormData) => void;
	onClearError: (field: string) => void;
}

export function BankLoanBasicStep({
	formData,
	errors,
	onChange,
	onClearError,
}: BankLoanBasicStepProps) {
	return (
		<div className="space-y-5">
			{/* Grundinformation Card */}
			<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.sectionBasicInfo} />
				</h3>

				{/* Readonly ID */}
				<div className="space-y-1 max-w-xs">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.fieldLoanNrOrId} />
					</label>
					<Input
						type="text"
						value={formData.loanNr || "#5000"}
						disabled
						className="h-10 bg-slate-100/70 border-slate-200 text-xs text-slate-500 font-mono"
					/>
				</div>

				{/* Row 1: Title & Bank */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldTitle} /> *
						</label>
						<Input
							type="text"
							value={formData.title}
							onChange={(e) => {
								onChange({ ...formData, title: e.target.value });
								onClearError("title");
							}}
							placeholder="Info"
							className={`h-10 text-xs bg-white ${
								errors.title ? "border-rose-500 focus-visible:ring-rose-500" : ""
							}`}
						/>
						{errors.title && (
							<p className="text-[11px] text-rose-500">{errors.title}</p>
						)}
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldBank} />
						</label>
						<Select
							value={formData.bank}
							onValueChange={(val) => {
								onChange({ ...formData, bank: val });
								onClearError("bank");
							}}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder="Info" />
							</SelectTrigger>
							<SelectContent>
								{BANK_NAME_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs">
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Row 2: Lånetyp & Månadskostnad */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldLoanType} />
						</label>
						<Select
							value={formData.loanType}
							onValueChange={(val) => {
								onChange({ ...formData, loanType: val });
								onClearError("loanType");
							}}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder="Prospekt" />
							</SelectTrigger>
							<SelectContent>
								{LOAN_TYPE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs">
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldMonthlyCost} /> (SEK)
						</label>
						<Input
							type="number"
							value={formData.monthlyCost || ""}
							onChange={(e) =>
								onChange({
									...formData,
									monthlyCost: Number(e.target.value) || 0,
								})
							}
							placeholder="Info"
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>

				{/* Row 3: Ursprungligt belopp & Kvarstående skuld */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldOriginalAmount} /> (SEK)
						</label>
						<Input
							type="number"
							value={formData.originalAmount || ""}
							onChange={(e) =>
								onChange({
									...formData,
									originalAmount: Number(e.target.value) || 0,
								})
							}
							placeholder="Info"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldRemainingDebt} /> (SEK)
						</label>
						<Input
							type="number"
							value={formData.remainingDebt || ""}
							onChange={(e) =>
								onChange({
									...formData,
									remainingDebt: Number(e.target.value) || 0,
								})
							}
							placeholder="Info"
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>

				{/* Row 4: Återbetalt & Start datum */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldRepaidPercent} /> (%)
						</label>
						<Input
							type="number"
							value={formData.repaidPercent || ""}
							onChange={(e) =>
								onChange({
									...formData,
									repaidPercent: Number(e.target.value) || 0,
								})
							}
							placeholder="Info"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldStartDate} />
						</label>
						<Input
							type="date"
							value={formData.startDate}
							onChange={(e) =>
								onChange({ ...formData, startDate: e.target.value })
							}
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>

				{/* Row 5: Slut Datum */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldEndDate} />
						</label>
						<Input
							type="date"
							value={formData.endDate}
							onChange={(e) =>
								onChange({ ...formData, endDate: e.target.value })
							}
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>
			</div>

			{/* Kontakt Person Card */}
			<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.contactPersonHeader} />
				</h3>

				<BankContactPersonFields
					contactPerson={
						formData.contactPerson || {
							name: "",
							role: "",
							email: "",
							phone: "",
						}
					}
					onChange={(cp) => onChange({ ...formData, contactPerson: cp })}
				/>
			</div>
		</div>
	);
}

export default BankLoanBasicStep;
