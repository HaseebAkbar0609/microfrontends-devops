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
import type { CreateSupplierFormData } from "../../../../types/createSupplier.types";
import {
	SUPPLIER_STATUS_OPTIONS,
	SUPPLIER_MAIN_CATEGORY_OPTIONS,
} from "../../../../constants/createSupplier.constants";

interface SupplierCompanyInfoCardProps {
	form: UseFormReturn<CreateSupplierFormData>;
}

export function SupplierCompanyInfoCard({ form }: SupplierCompanyInfoCardProps) {
	const { t } = useTranslation();
	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const status = watch("status") || "active";
	const mainCategory = watch("mainCategory") || "";

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
			<div className="border-b border-slate-100 pb-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierCardSupplier} />
				</h3>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{/* Lev nr */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierNoLabel} />
					</label>
					<Input
						{...register("levNr")}
						placeholder={t(localizationConstants.supplierNoPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Status */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierStatusLabel} />
					</label>
					<Select
						value={status}
						onValueChange={(val) => setValue("status", val, { shouldDirty: true })}
					>
						<SelectTrigger className="h-10 text-xs bg-white">
							<SelectValue placeholder={t(localizationConstants.supplierStatusPlaceholder)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{SUPPLIER_STATUS_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
									<Translate text={localizationConstants[opt.labelKey]} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Företagsnamn * */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierCompanyNameLabel} /> *
					</label>
					<Input
						{...register("companyName")}
						placeholder={t(localizationConstants.supplierCompanyNamePlaceholder)}
						className={`h-10 text-xs bg-white ${errors.companyName ? "border-rose-500" : ""}`}
					/>
					{errors.companyName && (
						<p className="text-[11px] text-rose-500">
							<Translate text={errors.companyName.message || localizationConstants.supplierValidationCompanyName} />
						</p>
					)}
				</div>

				{/* Huvudkategori */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierMainCategoryLabel} />
					</label>
					<Select
						value={mainCategory}
						onValueChange={(val) => setValue("mainCategory", val, { shouldDirty: true })}
					>
						<SelectTrigger className="h-10 text-xs bg-white">
							<SelectValue placeholder={t(localizationConstants.supplierMainCategoryPlaceholder)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{SUPPLIER_MAIN_CATEGORY_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Avdelning */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierDepartmentLabel} />
					</label>
					<Input
						{...register("department")}
						placeholder={t(localizationConstants.supplierDepartmentPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Region */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierRegionLabel} />
					</label>
					<Input
						{...register("region")}
						placeholder={t(localizationConstants.supplierRegionPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>

				{/* Org.nr * */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierOrgNoLabel} /> *
					</label>
					<Input
						{...register("orgNo")}
						placeholder={t(localizationConstants.supplierOrgNoPlaceholder)}
						className={`h-10 text-xs bg-white ${errors.orgNo ? "border-rose-500" : ""}`}
					/>
					{errors.orgNo && (
						<p className="text-[11px] text-rose-500">
							<Translate text={errors.orgNo.message || localizationConstants.supplierValidationOrgNo} />
						</p>
					)}
				</div>

				{/* Moms reg.nr */}
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierVatRegNoLabel} />
					</label>
					<Input
						{...register("vatRegNo")}
						placeholder={t(localizationConstants.supplierVatRegNoPlaceholder)}
						className="h-10 text-xs bg-white"
					/>
				</div>
			</div>
		</div>
	);
}
