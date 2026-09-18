"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import type { CreateCustomerFormData } from "../../../../types/createCustomer.types";
import {
	CUSTOMER_STATUS_OPTIONS,
	MAIN_CATEGORY_OPTIONS,
} from "../../../../constants/createCustomer.constants";

interface Step1BasicInfoProps {
	form: UseFormReturn<CreateCustomerFormData>;
}

export function Step1BasicInfo({ form }: Step1BasicInfoProps) {
	const { t } = useTranslation();
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = form;

	const sameAsVisiting = watch("sameAsVisitingAddress");
	const visitingAddress = watch("visitingAddress");
	const visitingPostalCode = watch("visitingPostalCode");
	const visitingCity = watch("visitingCity");

	const handleSameAddressToggle = (checked: boolean) => {
		setValue("sameAsVisitingAddress", checked);
		if (checked) {
			setValue("invoiceAddress", visitingAddress);
			setValue("invoicePostalCode", visitingPostalCode);
			setValue("invoiceCity", visitingCity);
		}
	};

	return (
		<div className="space-y-6">
			{/* Card 1: Customer matching Figma Image 2/3/4 */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
				<div className="border-b border-slate-100 pb-4">
					<h3 className="text-sm font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.customerStepCustomer} />
					</h3>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{/* Customer No */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerNoLabel} />
						</label>
						<Input
							{...register("customerNo")}
							placeholder={t(localizationConstants.customerNoPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					{/* Status */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerStatusLabel} />
						</label>
						<Select
							value={watch("status") || "prospect"}
							onValueChange={(val) => setValue("status", val, { shouldDirty: true })}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder={t(localizationConstants.customerStatusPlaceholder)} />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{CUSTOMER_STATUS_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
										{opt.value === "active"
											? t(localizationConstants.customerStatusActive)
											: opt.value === "prospect"
												? t(localizationConstants.customerStatusProspect)
												: t(localizationConstants.customerStatusInactive)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Company Name */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerCompanyNameLabel} /> *
						</label>
						<Input
							{...register("companyName")}
							placeholder={t(localizationConstants.customerCompanyNamePlaceholder)}
							className={`h-10 text-xs bg-white ${
								errors.companyName ? "border-rose-500 focus-visible:ring-rose-500" : ""
							}`}
						/>
						{errors.companyName && (
							<p className="text-[11px] text-rose-500 font-medium">
								<Translate text={errors.companyName.message || localizationConstants.customerValidationCompanyName} />
							</p>
						)}
					</div>

					{/* Main Category */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerMainCategoryLabel} />
						</label>
						<Select
							value={watch("mainCategory") || ""}
							onValueChange={(val) => setValue("mainCategory", val, { shouldDirty: true })}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder={t(localizationConstants.customerMainCategoryPlaceholder)} />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{MAIN_CATEGORY_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
										<Translate text={localizationConstants[opt.labelKey]} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Department */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerDepartmentLabel} />
						</label>
						<Input
							{...register("department")}
							placeholder={t(localizationConstants.customerDepartmentPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					{/* Region */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerRegionLabel} />
						</label>
						<Input
							{...register("region")}
							placeholder={t(localizationConstants.customerRegionPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					{/* Org No */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerOrgNoLabel} /> *
						</label>
						<Input
							{...register("orgNo")}
							placeholder={t(localizationConstants.customerOrgNoPlaceholder)}
							className={`h-10 text-xs bg-white ${
								errors.orgNo ? "border-rose-500 focus-visible:ring-rose-500" : ""
							}`}
						/>
						{errors.orgNo && (
							<p className="text-[11px] text-rose-500 font-medium">
								<Translate text={errors.orgNo.message || localizationConstants.customerValidationOrgNo} />
							</p>
						)}
					</div>

					{/* VAT Reg No */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerVatRegNoLabel} />
						</label>
						<Input
							{...register("vatRegNo")}
							placeholder={t(localizationConstants.customerVatRegNoPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>
			</div>

			{/* Card 2: Adresser */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.customerCardAddresses} />
				</h3>
				
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="space-y-1.5 sm:col-span-3">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerVisitingAddressLabel} /> *
						</label>
						<Input
							{...register("visitingAddress")}
							placeholder={t(localizationConstants.customerVisitingAddressPlaceholder)}
							className={`h-10 text-xs bg-white ${
								errors.visitingAddress ? "border-rose-500" : ""
							}`}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerPostalCodeLabel} /> *
						</label>
						<Input
							{...register("visitingPostalCode")}
							placeholder={t(localizationConstants.customerPostalCodePlaceholder)}
							className={`h-10 text-xs bg-white ${
								errors.visitingPostalCode ? "border-rose-500" : ""
							}`}
						/>
					</div>

					<div className="space-y-1.5 sm:col-span-2">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerCityLabel} /> *
						</label>
						<Input
							{...register("visitingCity")}
							placeholder={t(localizationConstants.customerCityPlaceholder)}
							className={`h-10 text-xs bg-white ${
								errors.visitingCity ? "border-rose-500" : ""
							}`}
						/>
					</div>
				</div>

				<div className="pt-2 border-t border-slate-100">
					<label className="flex items-center gap-2 cursor-pointer py-1">
						<input
							type="checkbox"
							checked={sameAsVisiting}
							onChange={(e) => handleSameAddressToggle(e.target.checked)}
							className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
						/>
						<span className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.customerSameAddressCheckbox} />
						</span>
					</label>

					{!sameAsVisiting && (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-3">
							<div className="space-y-1.5 sm:col-span-3">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.customerInvoiceAddressLabel} />
								</label>
								<Input
									{...register("invoiceAddress")}
									placeholder={t(localizationConstants.customerVisitingAddressPlaceholder)}
									className="h-10 text-xs bg-white"
								/>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.customerPostalCodeLabel} />
								</label>
								<Input
									{...register("invoicePostalCode")}
									placeholder={t(localizationConstants.customerPostalCodePlaceholder)}
									className="h-10 text-xs bg-white"
								/>
							</div>

							<div className="space-y-1.5 sm:col-span-2">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.customerCityLabel} />
								</label>
								<Input
									{...register("invoiceCity")}
									placeholder={t(localizationConstants.customerCityPlaceholder)}
									className="h-10 text-xs bg-white"
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Card 3: Bank Information */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.customerCardBankInfo} />
				</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerBankgiroLabel} />
						</label>
						<Input
							{...register("bankgiro")}
							placeholder={t(localizationConstants.customerBankgiroPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerPlusgiroLabel} />
						</label>
						<Input
							{...register("plusgiro")}
							placeholder={t(localizationConstants.customerPlusgiroPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerIbanLabel} />
						</label>
						<Input
							{...register("iban")}
							placeholder={t(localizationConstants.customerIbanPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerBicLabel} />
						</label>
						<Input
							{...register("bic")}
							placeholder={t(localizationConstants.customerBicPlaceholder)}
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
