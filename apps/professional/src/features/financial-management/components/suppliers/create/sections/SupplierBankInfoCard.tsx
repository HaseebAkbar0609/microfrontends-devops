"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateSupplierFormData } from "../../../../types/createSupplier.types";

interface SupplierBankInfoCardProps {
	form: UseFormReturn<CreateSupplierFormData>;
}

export function SupplierBankInfoCard({ form }: SupplierBankInfoCardProps) {
	const { t } = useTranslation();
	const { register } = form;

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
			<div className="border-b border-slate-100 pb-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierCardBankInfo} />
				</h3>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{/* Bank */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierBankLabel} />
					</label>
					<Input
						{...register("bankName")}
						placeholder={t(localizationConstants.supplierBankPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Bankkonto */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierBankAccountLabel} />
					</label>
					<Input
						{...register("bankAccount")}
						placeholder={t(localizationConstants.supplierBankAccountPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Bankgiro */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierBankgiroLabel} />
					</label>
					<Input
						{...register("bankgiro")}
						placeholder={t(localizationConstants.supplierBankgiroPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Plusgiro */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierPlusgiroLabel} />
					</label>
					<Input
						{...register("plusgiro")}
						placeholder={t(localizationConstants.supplierPlusgiroPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* IBAN */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierIbanLabel} />
					</label>
					<Input
						{...register("iban")}
						placeholder={t(localizationConstants.supplierIbanPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* BIC */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierBicLabel} />
					</label>
					<Input
						{...register("bic")}
						placeholder={t(localizationConstants.supplierBicPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>
			</div>
		</div>
	);
}
