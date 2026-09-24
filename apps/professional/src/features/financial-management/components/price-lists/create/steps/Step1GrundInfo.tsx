"use client";

import React from "react";
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
		<div className="space-y-6">
			{/* Card 1: Grund Information (Stacked full width per Figma Image 5) */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
				<h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.priceListBasicInfoTab} />
				</h3>

				<div className="space-y-4">
					{/* Row 1: Kod nr & Benämning */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListCodeLabel} />
							</label>
							<Input
								value={formData.code}
								onChange={(e) => onUpdateField("code", e.target.value)}
								placeholder="P001"
								className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
							/>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListNameLabel} />
								<span className="text-red-500 ml-1">*</span>
							</label>
							<Input
								value={formData.name}
								onChange={(e) => onUpdateField("name", e.target.value)}
								placeholder="Prislista B"
								className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
									errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
								}`}
							/>
							{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
						</div>
					</div>

					{/* Row 2: Datum & Skapad av */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListDateLabel} />
								<span className="text-red-500 ml-1">*</span>
							</label>
							<Input
								type="date"
								value={formData.date}
								onChange={(e) => onUpdateField("date", e.target.value)}
								className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
									errors.date ? "border-red-500 focus-visible:ring-red-500" : ""
								}`}
							/>
							{errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListCreatedByLabel} />
								<span className="text-red-500 ml-1">*</span>
							</label>
							<Select
								value={formData.createdBy}
								onValueChange={(val) => onUpdateField("createdBy", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue placeholder="Kalle Andersson" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									<SelectItem value="Kalle Andersson">Kalle Andersson</SelectItem>
									<SelectItem value="Anna Svensson">Anna Svensson</SelectItem>
									<SelectItem value="Admin User">Admin User</SelectItem>
								</SelectContent>
							</Select>
							{errors.createdBy && <p className="text-xs text-red-500">{errors.createdBy}</p>}
						</div>
					</div>

					{/* Row 3: Kommentar */}
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListCommentLabel} />
						</label>
						<Input
							value={formData.comment}
							onChange={(e) => onUpdateField("comment", e.target.value)}
							placeholder="info"
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>
				</div>
			</div>

			{/* Card 2: Inställning (Stacked full width per Figma Image 5) */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
				<h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.priceListSettingsSection} />
				</h3>

				<div className="space-y-4">
					{/* Row 1: Kategori & Enhet */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListCategoryLabel} />
								<span className="text-red-500 ml-1">*</span>
							</label>
							<Select
								value={formData.category}
								onValueChange={(val) => onUpdateField("category", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue placeholder="Service" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									<SelectItem value="Service">Service</SelectItem>
									<SelectItem value="Privat">Privat</SelectItem>
									<SelectItem value="Övrigt">Övrigt</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListUnitLabel} />
								<span className="text-red-500 ml-1">*</span>
							</label>
							<Select
								value={formData.unit}
								onValueChange={(val) => onUpdateField("unit", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue placeholder="Styck" />
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
					</div>

					{/* Row 2: Kund & Leverantör */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListCustomerLabel} />
							</label>
							<Select
								value={formData.customer}
								onValueChange={(val) => onUpdateField("customer", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue placeholder="Service" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									<SelectItem value="Service">Service</SelectItem>
									<SelectItem value="Kund 01">Kund 01</SelectItem>
									<SelectItem value="Kund 02">Kund 02</SelectItem>
									<SelectItem value="Kund 03">Kund 03</SelectItem>
									<SelectItem value="Kund 04">Kund 04</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-800">
								<Translate text={localizationConstants.priceListSupplierLabel} />
							</label>
							<Select
								value={formData.supplier}
								onValueChange={(val) => onUpdateField("supplier", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue placeholder="Styck" />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									<SelectItem value="Styck">Styck</SelectItem>
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
		</div>
	);
}
