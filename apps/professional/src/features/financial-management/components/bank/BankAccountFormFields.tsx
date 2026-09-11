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
	BANK_ACCOUNT_TYPE_OPTIONS,
	BANK_NAME_OPTIONS,
} from "../../constants/bank.constants";
import type { BankAccountFormData } from "../../types/bank.types";

interface BankAccountFormFieldsProps {
	formData: BankAccountFormData;
	errors: Record<string, string>;
	onChange: (updated: BankAccountFormData) => void;
	onClearError: (field: string) => void;
}

export function BankAccountFormFields({
	formData,
	errors,
	onChange,
	onClearError,
}: BankAccountFormFieldsProps) {
	return (
		<div className="space-y-4">
			{/* Bank Name */}
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.colBank} />
				</Label>
				<Select
					value={formData.bankName}
					onValueChange={(val) => onChange({ ...formData, bankName: val })}
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

			{/* Account Type */}
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.colLoanType} />
				</Label>
				<Select
					value={formData.accountType}
					onValueChange={(val) => onChange({ ...formData, accountType: val })}
				>
					<SelectTrigger className="h-10 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{BANK_ACCOUNT_TYPE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value} className="text-xs">
								<Translate text={opt.labelKey} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Account Number & Currency */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colAccountNumber} /> *
					</Label>
					<Input
						value={formData.accountNumber}
						onChange={(e) => {
							onChange({ ...formData, accountNumber: e.target.value });
							if (errors.accountNumber) onClearError("accountNumber");
						}}
						placeholder="5201 1234567"
						className={`h-10 text-xs ${errors.accountNumber ? "border-red-500" : ""}`}
					/>
					{errors.accountNumber && (
						<p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
					)}
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colCurrency} />
					</Label>
					<Input
						value={formData.currency}
						onChange={(e) => onChange({ ...formData, currency: e.target.value })}
						placeholder="SEK"
						className="h-10 text-xs"
					/>
				</div>
			</div>

			{/* IBAN & SWIFT */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colIban} />
					</Label>
					<Input
						value={formData.iban}
						onChange={(e) => onChange({ ...formData, iban: e.target.value })}
						placeholder="SE45 5000 0000 0520 1123 4567"
						className="h-10 text-xs font-mono"
					/>
				</div>
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1 block">
						<Translate text={localizationConstants.colSwiftBic} />
					</Label>
					<Input
						value={formData.swiftBic}
						onChange={(e) => onChange({ ...formData, swiftBic: e.target.value })}
						placeholder="ESSESESS"
						className="h-10 text-xs font-mono"
					/>
				</div>
			</div>

			{/* Balance */}
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.colBalance} /> (SEK)
				</Label>
				<Input
					type="number"
					value={formData.balance || ""}
					onChange={(e) =>
						onChange({ ...formData, balance: parseFloat(e.target.value) || 0 })
					}
					placeholder="2450000"
					className="h-10 text-xs font-mono"
				/>
			</div>
		</div>
	);
}
