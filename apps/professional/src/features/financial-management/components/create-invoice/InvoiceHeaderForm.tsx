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
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-5">
			{/* Card Title & Top Checkboxes */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.createInvoiceHeaderCardTitle} />
				</h3>

				<div className="flex flex-wrap items-center gap-5">
					<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
						<Checkbox
							checked={formData.attachTimeReport}
							onCheckedChange={(checked) => updateField("attachTimeReport", !!checked)}
						/>
						<span>
							<Translate text={localizationConstants.createInvoiceAttachTimeReport} />
						</span>
					</label>

					<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
						<Checkbox
							checked={formData.attachDocumentation}
							onCheckedChange={(checked) => updateField("attachDocumentation", !!checked)}
						/>
						<span>
							<Translate text={localizationConstants.createInvoiceAttachDocumentation} />
						</span>
					</label>

					<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
						<Checkbox
							checked={formData.isCreditInvoice}
							onCheckedChange={(checked) => updateField("isCreditInvoice", !!checked)}
						/>
						<span>
							<Translate text={localizationConstants.createInvoiceCreditInvoice} />
						</span>
					</label>
				</div>
			</div>

			{/* Form Fields Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				{/* Row 1 */}
				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldInvoiceNo} />
					</Label>
					<Input
						value={formData.invoiceNo}
						disabled
						className="h-9 bg-slate-50 border-slate-200 text-xs font-medium text-slate-800"
					/>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldStatus} />
					</Label>
					<Input
						value={formData.status}
						onChange={(e) => updateField("status", e.target.value)}
						className="h-9 border-slate-200 text-xs text-slate-800"
					/>
				</div>

				<div className="md:col-span-2">
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldTemplate} />
					</Label>
					<Select
						value={formData.template}
						onValueChange={(val) => updateField("template", val)}
					>
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
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

			{/* Row 2: Customer, Category, Project Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldCustomer} />
					</Label>
					<Select
						value={formData.customer}
						onValueChange={(val) => updateField("customer", val)}
					>
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="Fox">Fox</SelectItem>
							<SelectItem value="Karl">Karl</SelectItem>
							<SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
							<SelectItem value="Startade">Startade</SelectItem>
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
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="Projekt">Projekt</SelectItem>
							<SelectItem value="Order">Order</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldProjectName} />
					</Label>
					<Select
						value={formData.projectName}
						onValueChange={(val) => updateField("projectName", val)}
					>
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
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
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
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
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="Kalle Andersson">Kalle Andersson</SelectItem>
							<SelectItem value="Stefan Svensson">Stefan Svensson</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Row 3: Project Sum, Invoiced earlier, Incl this */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldProjectSum} />
					</Label>
					<Input
						type="number"
						value={formData.projectSum || ""}
						onChange={(e) => updateField("projectSum", Number(e.target.value))}
						placeholder="0.0"
						className="h-9 border-slate-200 text-xs text-slate-800"
					/>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldInvoicedEarlier} />
					</Label>
					<Input
						type="number"
						value={formData.invoicedEarlier || ""}
						onChange={(e) => updateField("invoicedEarlier", Number(e.target.value))}
						placeholder="0.0"
						className="h-9 border-slate-200 text-xs text-slate-800"
					/>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldInvoiceInclThis} />
					</Label>
					<Input
						type="number"
						value={formData.invoiceInclThis || ""}
						onChange={(e) => updateField("invoiceInclThis", Number(e.target.value))}
						placeholder="0.0"
						className="h-9 border-slate-200 text-xs text-slate-800"
					/>
				</div>
			</div>

			{/* Row 4: Dates & Badged Selects */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldInvoiceDate} />
					</Label>
					<Input
						type="date"
						value={formData.invoiceDate}
						onChange={(e) => updateField("invoiceDate", e.target.value)}
						className="h-9 border-slate-200 text-xs text-slate-800 bg-white"
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
						<SelectTrigger className="h-9 border-orange-400 bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white cursor-pointer">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="rot">ROT (30%)</SelectItem>
							<SelectItem value="rut">RUT (50%)</SelectItem>
							<SelectItem value="none">Ingen / None</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.createInvoiceFieldPaymentPlan} />
					</Label>
					<Select
						value={formData.paymentPlanType}
						onValueChange={(val) => updateField("paymentPlanType", val)}
					>
						<SelectTrigger className="h-9 border-slate-200 text-xs text-slate-800 bg-white">
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
						<SelectTrigger className="h-9 border-orange-400 bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white cursor-pointer">
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
			</div>
		</div>
	);
}
