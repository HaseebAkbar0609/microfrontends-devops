"use client";

import React from "react";
import { Info } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import type { PriceListBulkUpdateData, PriceListDetail } from "../../../types/priceLists.types";

interface BulkPriceUpdateModalProps {
	readonly isOpen: boolean;
	readonly priceLists: PriceListDetail[];
	readonly formData: PriceListBulkUpdateData;
	readonly onUpdateField: <K extends keyof PriceListBulkUpdateData>(
		field: K,
		value: PriceListBulkUpdateData[K],
	) => void;
	readonly onClose: () => void;
	readonly onSave: () => void;
	readonly isSubmitting: boolean;
}

export function BulkPriceUpdateModal({
	isOpen,
	priceLists,
	formData,
	onUpdateField,
	onClose,
	onSave,
	isSubmitting,
}: BulkPriceUpdateModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-xl">
				<DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
					<div className="flex items-center gap-2">
						<DialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.priceListUpdateTitle} />
						</DialogTitle>
						<Info className="h-4 w-4 text-slate-400" />
					</div>
				</DialogHeader>

				<div className="space-y-4 py-2">
					{/* Basera omräkning på */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListBaseCalculationLabel} />
						</label>
						<Select
							value={formData.baseCalculationOn}
							onValueChange={(val) => onUpdateField("baseCalculationOn", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
								<SelectValue placeholder={localizationConstants.priceListAOption} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{priceLists.map((pl) => (
									<SelectItem key={pl.id} value={pl.name}>
										{pl.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Uppdatera prislista */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListUpdatePriceListLabel} />
						</label>
						<Select
							value={formData.updatePriceListId}
							onValueChange={(val) => onUpdateField("updatePriceListId", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
								<SelectValue placeholder={localizationConstants.priceListAOption} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{priceLists.map((pl) => (
									<SelectItem key={pl.id} value={pl.id}>
										{pl.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Beräkning (Pills: Procent / Index / SEK) */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListCalculationLabel} />
						</label>
						<div className="flex gap-2">
							{(["procent", "index", "sek"] as const).map((type) => {
								const isSelected = formData.calculationType === type;
								return (
									<button
										key={type}
										type="button"
										onClick={() => onUpdateField("calculationType", type)}
										className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
											isSelected
												? "bg-[#111721] text-white border-[#111721]"
												: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
										}`}
									>
										{type === "procent" && <Translate text={localizationConstants.priceListProcentOption} />}
										{type === "index" && <Translate text={localizationConstants.priceListIndexOption} />}
										{type === "sek" && <Translate text={localizationConstants.priceListSekOption} />}
									</button>
								);
							})}
						</div>
					</div>

					{/* Avrundning (Pills: 2 Decimal / Hel KRONA) */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListRoundingLabel} />
						</label>
						<div className="flex gap-2">
							{(["2decimal", "helkrona"] as const).map((round) => {
								const isSelected = formData.rounding === round;
								return (
									<button
										key={round}
										type="button"
										onClick={() => onUpdateField("rounding", round)}
										className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
											isSelected
												? "bg-[#111721] text-white border-[#111721]"
												: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
										}`}
									>
										{round === "2decimal" && <Translate text={localizationConstants.priceList2DecimalOption} />}
										{round === "helkrona" && <Translate text={localizationConstants.priceListHelKronaOption} />}
									</button>
								);
							})}
						</div>
					</div>

					{/* Öka / Minska */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListIncreaseDecreaseLabel} />
						</label>
						<div className="flex gap-2">
							{(["increase", "decrease"] as const).map((dir) => {
								const isSelected = formData.direction === dir;
								return (
									<button
										key={dir}
										type="button"
										onClick={() => onUpdateField("direction", dir)}
										className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
											isSelected
												? "bg-[#111721] text-white border-[#111721]"
												: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
										}`}
									>
										{dir === "increase" && <Translate text={localizationConstants.priceListOkaOption} />}
										{dir === "decrease" && <Translate text={localizationConstants.priceListMinskaOption} />}
									</button>
								);
							})}
						</div>
					</div>

					{/* Procentsats (%) / Värde */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.priceListPercentageLabel} />
						</label>
						<Input
							type="number"
							value={formData.percentage}
							onChange={(e) => onUpdateField("percentage", parseFloat(e.target.value) || 0)}
							className="h-10 w-full bg-white border-slate-200 text-sm"
						/>
					</div>
				</div>

				<DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="h-9 px-4 text-xs font-medium border-slate-200 cursor-pointer"
					>
						<Translate text={localizationConstants.priceListCloseButton} />
					</Button>
					<Button
						type="button"
						onClick={onSave}
						disabled={isSubmitting}
						className="h-9 px-5 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.priceListSaveButton} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
