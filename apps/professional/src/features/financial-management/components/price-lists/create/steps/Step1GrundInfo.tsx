"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreatePriceListFormData } from "../../../../types/priceLists.types";
import type { FormErrors } from "../../../../hooks/useCreatePriceListForm";

interface Step1GrundInfoProps {
	readonly formData: CreatePriceListFormData;
	readonly errors: FormErrors;
	readonly onUpdateField: <K extends keyof CreatePriceListFormData>(
		field: K,
		value: CreatePriceListFormData[K],
	) => void;
}

export function Step1GrundInfo({
	formData,
	errors,
	onUpdateField,
}: Step1GrundInfoProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Card 1: Grund Information */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.priceListBasicInfoTab} />
				</h3>

				<div className="space-y-4">
					{/* Kod nr */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListCodeLabel} />
						</label>
						<Input
							value={formData.code}
							onChange={(e) => onUpdateField("code", e.target.value)}
							placeholder="P001"
							className="h-10 w-full bg-white border-slate-200 text-sm"
						/>
					</div>

					{/* Benämning */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListNameLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.name}
							onChange={(e) => onUpdateField("name", e.target.value)}
							placeholder="Prislista A"
							className={`h-10 w-full bg-white border-slate-200 text-sm ${
								errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
					</div>

					{/* Datum */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListDateLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							type="date"
							value={formData.date}
							onChange={(e) => onUpdateField("date", e.target.value)}
							className={`h-10 w-full bg-white border-slate-200 text-sm ${
								errors.date ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
					</div>

					{/* Skapad av */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListCreatedByLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.createdBy}
							onChange={(e) => onUpdateField("createdBy", e.target.value)}
							placeholder="Kalle Andersson"
							className={`h-10 w-full bg-white border-slate-200 text-sm ${
								errors.createdBy ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.createdBy && <p className="text-xs text-red-500">{errors.createdBy}</p>}
					</div>

					{/* Kommentar */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListCommentLabel} />
						</label>
						<Textarea
							value={formData.comment}
							onChange={(e) => onUpdateField("comment", e.target.value)}
							placeholder="Ange kommentar för prislistan..."
							rows={3}
							className="w-full bg-white border-slate-200 text-sm"
						/>
					</div>
				</div>
			</div>

			{/* Card 2: Inställning */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.priceListSettingsSection} />
				</h3>

				<div className="space-y-4">
					{/* Kategori */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListCategoryLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Select
							value={formData.category}
							onValueChange={(val) => onUpdateField("category", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
								<SelectValue placeholder="Välj kategori" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="Service">Service</SelectItem>
								<SelectItem value="Privat">Privat</SelectItem>
								<SelectItem value="Övrigt">Övrigt</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Enhet */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListUnitLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Select
							value={formData.unit}
							onValueChange={(val) => onUpdateField("unit", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
								<SelectValue placeholder="Välj enhet" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="Styck">Styck</SelectItem>
								<SelectItem value="Timme">Timme</SelectItem>
								<SelectItem value="Meter">Meter</SelectItem>
								<SelectItem value="Kg">Kg</SelectItem>
								<SelectItem value="kvm">kvm</SelectItem>
								<SelectItem value="lm">lm</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Kund */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListCustomerLabel} />
						</label>
						<Select
							value={formData.customer}
							onValueChange={(val) => onUpdateField("customer", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
								<SelectValue placeholder="Välj kund" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="Kund 01">Kund 01</SelectItem>
								<SelectItem value="Kund 02">Kund 02</SelectItem>
								<SelectItem value="Kund 03">Kund 03</SelectItem>
								<SelectItem value="Kund 04">Kund 04</SelectItem>
								<SelectItem value="Kund 05">Kund 05</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Leverantör */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListSupplierLabel} />
						</label>
						<Select
							value={formData.supplier}
							onValueChange={(val) => onUpdateField("supplier", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
								<SelectValue placeholder="Välj leverantör" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="leverantörer 01">leverantörer 01</SelectItem>
								<SelectItem value="leverantörer 02">leverantörer 02</SelectItem>
								<SelectItem value="leverantörer 03">leverantörer 03</SelectItem>
								<SelectItem value="leverantörer 04">leverantörer 04</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	);
}
