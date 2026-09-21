"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateSupplierFormData } from "../../../../types/createSupplier.types";

interface SupplierPaymentTermsCardProps {
	form: UseFormReturn<CreateSupplierFormData>;
}

export function SupplierPaymentTermsCard({ form }: SupplierPaymentTermsCardProps) {
	const { t } = useTranslation();
	const { register } = form;

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
			<div className="border-b border-slate-100 pb-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierCardPaymentTerms} />
				</h3>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{/* Betalningsdagar */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierPaymentDaysLabel} />
					</label>
					<Input
						{...register("paymentDays")}
						placeholder={t(localizationConstants.supplierPaymentDaysPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Ränta % */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierInterestRateLabel} />
					</label>
					<Input
						{...register("interestRate")}
						placeholder={t(localizationConstants.supplierInterestRatePlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Fakturaavgift kr */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierInvoiceFeeLabel} />
					</label>
					<Input
						{...register("invoiceFee")}
						placeholder={t(localizationConstants.supplierInvoiceFeePlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Inkasso kr */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierCollectionFeeLabel} />
					</label>
					<Input
						{...register("collectionFee")}
						placeholder={t(localizationConstants.supplierCollectionFeePlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>
			</div>
		</div>
	);
}
