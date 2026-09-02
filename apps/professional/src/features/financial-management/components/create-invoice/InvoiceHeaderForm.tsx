"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CreateInvoiceFormData } from "../../types/createInvoice.types";

interface InvoiceHeaderFormProps {
	formData: CreateInvoiceFormData;
	updateField: <K extends keyof CreateInvoiceFormData>(
		key: K,
		value: CreateInvoiceFormData[K],
	) => void;
}

export function InvoiceHeaderForm({ formData, updateField }: InvoiceHeaderFormProps) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
			{/* Card Title */}
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
				<Translate text={localizationConstants.createInvoiceHeaderCardTitle} />
			</h3>

			<div className="space-y-4">
				{/* Row 1: Left 3 fields + Right 3 Checkboxes */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
					{/* Left 3 fields (col-span 6 or 7) */}
					<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldInvoiceNo} />
							</Label>
							<Input
								value={formData.invoiceNo}
								disabled
								className="h-9 bg-slate-100 border-slate-200 text-xs font-medium text-slate-800 rounded-md"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldStatus} />
							</Label>
							<Input
								value={formData.status}
								onChange={(e) => updateField("status", e.target.value)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldTemplate} />
							</Label>
							<Select
								value={formData.template}
								onValueChange={(val) => updateField("template", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="standard">Standard</SelectItem>
									<SelectItem value="bygg">Byggstandard</SelectItem>
									<SelectItem value="konsult">Konsultmall</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Right checkboxes (col-span 5) */}
					<div className="lg:col-span-5 flex items-center justify-start lg:justify-end gap-6 pt-2 lg:pt-5">
						<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
							<Checkbox
								checked={formData.attachTimeReport}
								onCheckedChange={(checked) => updateField("attachTimeReport", !!checked)}
								className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-xs h-4 w-4"
							/>
							<span>
								<Translate text={localizationConstants.createInvoiceAttachTimeReport} />
							</span>
						</label>

						<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
							<Checkbox
								checked={formData.attachDocumentation}
								onCheckedChange={(checked) => updateField("attachDocumentation", !!checked)}
								className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-xs h-4 w-4"
							/>
							<span>
								<Translate text={localizationConstants.createInvoiceAttachDocumentation} />
							</span>
						</label>

						<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
							<Checkbox
								checked={formData.isCreditInvoice}
								onCheckedChange={(checked) => updateField("isCreditInvoice", !!checked)}
								className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-xs h-4 w-4"
							/>
							<span>
								<Translate text={localizationConstants.createInvoiceCreditInvoice} />
							</span>
						</label>
					</div>
				</div>

				{/* Row 2: Kund & Kategori (Left) | Projekt Namn, Projekt nummer, KontaktPerson (Right) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
					{/* Left 2 fields (col-span 4) */}
					<div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldCustomer} />
							</Label>
							<Select
								value={formData.customer}
								onValueChange={(val) => updateField("customer", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="Startade">Startade</SelectItem>
									<SelectItem value="Fox">Fox</SelectItem>
									<SelectItem value="Karl">Karl</SelectItem>
									<SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldCategory} />
							</Label>
							<Select
								value={formData.category}
								onValueChange={(val) => updateField("category", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="Projekt">Projekt</SelectItem>
									<SelectItem value="Order">Order</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Middle gap spacer (col-span 2) */}
					<div className="hidden lg:block lg:col-span-2" />

					{/* Right 3 fields (col-span 6) */}
					<div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldProjectName} />
							</Label>
							<Select
								value={formData.projectName}
								onValueChange={(val) => updateField("projectName", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="Kv Solen">Kv Solen</SelectItem>
									<SelectItem value="Norra Förbifarten">Norra Förbifarten</SelectItem>
									<SelectItem value="Projekt Syd">Projekt Syd</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
							</Label>
							<Select
								value={formData.projectNumber}
								onValueChange={(val) => updateField("projectNumber", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="2025-001">2025-001</SelectItem>
									<SelectItem value="2025-002">2025-002</SelectItem>
									<SelectItem value="2025-003">2025-003</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldContactPerson} />
							</Label>
							<Select
								value={formData.contactPerson}
								onValueChange={(val) => updateField("contactPerson", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="Kalle Andersson">Kalle Andersson</SelectItem>
									<SelectItem value="Stefan Svensson">Stefan Svensson</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{/* Row 3: Empty (Left) | Projekt Summa, Fakturerad tidigare, Faktura inkl denna (Right) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
					{/* Left empty (col-span 6) */}
					<div className="hidden lg:block lg:col-span-6" />

					{/* Right 3 fields (col-span 6) */}
					<div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldProjectSum} />
							</Label>
							<Input
								type="text"
								value={formData.projectSum === 0 ? "0.0" : String(formData.projectSum)}
								onChange={(e) => updateField("projectSum", Number(e.target.value) || 0)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldInvoicedEarlier} />
							</Label>
							<Input
								type="text"
								value={formData.invoicedEarlier === 0 ? "0.0" : String(formData.invoicedEarlier)}
								onChange={(e) => updateField("invoicedEarlier", Number(e.target.value) || 0)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldInvoiceInclThis} />
							</Label>
							<Input
								type="text"
								value={formData.invoiceInclThis === 0 ? "0.0" : String(formData.invoiceInclThis)}
								onChange={(e) => updateField("invoiceInclThis", Number(e.target.value) || 0)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>
					</div>
				</div>

				{/* Row 4: Faktura datum & Rot - Rut (Left) | Betalningsplan & Pris modell - typ (Right) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
					{/* Left 2 fields (col-span 4) */}
					<div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldInvoiceDate} />
							</Label>
							<Input
								type="date"
								value={formData.invoiceDate}
								onChange={(e) => updateField("invoiceDate", e.target.value)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldRotRut} />
							</Label>
							<Select
								value={formData.rotRutType}
								onValueChange={(val) => updateField("rotRutType", val as "rot" | "rut" | "none")}
							>
								<SelectTrigger className="h-9 border-orange-500 bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white cursor-pointer rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="rot">ROT</SelectItem>
									<SelectItem value="rut">RUT</SelectItem>
									<SelectItem value="none">Ingen</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Middle gap spacer (col-span 2) */}
					<div className="hidden lg:block lg:col-span-2" />

					{/* Right 3 fields (col-span 6) with Betalningsplan & Pris modell */}
					<div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldPaymentPlan} />
							</Label>
							<Select
								value={formData.paymentPlanType}
								onValueChange={(val) => updateField("paymentPlanType", val)}
							>
								<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="info">info</SelectItem>
									<SelectItem value="manad">Månadsvis</SelectItem>
									<SelectItem value="milstolpe">Milstolpar</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldPricingModel} />
							</Label>
							<Select
								value={formData.pricingModel}
								onValueChange={(val) =>
									updateField("pricingModel", val as "lopande" | "fastpris" | "budget")
								}
							>
								<SelectTrigger className="h-9 border-orange-500 bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white cursor-pointer rounded-md">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="lopande">
										<Translate text={localizationConstants.createInvoicePricingLopande} />
									</SelectItem>
									<SelectItem value="fastpris">
										<Translate text={localizationConstants.createInvoicePricingFixed} />
									</SelectItem>
									<SelectItem value="budget">
										<Translate text={localizationConstants.createInvoicePricingBudget} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="hidden sm:block" />
					</div>
				</div>
			</div>
		</div>
	);
}
