"use client";

import React from "react";
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
import localizationConstants from "@/utils/translation/constants";
import {
	LOAN_TYPE_OPTIONS,
	BANK_NAME_OPTIONS,
} from "../../constants/bank.constants";
import type { BankLoanFormData } from "../../types/bank.types";

interface BankLoanBasicFieldsProps {
	formData: BankLoanFormData;
	errors: Record<string, string>;
	onChange: (updated: BankLoanFormData) => void;
	onClearError: (field: string) => void;
}

export function BankLoanBasicFields({
	formData,
	errors,
	onChange,
	onClearError,
}: BankLoanBasicFieldsProps) {
	return (
		<div className="space-y-4">
			{/* Title & Loan Nr */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colLoanTitle} /> *
					</Label>
					<Input
						value={formData.title}
						onChange={(e) => {
							onChange({ ...formData, title: e.target.value });
							if (errors.title) onClearError("title");
						}}
						placeholder="Fastighetslån 1"
						className={`h-10 text-xs ${errors.title ? "border-red-500" : ""}`}
					/>
					{errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colLoanId} />
					</Label>
					<Input
						value={formData.loanNr}
						onChange={(e) => onChange({ ...formData, loanNr: e.target.value })}
						placeholder="#5000"
						className="h-10 text-xs font-mono"
					/>
				</div>
			</div>

			{/* Bank & Loan Type */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colBank} />
					</Label>
					<Select
						value={formData.bank}
						onValueChange={(val) => onChange({ ...formData, bank: val })}
					>
						<SelectTrigger className="h-10 text-xs">
							<SelectValue />
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
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colLoanType} />
					</Label>
					<Select
						value={formData.loanType}
						onValueChange={(val) => onChange({ ...formData, loanType: val })}
					>
						<SelectTrigger className="h-10 text-xs">
							<SelectValue />
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
			</div>

			{/* Start & End Dates */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colStartDate} />
					</Label>
					<Input
						type="date"
						value={formData.startDate}
						onChange={(e) => onChange({ ...formData, startDate: e.target.value })}
						className="h-10 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colEndDate} />
					</Label>
					<Input
						type="date"
						value={formData.endDate}
						onChange={(e) => onChange({ ...formData, endDate: e.target.value })}
						className="h-10 text-xs"
					/>
				</div>
			</div>
		</div>
	);
}
