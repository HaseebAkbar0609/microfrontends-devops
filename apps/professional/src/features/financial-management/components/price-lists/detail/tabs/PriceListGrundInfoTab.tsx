"use client";

import React from "react";
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { PriceListDetail } from "../../../../types/priceLists.types";

interface PriceListGrundInfoTabProps {
	readonly priceList: PriceListDetail;
	readonly isEditingGrundInfo: boolean;
	readonly editGrundInfoData: {
		code: string;
		name: string;
		date: string;
		createdBy: string;
		comment: string;
	};
	readonly setEditGrundInfoData: React.Dispatch<
		React.SetStateAction<{
			code: string;
			name: string;
			date: string;
			createdBy: string;
			comment: string;
		}>
	>;
	readonly startEditGrundInfo: () => void;
	readonly cancelEditGrundInfo: () => void;
	readonly saveGrundInfo: () => void;

	readonly isEditingSettings: boolean;
	readonly editSettingsData: {
		category: string;
		unit: string;
	};
	readonly setEditSettingsData: React.Dispatch<
		React.SetStateAction<{
			category: string;
			unit: string;
		}>
	>;
	readonly startEditSettings: () => void;
	readonly cancelEditSettings: () => void;
	readonly saveSettings: () => void;
}

export function PriceListGrundInfoTab({
	priceList,
	isEditingGrundInfo,
	editGrundInfoData,
	setEditGrundInfoData,
	startEditGrundInfo,
	cancelEditGrundInfo,
	saveGrundInfo,
	isEditingSettings,
	editSettingsData,
	setEditSettingsData,
	startEditSettings,
	cancelEditSettings,
	saveSettings,
}: PriceListGrundInfoTabProps) {
	return (
		<div className="space-y-6">
			{/* Top 2 Cards: Grund information & Inställning */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Card 1: Grund Information */}
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
					<div className="flex items-center justify-between border-b border-slate-100 pb-3">
						<h3 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.priceListDetailGrundInfoSection} />
						</h3>
						{isEditingGrundInfo ? (
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="ghost"
									onClick={cancelEditGrundInfo}
									className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
								>
									<X className="h-3.5 w-3.5 mr-1" />
									<Translate text={localizationConstants.cancelButton} />
								</Button>
								<Button
									size="sm"
									onClick={saveGrundInfo}
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
								onClick={startEditGrundInfo}
								className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
							>
								<Edit2 className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.priceListEditButton} />
							</Button>
						)}
					</div>

					<div className="space-y-4 text-xs">
						{isEditingGrundInfo ? (
							<>
								<div className="space-y-1">
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailCodeLabel} />
									</label>
									<Input
										value={editGrundInfoData.code}
										onChange={(e) => setEditGrundInfoData((prev) => ({ ...prev, code: e.target.value }))}
										className="h-9 text-xs"
									/>
								</div>
								<div className="space-y-1">
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailNameLabel} />
									</label>
									<Input
										value={editGrundInfoData.name}
										onChange={(e) => setEditGrundInfoData((prev) => ({ ...prev, name: e.target.value }))}
										className="h-9 text-xs"
									/>
								</div>
								<div className="space-y-1">
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailDateLabel} />
									</label>
									<Input
										type="date"
										value={editGrundInfoData.date}
										onChange={(e) => setEditGrundInfoData((prev) => ({ ...prev, date: e.target.value }))}
										className="h-9 text-xs"
									/>
								</div>
								<div className="space-y-1">
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailCreatedByLabel} />
									</label>
									<Input
										value={editGrundInfoData.createdBy}
										onChange={(e) => setEditGrundInfoData((prev) => ({ ...prev, createdBy: e.target.value }))}
										className="h-9 text-xs"
									/>
								</div>
								<div className="space-y-1">
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailCommentLabel} />
									</label>
									<Textarea
										value={editGrundInfoData.comment}
										onChange={(e) => setEditGrundInfoData((prev) => ({ ...prev, comment: e.target.value }))}
										rows={2}
										className="text-xs"
									/>
								</div>
							</>
						) : (
							<div className="grid grid-cols-2 gap-y-4 gap-x-6">
								<div>
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailCodeLabel} />
									</span>
									<p className="font-semibold text-slate-900">{priceList.code}</p>
								</div>
								<div>
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailNameLabel} />
									</span>
									<p className="font-semibold text-slate-900">{priceList.name}</p>
								</div>
								<div>
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailDateLabel} />
									</span>
									<p className="font-medium text-slate-700">{priceList.date}</p>
								</div>
								<div>
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailCreatedByLabel} />
									</span>
									<p className="font-medium text-slate-700">{priceList.createdBy}</p>
								</div>
								<div className="col-span-2">
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailCommentLabel} />
									</span>
									<p className="font-normal text-slate-600">
										{priceList.comment || "-"}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Card 2: Inställning */}
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
					<div className="flex items-center justify-between border-b border-slate-100 pb-3">
						<h3 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.priceListDetailSettingsSection} />
						</h3>
						{isEditingSettings ? (
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="ghost"
									onClick={cancelEditSettings}
									className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
								>
									<X className="h-3.5 w-3.5 mr-1" />
									<Translate text={localizationConstants.cancelButton} />
								</Button>
								<Button
									size="sm"
									onClick={saveSettings}
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
								onClick={startEditSettings}
								className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
							>
								<Edit2 className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.priceListEditButton} />
							</Button>
						)}
					</div>

					<div className="space-y-4 text-xs">
						{isEditingSettings ? (
							<>
								<div className="space-y-1">
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailCategoryLabel} />
									</label>
									<Select
										value={editSettingsData.category}
										onValueChange={(val) => setEditSettingsData((prev) => ({ ...prev, category: val }))}
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
									<label className="font-medium text-slate-600">
										<Translate text={localizationConstants.priceListDetailUnitLabel} />
									</label>
									<Select
										value={editSettingsData.unit}
										onValueChange={(val) => setEditSettingsData((prev) => ({ ...prev, unit: val }))}
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
							</>
						) : (
							<div className="grid grid-cols-2 gap-y-4 gap-x-6">
								<div>
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailCategoryLabel} />
									</span>
									<p className="font-semibold text-slate-900">{priceList.category}</p>
								</div>
								<div>
									<span className="text-slate-400 block mb-0.5">
										<Translate text={localizationConstants.priceListDetailUnitLabel} />
									</span>
									<p className="font-semibold text-slate-900">{priceList.unit || "Styck"}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Bottom 2 Pill Cards: Uppkopplade Kund & Leverantörer */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Uppkopplade Kund */}
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.priceListDetailLinkedCustomersTitle} />
					</h3>
					<div className="flex flex-wrap gap-2 pt-1">
						{priceList.linkedCustomers && priceList.linkedCustomers.length > 0 ? (
							priceList.linkedCustomers.map((customer, idx) => (
								<span
									key={`cust_${idx}_${customer}`}
									className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
								>
									{customer}
								</span>
							))
						) : (
							<span className="text-xs text-slate-400">Inga kunder kopplade</span>
						)}
					</div>
				</div>

				{/* Uppkopplade leverantörer */}
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
					<h3 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.priceListDetailLinkedSuppliersTitle} />
					</h3>
					<div className="flex flex-wrap gap-2 pt-1">
						{priceList.linkedSuppliers && priceList.linkedSuppliers.length > 0 ? (
							priceList.linkedSuppliers.map((supplier, idx) => (
								<span
									key={`supp_${idx}_${supplier}`}
									className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
								>
									{supplier}
								</span>
							))
						) : (
							<span className="text-xs text-slate-400">Inga leverantörer kopplade</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
