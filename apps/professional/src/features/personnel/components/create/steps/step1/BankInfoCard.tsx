"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CircleUser } from "lucide-react";
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
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-6">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionBankInfo)}
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
				{/* Row 1: Bank (full width) */}
				<div className="col-span-1 md:col-span-2">
					<Label htmlFor="bankName" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldBank)}
					</Label>
					<Input
						id="bankName"
						value={data.bankName}
						onChange={(e) => onChange("bankName", e.target.value)}
						placeholder="Swedbank"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				{/* Row 2: Clering nr & Konto nr */}
				<div>
					<Label htmlFor="clearingNumber" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldClearingNo)}
					</Label>
					<Input
						id="clearingNumber"
						value={data.clearingNumber}
						onChange={(e) => onChange("clearingNumber", e.target.value)}
						placeholder="6185"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div>
					<Label htmlFor="accountNumber" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldAccountNo)}
					</Label>
					<Input
						id="accountNumber"
						value={data.accountNumber}
						onChange={(e) => onChange("accountNumber", e.target.value)}
						placeholder="4563 5000"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				{/* Row 3: Swich nr & Iban */}
				<div>
					<Label htmlFor="swishNumber" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldSwishNo)}
					</Label>
					<Input
						id="swishNumber"
						value={data.swishNumber}
						onChange={(e) => onChange("swishNumber", e.target.value)}
						placeholder="070-560 50 60"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				<div>
					<Label htmlFor="iban" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldIban)}
					</Label>
					<Input
						id="iban"
						value={data.iban}
						onChange={(e) => onChange("iban", e.target.value)}
						placeholder="456390056111"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>

				{/* Row 4: BIC */}
				<div>
					<Label htmlFor="bic" className="text-xs font-medium text-slate-700 mb-1.5 block">
						{t(localizationConstants.fieldBic)}
					</Label>
					<Input
						id="bic"
						value={data.bic}
						onChange={(e) => onChange("bic", e.target.value)}
						placeholder="ESBVGSSB"
						className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm placeholder:text-slate-400"
					/>
				</div>
			</div>
		</section>
	);
}
