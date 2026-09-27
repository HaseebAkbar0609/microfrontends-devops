"use client";

import React from "react";
import { Edit2, UserPlus } from "lucide-react";
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
import { useBulkPriceUpdate } from "../../../hooks/useBulkPriceUpdate";
import { BulkPriceUpdateModal } from "./BulkPriceUpdateModal";

export function UpdatePriceListTab() {
	const {
		priceLists,
		selectedPriceListId,
		setSelectedPriceListId,
		selectedPriceList,
		isModalOpen,
		openModal,
		closeModal,
		formData,
		updateFormField,
		handleSaveBulkUpdate,
		isSubmitting,
	} = useBulkPriceUpdate();

	return (
		<div className="space-y-6">
			{/* Price List Selector with Label */}
			<div className="space-y-1.5 w-full sm:w-72">
				<label className="text-xs font-semibold text-slate-800">
					<Translate text={localizationConstants.priceListLabel} />
				</label>
				<Select
					value={selectedPriceListId}
					onValueChange={setSelectedPriceListId}
				>
					<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
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

			{/* Figma Card: Prisuppdatering with summary fields */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
				{/* Card Header with Icon + Title on left, Edit button on right */}
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<div className="flex items-center gap-2">
						<UserPlus className="h-5 w-5 text-slate-700" />
						<h3 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.priceListUpdateTitle} />
						</h3>
					</div>

					<Button
						variant="outline"
						onClick={openModal}
						className="h-8 px-3.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium gap-1.5 rounded-lg shadow-2xs cursor-pointer"
					>
						<Edit2 className="h-3.5 w-3.5 text-slate-500" />
						<Translate text={localizationConstants.priceListEditButton} />
					</Button>
				</div>

				{/* 4-Column / 2-Row Metric Grid matching Figma Image 2 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 text-xs">
					{/* Row 1 */}
					<div className="space-y-1">
						<p className="font-semibold text-slate-900">
							<Translate text={localizationConstants.priceListBaseCalculationLabel} />
						</p>
						<p className="text-slate-400 font-normal">
							{formData.baseCalculationOn || <Translate text={localizationConstants.priceListInfoPlaceholder} />}
						</p>
					</div>

					<div className="space-y-1">
						<p className="font-semibold text-slate-900">
							<Translate text={localizationConstants.priceListUpdatePriceListLabel} />
						</p>
						<p className="text-slate-400 font-normal">
							{selectedPriceList?.name || formData.updatePriceListId || <Translate text={localizationConstants.priceListInfoPlaceholder} />}
						</p>
					</div>

					<div className="space-y-1">
						<p className="font-semibold text-slate-900">
							<Translate text={localizationConstants.priceListCalculationLabel} />
						</p>
						<p className="text-slate-400 font-normal">
							{formData.calculationType ? (
								formData.calculationType === "procent" ? (
									<Translate text={localizationConstants.priceListProcentOption} />
								) : formData.calculationType === "index" ? (
									<Translate text={localizationConstants.priceListIndexOption} />
								) : (
									<Translate text={localizationConstants.priceListSekOption} />
								)
							) : (
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							)}
						</p>
					</div>

					<div className="space-y-1">
						<p className="font-semibold text-slate-900">
							<Translate text={localizationConstants.priceListRoundingLabel} />
						</p>
						<p className="text-slate-400 font-normal">
							{formData.rounding ? (
								formData.rounding === "helkrona" ? (
									<Translate text={localizationConstants.priceListHelKronaOption} />
								) : (
									<Translate text={localizationConstants.priceList2DecimalOption} />
								)
							) : (
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							)}
						</p>
					</div>

					{/* Row 2 */}
					<div className="space-y-1">
						<p className="font-semibold text-slate-900">
							<Translate text={localizationConstants.priceListIncreaseDecreaseLabel} />
						</p>
						<p className="text-slate-400 font-normal">
							{formData.direction ? (
								formData.direction === "increase" ? (
									<Translate text={localizationConstants.priceListOkaOption} />
								) : (
									<Translate text={localizationConstants.priceListMinskaOption} />
								)
							) : (
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							)}
						</p>
					</div>

					<div className="space-y-1">
						<p className="font-semibold text-slate-900">
							<Translate text={localizationConstants.priceListPercentageLabel} />
						</p>
						<p className="text-slate-400 font-normal">
							{formData.percentage ? `${formData.percentage}%` : <Translate text={localizationConstants.priceListInfoPlaceholder} />}
						</p>
					</div>
				</div>
			</div>

			{/* Prisuppdatering Recalculation Modal */}
			<BulkPriceUpdateModal
				isOpen={isModalOpen}
				priceLists={priceLists}
				formData={formData}
				onUpdateField={updateFormField}
				onClose={closeModal}
				onSave={handleSaveBulkUpdate}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
