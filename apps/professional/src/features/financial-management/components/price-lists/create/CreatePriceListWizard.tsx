"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
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
			{/* Two-step progress header */}
			<div className="flex border-b border-slate-200">
				<button
					type="button"
					onClick={goToPrevStep}
					className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
						currentStep === 1
							? "border-slate-900 text-slate-900"
							: "border-transparent text-slate-500 hover:text-slate-800"
					}`}
				>
					1. <Translate text={localizationConstants.priceListBasicInfoTab} />
				</button>
				<button
					type="button"
					onClick={goToNextStep}
					className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
						currentStep === 2
							? "border-slate-900 text-slate-900"
							: "border-transparent text-slate-500 hover:text-slate-800"
					}`}
				>
					2. <Translate text={localizationConstants.priceListArticleListTab} />
				</button>
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

			{/* Bottom Action Footer */}
			<div className="flex items-center justify-between pt-4 border-t border-slate-200">
				{currentStep === 1 ? (
					<>
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push(PRICE_LISTS_BASE_ROUTE)}
							className="h-10 px-5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
						>
							<X className="h-4 w-4" />
							<Translate text={localizationConstants.cancelButton} />
						</Button>

						<Button
							type="button"
							onClick={goToNextStep}
							className="h-10 px-6 bg-[#111721] hover:bg-slate-800 text-white text-xs font-semibold gap-2 rounded-lg shadow-2xs cursor-pointer"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					</>
				) : (
					<>
						<Button
							type="button"
							variant="outline"
							onClick={goToPrevStep}
							className="h-10 px-5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
						>
							<ArrowLeft className="h-4 w-4" />
							<Translate text={localizationConstants.btnPrevious} />
						</Button>

						<Button
							type="button"
							onClick={submitForm}
							disabled={isSubmitting}
							className="h-10 px-6 bg-[#111721] hover:bg-slate-800 text-white text-xs font-semibold gap-2 rounded-lg shadow-2xs cursor-pointer"
						>
							<Save className="h-4 w-4" />
							<Translate text={localizationConstants.priceListSaveButton} />
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
