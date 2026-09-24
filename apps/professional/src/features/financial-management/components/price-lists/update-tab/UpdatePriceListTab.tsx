"use client";

import React from "react";
import { Edit2, Eye, Star } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { PRICE_LISTS_DETAIL_BASE_ROUTE } from "../../../constants/priceLists.constants";

export function UpdatePriceListTab() {
	const router = useRouter();
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
			{/* Top Selector & Action Row */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				<div className="w-full sm:w-64">
					<Select
						value={selectedPriceListId}
						onValueChange={setSelectedPriceListId}
					>
						<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm">
							<SelectValue placeholder={localizationConstants.priceListAOption} />
						</SelectTrigger>
						<SelectContent className="bg-white border-slate-200">
							{priceLists.map((pl) => (
								<SelectItem key={pl.id} value={pl.id}>
									{pl.name} ({pl.code})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Button
					onClick={openModal}
					className="h-10 px-4 bg-[#111721] hover:bg-slate-800 text-white text-xs font-semibold gap-1.5 rounded-lg shadow-2xs cursor-pointer"
				>
					<Edit2 className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.priceListEditButton} />
				</Button>
			</div>

			{/* 4-Column Summary Card */}
			{selectedPriceList && (
				<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						<div className="space-y-1">
							<span className="text-xs text-slate-500 font-medium">
								<Translate text={localizationConstants.priceListCodeHeader} />
							</span>
							<p className="text-base font-bold text-slate-900">
								{selectedPriceList.code} - {selectedPriceList.name}
							</p>
						</div>

						<div className="space-y-1">
							<span className="text-xs text-slate-500 font-medium">
								<Translate text={localizationConstants.priceListCategoryHeader} />
							</span>
							<p className="text-base font-semibold text-slate-800">
								{selectedPriceList.category}
							</p>
						</div>

						<div className="space-y-1">
							<span className="text-xs text-slate-500 font-medium">
								<Translate text={localizationConstants.priceListLinkedHeader} />
							</span>
							<p className="text-base font-semibold text-slate-800">
								{selectedPriceList.articles?.length ?? selectedPriceList.linkedCount} st
							</p>
						</div>

						<div className="space-y-1">
							<span className="text-xs text-slate-500 font-medium">
								<Translate text={localizationConstants.priceListLastUpdatedHeader} />
							</span>
							<p className="text-base font-semibold text-slate-800">
								{selectedPriceList.lastUpdated || selectedPriceList.date}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Article List Preview Table */}
			{selectedPriceList && (
				<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
					<div className="p-4 border-b border-slate-200 flex items-center justify-between">
						<h3 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.priceListArticleListTab} />
						</h3>
						<Button
							variant="ghost"
							onClick={() => router.push(`${PRICE_LISTS_DETAIL_BASE_ROUTE}/${encodeURIComponent(selectedPriceList.id)}`)}
							className="text-xs font-semibold text-slate-700 hover:text-slate-900 gap-1 cursor-pointer"
						>
							<Eye className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.viewLabel} />
						</Button>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500">
									<th className="py-3 px-4 w-10 text-center">#</th>
									<th className="py-3 px-4">
										<Translate text={localizationConstants.priceListArticleNoHeader} />
									</th>
									<th className="py-3 px-4">
										<Translate text={localizationConstants.priceListDescriptionHeader} />
									</th>
									<th className="py-3 px-4 text-right">
										<Translate text={localizationConstants.priceListOutPriceListAHeader} />
									</th>
									<th className="py-3 px-4 text-right">
										<Translate text={localizationConstants.priceListCalcCostHeader} />
									</th>
									<th className="py-3 px-4 text-center">
										<Translate text={localizationConstants.priceListStockHeader} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 text-xs">
								{selectedPriceList.articles?.map((article) => (
									<tr key={article.id} className="hover:bg-slate-50/70 transition-colors">
										<td className="py-3 px-4 text-center">
											<Star className="h-3.5 w-3.5 text-slate-300 mx-auto" />
										</td>
										<td className="py-3 px-4 font-semibold text-slate-900">
											{article.articleNo}
										</td>
										<td className="py-3 px-4 text-slate-700">
											{article.benamning}
										</td>
										<td className="py-3 px-4 text-right font-bold text-slate-900">
											{article.outPriceListA} kr
										</td>
										<td className="py-3 px-4 text-right text-slate-600">
											{article.calculatedCost} kr
										</td>
										<td className="py-3 px-4 text-center text-slate-700">
											{article.stock}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Prisuppdatering Modal */}
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
