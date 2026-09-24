"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateSupplierFormData } from "../../../../types/createSupplier.types";

interface SupplierAddressesCardProps {
	form: UseFormReturn<CreateSupplierFormData>;
}

export function SupplierAddressesCard({ form }: SupplierAddressesCardProps) {
	const { t } = useTranslation();
	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const sameAsVisiting = watch("sameAsVisitingAddress");
	const visitingAddress = watch("visitingAddress");
	const visitingPostalCode = watch("visitingPostalCode");
	const visitingCity = watch("visitingCity");

	const handleCheckboxChange = (checked: boolean) => {
		setValue("sameAsVisitingAddress", checked, { shouldDirty: true });
		if (checked) {
			setValue("invoiceAddress", visitingAddress, { shouldDirty: true });
			setValue("invoicePostalCode", visitingPostalCode, { shouldDirty: true });
			setValue("invoiceCity", visitingCity, { shouldDirty: true });
		}
	};

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
			<div className="border-b border-slate-100 pb-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierCardAddresses} />
				</h3>
			</div>

			{/* Visiting Address */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="space-y-1.5 sm:col-span-3">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierVisitingAddressLabel} /> *
					</label>
					<Input
						{...register("visitingAddress")}
						placeholder={t(localizationConstants.supplierVisitingAddressPlaceholder)}
						className={`h-10 text-xs bg-white ${errors.visitingAddress ? "border-rose-500" : ""}`}
					/>
					{errors.visitingAddress && (
						<p className="text-[11px] text-rose-500">
							<Translate text={localizationConstants.supplierValidationRequired} />
						</p>
					)}
				</div>

				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierPostalCodeLabel} /> *
					</label>
					<Input
						{...register("visitingPostalCode")}
						placeholder={t(localizationConstants.supplierPostalCodePlaceholder)}
						className={`h-10 text-xs bg-white ${errors.visitingPostalCode ? "border-rose-500" : ""}`}
					/>
					{errors.visitingPostalCode && (
						<p className="text-[11px] text-rose-500">
							<Translate text={localizationConstants.supplierValidationRequired} />
						</p>
					)}
				</div>

				<div className="space-y-1.5 sm:col-span-2">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierCityLabel} /> *
					</label>
					<Input
						{...register("visitingCity")}
						placeholder={t(localizationConstants.supplierCityPlaceholder)}
						className={`h-10 text-xs bg-white ${errors.visitingCity ? "border-rose-500" : ""}`}
					/>
					{errors.visitingCity && (
						<p className="text-[11px] text-rose-500">
							<Translate text={localizationConstants.supplierValidationRequired} />
						</p>
					)}
				</div>
			</div>

			{/* Checkbox Same Address */}
			<div className="flex items-center space-x-2 pt-2 pb-1">
				<Checkbox
					id="sameAsVisitingSupplier"
					checked={sameAsVisiting}
					onCheckedChange={handleCheckboxChange}
				/>
				<label
					htmlFor="sameAsVisitingSupplier"
					className="text-xs font-medium leading-none text-slate-700 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					<Translate text={localizationConstants.supplierSameAddressCheckbox} />
				</label>
			</div>

			{/* Invoice Address (conditionally enabled or shown) */}
			{!sameAsVisiting && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 border-t border-slate-100">
					<div className="space-y-1.5 sm:col-span-3">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierInvoiceAddressLabel} />
						</label>
						<Input
							{...register("invoiceAddress")}
							placeholder={t(localizationConstants.supplierVisitingAddressPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierPostalCodeLabel} />
						</label>
						<Input
							{...register("invoicePostalCode")}
							placeholder={t(localizationConstants.supplierPostalCodePlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5 sm:col-span-2">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.supplierCityLabel} />
						</label>
						<Input
							{...register("invoiceCity")}
							placeholder={t(localizationConstants.supplierCityPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
