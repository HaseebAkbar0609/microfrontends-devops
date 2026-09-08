"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BankInfoForm } from "@/features/personnel/types/createEmployee.types";

interface BankInfoCardProps {
	data: BankInfoForm;
	onChange: (field: keyof BankInfoForm, value: string) => void;
}

export function BankInfoCard({ data, onChange }: BankInfoCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
			<h2 className="text-base font-semibold text-slate-900 mb-5">
				{t(localizationConstants.sectionBankInfo)}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				<div>
					<Label htmlFor="bankName" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldBank)}
					</Label>
					<Input
						id="bankName"
						value={data.bankName}
						onChange={(e) => onChange("bankName", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="clearingNumber" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldClearingNo)}
					</Label>
					<Input
						id="clearingNumber"
						value={data.clearingNumber}
						onChange={(e) => onChange("clearingNumber", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="accountNumber" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldAccountNo)}
					</Label>
					<Input
						id="accountNumber"
						value={data.accountNumber}
						onChange={(e) => onChange("accountNumber", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="swishNumber" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldSwishNo)}
					</Label>
					<Input
						id="swishNumber"
						value={data.swishNumber}
						onChange={(e) => onChange("swishNumber", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="iban" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldIban)}
					</Label>
					<Input
						id="iban"
						value={data.iban}
						onChange={(e) => onChange("iban", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>

				<div>
					<Label htmlFor="bic" className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.fieldBic)}
					</Label>
					<Input
						id="bic"
						value={data.bic}
						onChange={(e) => onChange("bic", e.target.value)}
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm"
					/>
				</div>
			</div>
		</section>
	);
}
