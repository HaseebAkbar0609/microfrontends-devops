"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreatePriceListForm } from "../../../hooks/useCreatePriceListForm";
import { Step1GrundInfo } from "./steps/Step1GrundInfo";
import { Step2ArtikelLista } from "./steps/Step2ArtikelLista";
import { PRICE_LISTS_BASE_ROUTE } from "../../../constants/priceLists.constants";

export function CreatePriceListWizard() {
	const router = useRouter();
	const {
		currentStep,
		formData,
		errors,
		isSubmitting,
		updateField,
		goToNextStep,
		goToPrevStep,
		submitForm,
		articlesSearchQuery,
		setArticlesSearchQuery,
		filteredArticles,
		toggleArticleSelection,
		toggleSelectAllArticles,
	} = useCreatePriceListForm();

	return (
		<div className="space-y-6">
			{/* Top Header Row: Subtabs on left + Steg 1/2 Progress Bar on right */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 gap-4">
				<div className="flex gap-8 -mb-px">
					<button
						type="button"
						onClick={goToPrevStep}
						className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
							currentStep === 1
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.priceListBasicInfoTab} />
					</button>
					<button
						type="button"
						onClick={goToNextStep}
						className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
							currentStep === 2
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.priceListArticleListTab} />
					</button>
				</div>

				{/* Progress Indicator matching Figma Image 5 */}
				<div className="flex flex-col items-end gap-1.5 pb-2">
					<span className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.stepLabel} /> {currentStep}/2
					</span>
					<div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-slate-900 transition-all duration-300 rounded-full"
							style={{ width: currentStep === 1 ? "50%" : "100%" }}
						/>
					</div>
				</div>
			</div>

			{/* Step Body */}
			{currentStep === 1 ? (
				<Step1GrundInfo
					formData={formData}
					errors={errors}
					onUpdateField={updateField}
				/>
			) : (
				<Step2ArtikelLista
					articles={filteredArticles}
					selectedArticleIds={formData.selectedArticleIds}
					searchQuery={articlesSearchQuery}
					onSearchChange={setArticlesSearchQuery}
					onToggleArticle={toggleArticleSelection}
					onToggleSelectAll={toggleSelectAllArticles}
				/>
			)}

			{/* Bottom Action Footer (Right-aligned Avbryt & Spara buttons) */}
			<div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
					className="h-10 px-6 text-xs font-semibold border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs rounded-lg cursor-pointer"
				>
					<Translate text={localizationConstants.cancelButton} />
				</Button>

				{currentStep === 1 ? (
					<Button
						type="button"
						onClick={goToNextStep}
						className="h-10 px-7 bg-[#111721] hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs rounded-lg cursor-pointer"
					>
						<Translate text={localizationConstants.saveButton} />
					</Button>
				) : (
					<Button
						type="button"
						onClick={submitForm}
						disabled={isSubmitting}
						className="h-10 px-7 bg-[#111721] hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs rounded-lg cursor-pointer"
					>
						<Translate text={localizationConstants.saveButton} />
					</Button>
				)}
			</div>
		</div>
	);
}
