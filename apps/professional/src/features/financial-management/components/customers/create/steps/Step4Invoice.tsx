"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CreateCustomerFormData,
	AssociatedPerson,
} from "../../../../types/createCustomer.types";
import {
	PAYMENT_TERMS_OPTIONS,
	CURRENCY_OPTIONS,
	VAT_TYPE_OPTIONS,
} from "../../../../constants/createCustomer.constants";
import { RotRutSection } from "../sections/RotRutSection";

interface Step4InvoiceProps {
	form: UseFormReturn<CreateCustomerFormData>;
	isRotRutEnabled: boolean;
	onRotRutToggle: (val: boolean) => void;
	associatedPersons: AssociatedPerson[];
	onAddAssociatedPerson: () => void;
	onRemoveAssociatedPerson: (id: string) => void;
	onUpdateAssociatedPerson: (id: string, updates: Partial<AssociatedPerson>) => void;
}

export function Step4Invoice({
	form,
	isRotRutEnabled,
	onRotRutToggle,
	associatedPersons,
	onAddAssociatedPerson,
	onRemoveAssociatedPerson,
	onUpdateAssociatedPerson,
}: Step4InvoiceProps) {
	const { t } = useTranslation();
	const { register, watch, setValue } = form;
	const propertyDesignation = watch("propertyDesignation") || "";
	const apartmentNumber = watch("apartmentNumber") || "";

	return (
		<div className="space-y-6">
			{/* Betal- och leveransvillkor */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<div className="border-b border-slate-100 pb-4">
					<h3 className="text-sm font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.customerCardInvoiceTerms} />
					</h3>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerPaymentTermsLabel} />
						</label>
						<select
							{...register("paymentTerms")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
						>
							{PAYMENT_TERMS_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{t(localizationConstants[opt.labelKey])}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerCurrencyLabel} />
						</label>
						<select
							{...register("currency")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
						>
							{CURRENCY_OPTIONS.map((opt: { value: string; label: string }) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerVatTypeLabel} />
						</label>
						<select
							{...register("vatType")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
						>
							{VAT_TYPE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{t(localizationConstants[opt.labelKey])}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.customerCreditLimitLabel} />
						</label>
						<Input
							{...register("invoiceDiscount")}
							placeholder="50000"
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.ourReferenceLabel} />
						</label>
						<Input
							{...register("ourReference")}
							placeholder={t(localizationConstants.ourReferenceLabel)}
							className="h-10 text-xs bg-white"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.yourReferenceLabel} />
						</label>
						<Input
							{...register("yourReference")}
							placeholder={t(localizationConstants.yourReferenceLabel)}
							className="h-10 text-xs bg-white"
						/>
					</div>
				</div>
			</div>

			{/* ROT / RUT Section */}
			<RotRutSection
				isEnabled={isRotRutEnabled}
				onToggle={onRotRutToggle}
				propertyDesignation={propertyDesignation}
				onPropertyDesignationChange={(val) => setValue("propertyDesignation", val, { shouldDirty: true })}
				apartmentNumber={apartmentNumber}
				onApartmentNumberChange={(val) => setValue("apartmentNumber", val, { shouldDirty: true })}
				associatedPersons={associatedPersons}
				onAddPerson={onAddAssociatedPerson}
				onRemovePerson={onRemoveAssociatedPerson}
				onUpdatePerson={onUpdateAssociatedPerson}
			/>
		</div>
	);
}
