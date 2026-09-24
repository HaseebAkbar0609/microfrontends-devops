"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreatePriceListForm } from "../../../hooks/useCreatePriceListForm";
import { PriceListStepProgressBar } from "./PriceListStepProgressBar";
import { Step1GrundInfo } from "./steps/Step1GrundInfo";
import { Step2ArtikelLista } from "./steps/Step2ArtikelLista";
import { PRICE_LISTS_BASE_ROUTE } from "../../../constants/priceLists.constants";

export function CreatePriceListWizard() {
	const router = useRouter();
	const {
		currentStep,
		setStep,
		formData,
		errors,
		isSubmitting,
		updateField,
		goToNextStep,
		submitForm,
		articlesSearchQuery,
		setArticlesSearchQuery,
		categoryFilter,
		setCategoryFilter,
		filteredArticles,
		toggleArticleSelection,
		toggleSelectAllArticles,
		handleSortArticles,
		handleImportArticles,
	} = useCreatePriceListForm();

	return (
		<div className="space-y-6">
			{/* Subtabs Bar */}
			<div className="border-b border-slate-200">
				<div className="flex gap-8 -mb-px">
					<button
						type="button"
						onClick={() => setStep(1)}
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
						onClick={() => setStep(2)}
						className={`pb-3 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
							currentStep === 2
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.priceListArticleListTab} />
					</button>
				</div>
			</div>

			{/* Main 2-Column Content Grid matching Figma Image 2 */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Left Main Form Column */}
				<div className="lg:col-span-8 xl:col-span-9 space-y-6">
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
							categoryFilter={categoryFilter}
							onSearchChange={setArticlesSearchQuery}
							onCategoryChange={setCategoryFilter}
							onToggleArticle={toggleArticleSelection}
							onToggleSelectAll={toggleSelectAllArticles}
							onSortArticles={handleSortArticles}
							onImportArticles={handleImportArticles}
						/>
					)}
				</div>

				{/* Right Sidebar Column with Step Progress Card */}
				<div className="lg:col-span-4 xl:col-span-3 space-y-6">
					<PriceListStepProgressBar
						currentStep={currentStep}
						totalSteps={2}
					/>
				</div>
			</div>

			{/* Bottom Action Footer (Right-aligned Avbryt & Next/Spara buttons) */}
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
						<Translate text={localizationConstants.nextButton} />
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
