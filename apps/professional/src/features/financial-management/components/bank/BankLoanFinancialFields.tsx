"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankLoanFormData } from "../../types/bank.types";

interface BankLoanFinancialFieldsProps {
	formData: BankLoanFormData;
	onChange: (updated: BankLoanFormData) => void;
}

export function BankLoanFinancialFields({
	formData,
	onChange,
}: BankLoanFinancialFieldsProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.fieldInterestRate} /> (%)
				</Label>
				<Input
					type="number"
					step="0.01"
					value={formData.interestRate ?? 3.25}
					onChange={(e) =>
						onChange({ ...formData, interestRate: parseFloat(e.target.value) || 0 })
					}
					className="h-10 text-xs font-mono"
				/>
			</div>
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.fieldMonthlyCost} /> (kr)
				</Label>
				<Input
					type="number"
					value={formData.monthlyCost ?? 48500}
					onChange={(e) =>
						onChange({ ...formData, monthlyCost: parseFloat(e.target.value) || 0 })
					}
					className="h-10 text-xs font-mono"
				/>
			</div>
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.fieldOriginalAmount} /> (kr)
				</Label>
				<Input
					type="number"
					value={formData.originalAmount ?? 5000000}
					onChange={(e) =>
						onChange({ ...formData, originalAmount: parseFloat(e.target.value) || 0 })
					}
					className="h-10 text-xs font-mono"
				/>
			</div>
			<div>
				<Label className="text-xs font-semibold text-slate-700 mb-1 block">
					<Translate text={localizationConstants.fieldRemainingDebt} /> (kr)
				</Label>
				<Input
					type="number"
					value={formData.remainingDebt ?? 3750000}
					onChange={(e) =>
						onChange({ ...formData, remainingDebt: parseFloat(e.target.value) || 0 })
					}
					className="h-10 text-xs font-mono"
				/>
			</div>
		</div>
	);
}
