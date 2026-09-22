"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	useCreateArticleForm,
	TOTAL_ARTICLE_STEPS,
} from "../../../hooks/useCreateArticleForm";
import { CreateArticleStepProgress } from "./CreateArticleStepProgress";
import { CreateArticleActionsBar } from "./CreateArticleActionsBar";
import { ArticleBasicInfoStep } from "./steps/ArticleBasicInfoStep";
import { ArticleStructuredInfoStep } from "./steps/ArticleStructuredInfoStep";

interface CreateArticleWizardProps {
	readonly articleId?: string;
}

export function CreateArticleWizard({ articleId }: CreateArticleWizardProps) {
	const t = useTranslate();
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
			<div className="flex flex-1 flex-col gap-6 p-6">
				<div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
				<div className="h-16 w-full animate-pulse rounded-xl bg-slate-200" />
				<div className="h-96 w-full animate-pulse rounded-xl bg-slate-200" />
			</div>
		);
	}

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
				{/* Top Bar with Back Button and Title */}
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={t(localizationConstants.goBackToRegisterLabel)}
						onClick={handleCancel}
						className="h-8 w-8 shrink-0 cursor-pointer"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</Button>
					<h1 className="text-xl font-bold tracking-tight text-slate-900">
						{isEdit ? (
							<Translate text={localizationConstants.editArticleTitle} />
						) : (
							<Translate text={localizationConstants.createArticleTitle} />
						)}
					</h1>
				</div>

				{/* 2-Step Progress Header */}
				<CreateArticleStepProgress
					currentStep={currentStep}
					onStepClick={handleTabClick}
				/>

				{/* Step Content */}
				{currentStep === 1 && (
					<ArticleBasicInfoStep
						priceListRows={priceListRows}
						onAddPriceListRow={handleAddPriceListRow}
						onRemovePriceListRow={handleRemovePriceListRow}
					/>
				)}

				{currentStep === 2 && <ArticleStructuredInfoStep />}

				{/* Actions Bar */}
				<CreateArticleActionsBar
					currentStep={currentStep}
					totalSteps={TOTAL_ARTICLE_STEPS}
					isSubmitting={isSubmitting}
					isEdit={isEdit}
					onNext={handleNext}
					onCancel={handleCancel}
				/>
			</form>
		</FormProvider>
	);
}

export default CreateArticleWizard;
