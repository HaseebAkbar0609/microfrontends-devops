"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
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
import type {
	CreateCustomerFormData,
	CustomerEntityType,
} from "../../../../types/createCustomer.types";
import {
	CUSTOMER_STATUS_OPTIONS,
	MAIN_CATEGORY_OPTIONS,
} from "../../../../constants/createCustomer.constants";
import { CompanyOrPrivateSelector } from "../sections/CompanyOrPrivateSelector";

interface Step1BasicInfoProps {
	form: UseFormReturn<CreateCustomerFormData>;
	entityType: CustomerEntityType;
	onEntityTypeChange: (type: CustomerEntityType) => void;
}

export function Step1BasicInfo({
	form,
	entityType,
	onEntityTypeChange,
}: Step1BasicInfoProps) {
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
			{/* Entity Type Selector */}
			<CompanyOrPrivateSelector
				value={entityType}
				onChange={onEntityTypeChange}
			/>

			{/* Card 1: Kund Information */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.customerSection} />
				</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerNoLabel} />
						</label>
						<Input
							{...register("customerNo")}
							placeholder="Genereras automatiskt (t.ex. #M102)"
							className="h-10 text-xs bg-slate-50/50"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.statusLabel} />
						</label>
						<Select
							value={watch("status") || "prospect"}
							onValueChange={(val) => setValue("status", val)}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder="Välj status" />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{CUSTOMER_STATUS_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{entityType === "company" ? (
						<>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.companyNameLabel} /> *
								</label>
								<Input
									{...register("companyName")}
									placeholder="Företagsnamn AB"
									className={`h-10 text-xs ${errors.companyName ? "border-rose-500" : ""}`}
								/>
								{errors.companyName && (
									<p className="text-[11px] text-rose-500">
										<Translate text={errors.companyName.message || ""} />
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.mainCategoryLabel} />
								</label>
								<Select
									value={watch("mainCategory") || ""}
									onValueChange={(val) => setValue("mainCategory", val)}
								>
									<SelectTrigger className="h-10 text-xs bg-white">
										<SelectValue placeholder="Välj huvudkategori" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										{MAIN_CATEGORY_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.departmentLabel} />
								</label>
								<Input
									{...register("department")}
									placeholder="Avdelning"
									className="h-10 text-xs"
								/>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.regionLabel} />
								</label>
								<Input {...register("region")} placeholder="Region" className="h-10 text-xs" />
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.orgNoLabel} /> *
								</label>
								<Input
									{...register("orgNo")}
									placeholder="556010-1020"
									className={`h-10 text-xs ${errors.orgNo ? "border-rose-500" : ""}`}
								/>
								{errors.orgNo && (
									<p className="text-[11px] text-rose-500">
										<Translate text={errors.orgNo.message || ""} />
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.vatRegNoLabel} />
								</label>
								<Input
									{...register("vatRegNo")}
									placeholder="SE556010102001"
									className="h-10 text-xs"
								/>
							</div>
						</>
					) : (
						<>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.firstNameLabel} /> *
								</label>
								<Input
									{...register("firstName")}
									placeholder="Förnamn"
									className={`h-10 text-xs ${errors.firstName ? "border-rose-500" : ""}`}
								/>
								{errors.firstName && (
									<p className="text-[11px] text-rose-500">
										<Translate text={errors.firstName.message || ""} />
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.lastNameLabel} /> *
								</label>
								<Input
									{...register("lastName")}
									placeholder="Efternamn"
									className={`h-10 text-xs ${errors.lastName ? "border-rose-500" : ""}`}
								/>
								{errors.lastName && (
									<p className="text-[11px] text-rose-500">
										<Translate text={errors.lastName.message || ""} />
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Personnummer *</label>
								<Input
									{...register("personnummer")}
									placeholder="YYYYMMDD-XXXX"
									className={`h-10 text-xs ${errors.personnummer ? "border-rose-500" : ""}`}
								/>
								{errors.personnummer && (
									<p className="text-[11px] text-rose-500">
										<Translate text={errors.personnummer.message || ""} />
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.mainCategoryLabel} />
								</label>
								<Select
									value={watch("mainCategory") || ""}
									onValueChange={(val) => setValue("mainCategory", val)}
								>
									<SelectTrigger className="h-10 text-xs bg-white">
										<SelectValue placeholder="Välj kategori" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										{MAIN_CATEGORY_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Card 2: Adresser */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.addressesSection} />
				</h3>

				<div className="space-y-4">
					<div className="rounded-md bg-slate-50 p-2 text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.visitingAddressLabel} />
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="sm:col-span-1 space-y-1.5">
							<label className="text-xs font-medium text-slate-700">Gatuadress *</label>
							<Input
								{...register("visitingAddress")}
								placeholder="Stengatan 11"
								className={`h-10 text-xs ${errors.visitingAddress ? "border-rose-500" : ""}`}
							/>
						</div>
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.postalCodeLabel} /> *
							</label>
							<Input
								{...register("visitingPostalCode")}
								placeholder="171 62"
								className={`h-10 text-xs ${errors.visitingPostalCode ? "border-rose-500" : ""}`}
							/>
						</div>
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants.cityLabel} /> *
							</label>
							<Input
								{...register("visitingCity")}
								placeholder="Stockholm"
								className={`h-10 text-xs ${errors.visitingCity ? "border-rose-500" : ""}`}
							/>
						</div>
					</div>

					<div className="pt-2 flex items-center justify-between">
						<div className="rounded-md bg-slate-50 p-2 text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.invoiceAddressLabel} />
						</div>
						<label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
							<input
								type="checkbox"
								checked={sameAsVisiting}
								onChange={(e) => handleSameAddressToggle(e.target.checked)}
								className="h-3.5 w-3.5 rounded border-slate-300"
							/>
							<span>Samma som besöksadress</span>
						</label>
					</div>

					{!sameAsVisiting && (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div className="sm:col-span-1 space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Gatuadress</label>
								<Input
									{...register("invoiceAddress")}
									placeholder="Box 123"
									className="h-10 text-xs"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.postalCodeLabel} />
								</label>
								<Input
									{...register("invoicePostalCode")}
									placeholder="171 00"
									className="h-10 text-xs"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants.cityLabel} />
								</label>
								<Input {...register("invoiceCity")} placeholder="Stockholm" className="h-10 text-xs" />
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Card 3: Bank Information */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.bankInfoSection} />
				</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.bankNameLabel} />
						</label>
						<Input {...register("bankName")} placeholder="Swedbank" className="h-10 text-xs" />
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.bankAccountLabel} />
						</label>
						<Input {...register("bankAccount")} placeholder="8327-9, 123 456 789-0" className="h-10 text-xs" />
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.bankgiroLabel} />
						</label>
						<Input {...register("bankgiro")} placeholder="123-4567" className="h-10 text-xs" />
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.plusgiroLabel} />
						</label>
						<Input {...register("plusgiro")} placeholder="12 34 56-7" className="h-10 text-xs" />
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.ibanLabel} />
						</label>
						<Input {...register("iban")} placeholder="SE00 0000 0000 0000 0000 0000" className="h-10 text-xs" />
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.bicLabel} />
						</label>
						<Input {...register("bic")} placeholder="SWEDSESS" className="h-10 text-xs" />
					</div>
				</div>
			</div>
		</div>
	);
}
