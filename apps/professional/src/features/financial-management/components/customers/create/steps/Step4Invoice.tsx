"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
	const { register, watch, setValue } = form;
	const propertyDesignation = watch("propertyDesignation") || "";
	const apartmentNumber = watch("apartmentNumber") || "";

	return (
		<div className="space-y-6">
			{/* Betal- och leveransvillkor */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					Betal- och leveransvillkor
				</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Betalningsvillkor</label>
						<select
							{...register("paymentTerms")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
						>
							{PAYMENT_TERMS_OPTIONS.map((opt: { value: string; label: string }) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Leveransvillkor</label>
						<Input
							{...register("deliveryTerms")}
							placeholder="T.ex. Fritt vårt lager"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Leveranssätt</label>
						<Input
							{...register("deliveryMethod")}
							placeholder="T.ex. Post, E-post"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Räntefakturering</label>
						<select
							{...register("interestInvoicing")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
						>
							<option value="Ja">Ja</option>
							<option value="Nej">Nej</option>
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Prislista</label>
						<Input
							{...register("priceList")}
							placeholder="Standard"
							className="h-10 text-xs"
						/>
					</div>
				</div>
			</div>

			{/* Fakturering & Valuta */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">Fakturering</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Valuta</label>
						<select
							{...register("currency")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
						>
							{CURRENCY_OPTIONS.map((opt: { value: string; label: string }) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Fakturarabbatt (%)</label>
						<Input
							{...register("invoiceDiscount")}
							placeholder="0"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Fakturaavgift (SEK)</label>
						<Input
							{...register("invoiceFee")}
							placeholder="0"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Fraktavgift (SEK)</label>
						<Input
							{...register("shippingFee")}
							placeholder="0"
							className="h-10 text-xs"
						/>
					</div>
				</div>
			</div>

			{/* Referenser */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">Referenser</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Vår referens</label>
						<Input
							{...register("ourReference")}
							placeholder="Namn på vår referens"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Kundansvarig</label>
						<Input
							{...register("customerResponsible")}
							placeholder="Ansvarig handläggare"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Er referens</label>
						<Input
							{...register("yourReference")}
							placeholder="Kundens referensperson"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Extern referens / PO-nr</label>
						<Input
							{...register("externalReference")}
							placeholder="T.ex. PO-88291"
							className="h-10 text-xs"
						/>
					</div>
				</div>
			</div>

			{/* Bokföring */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">Bokföring</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Momsregistreringsnr</label>
						<Input
							{...register("vatNumber")}
							placeholder="SE123456789001"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Momssats</label>
						<select
							{...register("vatType")}
							className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
						>
							{VAT_TYPE_OPTIONS.map((opt: { value: string; label: string }) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Försäljningskonto</label>
						<Input
							{...register("salesAccount")}
							placeholder="3000"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Kostnadsställe</label>
						<Input
							{...register("costCenter")}
							placeholder="T.ex. KS-10"
							className="h-10 text-xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">Projekt</label>
						<Input
							{...register("project")}
							placeholder="T.ex. PRJ-2024-01"
							className="h-10 text-xs"
						/>
					</div>
				</div>
			</div>

			{/* ROT / RUT Section (especially relevant for private customers, but configurable for all) */}
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
