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
import { Switch } from "@/components/ui/switch";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	BANK_NAME_OPTIONS,
	BANK_ACCOUNT_TYPE_OPTIONS,
} from "../../constants/bank.constants";
import type { BankAccountFormData } from "../../types/bank.types";
import { BankContactPersonFields } from "./BankContactPersonFields";

export interface BankAccountBasicStepProps {
	formData: BankAccountFormData;
	errors: Record<string, string>;
	onChange: (data: BankAccountFormData) => void;
	onClearError: (field: string) => void;
}

export function BankAccountBasicStep({
	formData,
	errors,
	onChange,
	onClearError,
}: BankAccountBasicStepProps) {
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
						value={formData.id || "B005"}
						disabled
						className="h-10 bg-slate-100/70 border-slate-200 text-xs text-slate-500 font-mono"
					/>
				</div>

				{/* Row 1: Title & Bank */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldTitle} />
						</label>
						<Input
							type="text"
							value={formData.title || ""}
							onChange={(e) => {
								onChange({ ...formData, title: e.target.value });
								onClearError("title");
							}}
							placeholder="Info"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldBank} />
						</label>
						<Select
							value={formData.bankName}
							onValueChange={(val) => {
								onChange({ ...formData, bankName: val });
								onClearError("bankName");
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

				{/* Row 2: Account Type & Balance */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldAccountType} />
						</label>
						<Select
							value={formData.accountType}
							onValueChange={(val) => {
								onChange({ ...formData, accountType: val });
								onClearError("accountType");
							}}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder="Prospekt" />
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

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.fieldInitialBalance} /> (SEK)
						</label>
						<Input
							type="number"
							value={formData.balance || ""}
							onChange={(e) =>
								onChange({ ...formData, balance: Number(e.target.value) || 0 })
							}
							placeholder="0"
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>

				{/* Row 3: Account Number & IBAN */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.colAccountNumber} /> *
						</label>
						<Input
							type="text"
							value={formData.accountNumber}
							onChange={(e) => {
								onChange({ ...formData, accountNumber: e.target.value });
								onClearError("accountNumber");
							}}
							placeholder="5201 1234567"
							className={`h-10 text-xs bg-white ${
								errors.accountNumber ? "border-rose-500 focus-visible:ring-rose-500" : ""
							}`}
						/>
						{errors.accountNumber && (
							<p className="text-[11px] text-rose-500">{errors.accountNumber}</p>
						)}
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.colIban} />
						</label>
						<Input
							type="text"
							value={formData.iban}
							onChange={(e) => onChange({ ...formData, iban: e.target.value })}
							placeholder="SE45 5000 0000 0520 1123 4567"
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>

				{/* Row 4: SWIFT & Currency */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.colSwiftBic} />
						</label>
						<Input
							type="text"
							value={formData.swiftBic}
							onChange={(e) => onChange({ ...formData, swiftBic: e.target.value })}
							placeholder="ESSESESS"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.colCurrency} />
						</label>
						<Input
							type="text"
							value={formData.currency || "SEK"}
							onChange={(e) => onChange({ ...formData, currency: e.target.value })}
							placeholder="SEK"
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>

				{/* Sync Settings */}
				<div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<Switch
							id="auto-daily-sync"
							checked={formData.autoDailySync ?? true}
							onCheckedChange={(checked) =>
								onChange({ ...formData, autoDailySync: checked })
							}
						/>
						<label
							htmlFor="auto-daily-sync"
							className="text-xs font-medium text-slate-700 cursor-pointer"
						>
							<Translate text={localizationConstants.lblAutoDailySync} />
						</label>
					</div>
				</div>
			</div>

			{/* Kontakt Person Card */}
			<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.contactPersonHeader} />
				</h3>

				<BankContactPersonFields
					contactPerson={formData.contactPerson}
					onChange={(cp) => onChange({ ...formData, contactPerson: cp })}
				/>
			</div>
		</div>
	);
}

export default BankAccountBasicStep;
