"use client";

import React from "react";
import { UserPlus, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListDetail } from "../../../../types/priceLists.types";

interface PriceListSettingsCardProps {
	readonly priceList: PriceListDetail;
	readonly isEditing: boolean;
	readonly editData: {
		category: string;
		unit: string;
	};
	readonly setEditData: React.Dispatch<
		React.SetStateAction<{
			category: string;
			unit: string;
		}>
	>;
	readonly onStartEdit: () => void;
	readonly onCancelEdit: () => void;
	readonly onSave: () => void;
}

const DEFAULT_CUSTOMERS = ["Kund 01", "Kund 02", "Kund 03", "Kund 04"];
const DEFAULT_SUPPLIERS = [
	"leverantörer 01",
	"leverantörer 02",
	"leverantörer 03",
	"leverantörer 04",
];

export function PriceListSettingsCard({
	priceList,
	isEditing,
	editData,
	setEditData,
	onStartEdit,
	onCancelEdit,
	onSave,
}: PriceListSettingsCardProps) {
	const displayCustomers =
		priceList.linkedCustomers && priceList.linkedCustomers.length > 0
			? priceList.linkedCustomers
			: DEFAULT_CUSTOMERS;

	const displaySuppliers =
		priceList.linkedSuppliers && priceList.linkedSuppliers.length > 0
			? priceList.linkedSuppliers
			: DEFAULT_SUPPLIERS;

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<UserPlus className="h-5 w-5 text-slate-800 stroke-[1.75]" />
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.priceListDetailSettingsSection} />
					</h3>
				</div>
				{isEditing ? (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={onCancelEdit}
							className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
						>
							<X className="h-3.5 w-3.5 mr-1" />
							<Translate text={localizationConstants.cancelButton} />
						</Button>
						<Button
							size="sm"
							onClick={onSave}
							className="h-8 px-3 text-xs bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
						>
							<Check className="h-3.5 w-3.5 mr-1" />
							<Translate text={localizationConstants.priceListSaveButton} />
						</Button>
					</div>
				) : (
					<Button
						size="sm"
						variant="outline"
						onClick={onStartEdit}
						className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer rounded-md"
					>
						<Edit2 className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.priceListEditButton} />
					</Button>
				)}
			</div>

			{/* Top Fields: Kategori & Enhet */}
			{isEditing ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
					<div className="space-y-1">
						<label className="font-semibold text-slate-900 block">
							<Translate text={localizationConstants.priceListDetailCategoryLabel} />
						</label>
						<Select
							value={editData.category}
							onValueChange={(val) => setEditData((prev) => ({ ...prev, category: val }))}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200">
								<SelectValue placeholder="Välj kategori" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="Service">Service</SelectItem>
								<SelectItem value="Privat">Privat</SelectItem>
								<SelectItem value="Övrigt">Övrigt</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1">
						<label className="font-semibold text-slate-900 block">
							<Translate text={localizationConstants.priceListDetailUnitLabel} />
						</label>
						<Select
							value={editData.unit}
							onValueChange={(val) => setEditData((prev) => ({ ...prev, unit: val }))}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200">
								<SelectValue placeholder="Välj enhet" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="Styck">Styck</SelectItem>
								<SelectItem value="Timme">Timme</SelectItem>
								<SelectItem value="Meter">Meter</SelectItem>
								<SelectItem value="Kg">Kg</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
					<div>
						<span className="font-semibold text-slate-900 block mb-1">
							<Translate text={localizationConstants.priceListDetailCategoryLabel} />
						</span>
						<p className="text-slate-500 font-normal">{priceList.category || "info"}</p>
					</div>
					<div>
						<span className="font-semibold text-slate-900 block mb-1">
							<Translate text={localizationConstants.priceListDetailUnitLabel} />
						</span>
						<p className="text-slate-500 font-normal">{priceList.unit || "info"}</p>
					</div>
				</div>
			)}

			{/* Integrated Side-by-side Lists: Uppkopplade Kund & Uppkopplade leverantörer */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
				{/* Column 1: Uppkopplade Kund */}
				<div className="space-y-3">
					<div className="bg-[#F0F5FA] px-4 py-2.5 rounded-xs">
						<span className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListDetailLinkedCustomersTitle} />
						</span>
					</div>
					<div className="space-y-2.5 px-4">
						{displayCustomers.map((customer, idx) => (
							<p key={`cust_${idx}_${customer}`} className="text-xs text-slate-500 font-normal">
								{customer}
							</p>
						))}
					</div>
				</div>

				{/* Column 2: Uppkopplade leverantörer */}
				<div className="space-y-3">
					<div className="bg-[#F0F5FA] px-4 py-2.5 rounded-xs">
						<span className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListDetailLinkedSuppliersTitle} />
						</span>
					</div>
					<div className="space-y-2.5 px-4">
						{displaySuppliers.map((supplier, idx) => (
							<p key={`supp_${idx}_${supplier}`} className="text-xs text-slate-500 font-normal">
								{supplier}
							</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
