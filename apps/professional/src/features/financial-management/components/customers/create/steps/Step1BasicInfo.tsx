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
			{/* Card 1: Customer matching Figma Image 4 */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
				<div className="border-b border-slate-100 pb-4">
					<h3 className="text-sm font-bold text-slate-900 tracking-tight">Customer</h3>
				</div>

				{/* Entity Type Toggle */}
				<CompanyOrPrivateSelector
					value={entityType}
					onChange={onEntityTypeChange}
				/>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{/* Customer No */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Customer No.</label>
						<Input
							{...register("customerNo")}
							placeholder="Enter customer no."
							className="h-10 text-xs bg-white"
						/>
					</div>

					{/* Status */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Status</label>
						<Select
							value={watch("status") || "prospect"}
							onValueChange={(val) => setValue("status", val, { shouldDirty: true })}
						>
							<SelectTrigger className="h-10 text-xs bg-white">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{CUSTOMER_STATUS_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
										{opt.value === "active"
											? "Aktiv"
											: opt.value === "prospect"
												? "Prospekt"
												: "Inaktiv"}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{entityType === "company" ? (
						<>
							{/* Company Name */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Company Name *</label>
								<Input
									{...register("companyName")}
									placeholder="Enter company name"
									className={`h-10 text-xs bg-white ${
										errors.companyName ? "border-rose-500 focus-visible:ring-rose-500" : ""
									}`}
								/>
								{errors.companyName && (
									<p className="text-[11px] text-rose-500 font-medium">Företagsnamn krävs</p>
								)}
							</div>

							{/* Main Category */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Main Category</label>
								<Select
									value={watch("mainCategory") || ""}
									onValueChange={(val) => setValue("mainCategory", val, { shouldDirty: true })}
								>
									<SelectTrigger className="h-10 text-xs bg-white">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										{MAIN_CATEGORY_OPTIONS.map((opt: { value: string; label: string }) => (
											<SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Department */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Department</label>
								<Input
									{...register("department")}
									placeholder="Enter department"
									className="h-10 text-xs bg-white"
								/>
							</div>

							{/* Region */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Region</label>
								<Input
									{...register("region")}
									placeholder="Enter region"
									className="h-10 text-xs bg-white"
								/>
							</div>

							{/* Org No */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Organisationsnummer *</label>
								<Input
									{...register("orgNo")}
									placeholder="XXXXXX-XXXX"
									className={`h-10 text-xs bg-white ${
										errors.orgNo ? "border-rose-500 focus-visible:ring-rose-500" : ""
									}`}
								/>
								{errors.orgNo && (
									<p className="text-[11px] text-rose-500 font-medium">Ogiltigt organisationsnummer</p>
								)}
							</div>

							{/* VAT Reg No */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">VAT Reg No</label>
								<Input
									{...register("vatRegNo")}
									placeholder="SE123456789001"
									className="h-10 text-xs bg-white"
								/>
							</div>
						</>
					) : (
						<>
							{/* First Name */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Förnamn *</label>
								<Input
									{...register("firstName")}
									placeholder="Enter first name"
									className={`h-10 text-xs bg-white ${
										errors.firstName ? "border-rose-500 focus-visible:ring-rose-500" : ""
									}`}
								/>
								{errors.firstName && (
									<p className="text-[11px] text-rose-500 font-medium">Förnamn krävs</p>
								)}
							</div>

							{/* Last Name */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Efternamn *</label>
								<Input
									{...register("lastName")}
									placeholder="Enter last name"
									className={`h-10 text-xs bg-white ${
										errors.lastName ? "border-rose-500 focus-visible:ring-rose-500" : ""
									}`}
								/>
								{errors.lastName && (
									<p className="text-[11px] text-rose-500 font-medium">Efternamn krävs</p>
								)}
							</div>

							{/* Personnummer */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Personnummer *</label>
								<Input
									{...register("personnummer")}
									placeholder="YYYYMMDD-XXXX"
									className={`h-10 text-xs bg-white ${
										errors.personnummer ? "border-rose-500 focus-visible:ring-rose-500" : ""
									}`}
								/>
								{errors.personnummer && (
									<p className="text-[11px] text-rose-500 font-medium">Ogiltigt personnummer</p>
								)}
							</div>

							{/* Main Category */}
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Main Category</label>
								<Select
									value={watch("mainCategory") || ""}
									onValueChange={(val) => setValue("mainCategory", val, { shouldDirty: true })}
								>
									<SelectTrigger className="h-10 text-xs bg-white">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										{MAIN_CATEGORY_OPTIONS.map((opt: { value: string; label: string }) => (
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
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">Adresser</h3>
				
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="space-y-1.5 sm:col-span-3">
						<label className="text-xs font-medium text-slate-700">Besöksadress *</label>
						<Input
							{...register("visitingAddress")}
							placeholder="Gatuadress"
							className={`h-10 text-xs bg-white ${
								errors.visitingAddress ? "border-rose-500" : ""
							}`}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Postnummer *</label>
						<Input
							{...register("visitingPostalCode")}
							placeholder="123 45"
							className={`h-10 text-xs bg-white ${
								errors.visitingPostalCode ? "border-rose-500" : ""
							}`}
						/>
					</div>

					<div className="space-y-1.5 sm:col-span-2">
						<label className="text-xs font-medium text-slate-700">Ort *</label>
						<Input
							{...register("visitingCity")}
							placeholder="Stad"
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
							className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
						/>
						<span className="text-xs font-semibold text-slate-800">Samma som besöksadress</span>
					</label>

					{!sameAsVisiting && (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-3">
							<div className="space-y-1.5 sm:col-span-3">
								<label className="text-xs font-medium text-slate-700">Fakturaadress</label>
								<Input
									{...register("invoiceAddress")}
									placeholder="Fakturering Gatuadress"
									className="h-10 text-xs bg-white"
								/>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-medium text-slate-700">Postnummer</label>
								<Input
									{...register("invoicePostalCode")}
									placeholder="123 45"
									className="h-10 text-xs bg-white"
								/>
							</div>

							<div className="space-y-1.5 sm:col-span-2">
								<label className="text-xs font-medium text-slate-700">Ort</label>
								<Input
									{...register("invoiceCity")}
									placeholder="Stad"
									className="h-10 text-xs bg-white"
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Card 3: Bank Information */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">Bank Information</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Banknamn</label>
						<Input
							{...register("bankName")}
							placeholder="T.ex. Swedbank, SEB"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Bankkonto</label>
						<Input
							{...register("bankAccount")}
							placeholder="Kontonummer"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Bankgiro</label>
						<Input
							{...register("bankgiro")}
							placeholder="123-4567"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Plusgiro</label>
						<Input
							{...register("plusgiro")}
							placeholder="12 34 56-7"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">IBAN</label>
						<Input
							{...register("iban")}
							placeholder="SE0000000000000000000000"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">BIC / SWIFT</label>
						<Input
							{...register("bic")}
							placeholder="SWEDESSX"
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
