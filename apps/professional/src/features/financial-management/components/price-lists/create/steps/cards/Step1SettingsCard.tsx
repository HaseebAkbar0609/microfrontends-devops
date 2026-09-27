"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreatePriceListFormData } from "../../../../../types/priceLists.types";

interface Step1SettingsCardProps {
	readonly formData: CreatePriceListFormData;
	readonly onUpdateField: <K extends keyof CreatePriceListFormData>(
		field: K,
		value: CreatePriceListFormData[K],
	) => void;
}

export function Step1SettingsCard({
	formData,
	onUpdateField,
}: Step1SettingsCardProps) {
	return (
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
								<SelectValue placeholder="Välj kategori" />
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
								<SelectValue placeholder="Välj kund" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
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
