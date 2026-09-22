"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	useCreateArticleForm,
	TOTAL_ARTICLE_STEPS,
} from "../../../hooks/useCreateArticleForm";
import { CreateArticleTabs } from "./CreateArticleTabs";
import { ArticleBasicInfoStep } from "./steps/ArticleBasicInfoStep";
import { ArticleStructuredInfoStep } from "./steps/ArticleStructuredInfoStep";

interface CreateArticleWizardProps {
	readonly articleId?: string;
}

export function CreateArticleWizard({ articleId }: CreateArticleWizardProps) {
	const {
		methods,
		currentStep,
		isSubmitting,
		isLoading,
		isEdit,
		priceListRows,
		handleNext,
		handleTabClick,
		handleSubmit,
		handleCancel,
		handleAddPriceListRow,
		handleRemovePriceListRow,
	} = useCreateArticleForm(articleId);

	if (isLoading) {
		return (
			<div className="p-6 w-full space-y-6">
				<div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
				<div className="h-12 w-full animate-pulse rounded-lg bg-slate-200" />
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-9 h-96 animate-pulse rounded-xl bg-slate-200" />
					<div className="lg:col-span-3 h-32 animate-pulse rounded-xl bg-slate-200" />
				</div>
			</div>
		);
	}

	return (
		<FormProvider {...methods}>
			<div className="p-6 w-full max-w-7xl mx-auto space-y-6">
				{/* Top Header with Back Button and Title */}
				<div className="flex items-center justify-between pb-2 border-b border-slate-200">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={handleCancel}
							className="text-slate-600 hover:text-slate-900 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<div>
							<h1 className="text-xl font-bold text-slate-900 tracking-tight">
								{isEdit ? (
									<Translate text={localizationConstants.editArticleTitle} />
								) : (
									<Translate text={localizationConstants.createArticleTitle} />
								)}
							</h1>
						</div>
					</div>

					{/* Top-Right Step Progress Bar matching Figma */}
					<div className="flex flex-col items-end gap-1.5">
						<div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
							<span>
								<Translate text={localizationConstants.customerStepPrefix} /> {currentStep}/{TOTAL_ARTICLE_STEPS}
							</span>
							<span className="text-slate-400 font-normal">
								({currentStep === 1 ? "50%" : "100%"})
							</span>
						</div>
						<div className="w-44 h-1.5 bg-slate-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-slate-900 transition-all duration-300 rounded-full"
								style={{ width: currentStep === 1 ? "50%" : "100%" }}
							/>
						</div>
					</div>
				</div>

				{/* Horizontal Tabs matching Figma */}
				<CreateArticleTabs
					activeTab={currentStep === 1 ? "basic_info" : "structured_info"}
					onTabChange={(tab) => handleTabClick(tab === "basic_info" ? 1 : 2)}
				/>

				{/* Full-Width Form Step Content */}
				<div className="w-full space-y-6">
					{currentStep === 1 && (
						<ArticleBasicInfoStep
							priceListRows={priceListRows}
							onAddPriceListRow={handleAddPriceListRow}
							onRemovePriceListRow={handleRemovePriceListRow}
						/>
					)}

					{currentStep === 2 && <ArticleStructuredInfoStep />}
				</div>

				{/* Navigation Footer */}
				<div className="flex items-center justify-end gap-3 pt-4 pb-12 border-t border-slate-100">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleCancel}
						className="h-10 px-5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-lg shadow-2xs"
					>
						<Translate text={localizationConstants.customerBtnCancel} />
					</Button>

					<Button
						type="button"
						size="sm"
						onClick={handleSubmit}
						disabled={isSubmitting}
						variant="outline"
						className="h-10 px-5 text-xs font-semibold text-slate-800 border-slate-300 hover:bg-slate-50 cursor-pointer rounded-lg shadow-2xs"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin mr-1.5" />
						) : (
							<Save className="h-4 w-4 mr-1.5 text-slate-600" />
						)}
						<Translate text={localizationConstants.customerBtnSave} />
					</Button>

					{currentStep < TOTAL_ARTICLE_STEPS && (
						<Button
							type="button"
							size="sm"
							onClick={handleNext}
							className="h-10 px-6 text-xs font-semibold gap-2 bg-[#111827] hover:bg-slate-800 text-white cursor-pointer rounded-lg shadow-2xs"
						>
							<Translate text={localizationConstants.customerBtnNext} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</FormProvider>
	);
}

export default CreateArticleWizard;
