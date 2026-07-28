"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PriceListBasicInfoStep } from "./steps/PriceListBasicInfoStep";
import { PriceListArticleStep } from "./steps/PriceListArticleStep";
import { PriceListReviewStep } from "./steps/PriceListReviewStep";
import { cn } from "@/lib/utils";
import {
	createPriceListSchema,
	type CreatePriceListFormData,
	type PriceListArticleRow,
} from "../types";
import { createPriceListAPIAction } from "../api/priceListRegister";

const TABS = [
	{ key: 1, labelKey: localizationConstants.priceListBasicInfoTab },
	{ key: 2, labelKey: localizationConstants.priceListArticleListTab },
	{ key: 3, labelKey: localizationConstants.priceListReviewTab },
];

const TOTAL_STEPS = 3;

const STEP_FIELDS: Record<number, (keyof CreatePriceListFormData)[]> = {
	1: ["benamning", "datum", "skapadAv", "kategori", "enhet"],
	2: [],
	3: [],
};

export function CreatePriceListPage() {
	const t = useTranslate();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [articles, setArticles] = useState<PriceListArticleRow[]>([]);

	const methods = useForm<CreatePriceListFormData>({
		resolver: zodResolver(createPriceListSchema),
		defaultValues: {
			kod: "",
			benamning: "",
			datum: "",
			skapadAv: "",
			kommentar: "",
			kategori: "",
			enhet: "",
			kund: "",
			leverantor: "",
		},
	});

	const control = methods.control;

	const validateStep = async (step: number): Promise<boolean> => {
		const fields = STEP_FIELDS[step];
		if (!fields || fields.length === 0) return true;
		const result = await methods.trigger(fields);
		return result;
	};

	const handleNext = async () => {
		if (currentStep >= TOTAL_STEPS) return;
		const isValid = await validateStep(currentStep);
		if (!isValid) return;
		setCurrentStep((prev) => prev + 1);
	};

	const handleTabClick = async (step: number) => {
		setCurrentStep(step);
	};

	const handleSubmit = methods.handleSubmit(async (data) => {
		setIsSubmitting(true);
		try {
			const selectedArticles = articles.filter((a) => a.selected);
			await createPriceListAPIAction(data, selectedArticles);
			showToast("success", t(localizationConstants.priceListCreatedSuccess));
			router.push("/tools/register?tab=prislista");
		} catch {
			showToast("error", t(localizationConstants.priceListCreateError));
		} finally {
			setIsSubmitting(false);
		}
	});

	const handleCancel = () => {
		router.push("/tools/register?tab=prislista");
	};

	const handleArticlesLoaded = useCallback((loaded: PriceListArticleRow[]) => {
		setArticles((prev) => {
			const prevMap = new Map(prev.filter((a) => a.selected).map((a) => [a.id, true]));
			return loaded.map((a) => ({ ...a, selected: prevMap.has(a.id) }));
		});
	}, []);

	const handleToggleArticle = useCallback((id: string) => {
		setArticles((prev) =>
			prev.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)),
		);
	}, []);

	const handleToggleAll = useCallback(() => {
		setArticles((prev) => {
			const allSelected = prev.every((a) => a.selected);
			return prev.map((a) => ({ ...a, selected: !allSelected }));
		});
	}, []);

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			<div className="flex-1 gap-2 p-4">
				<div className="mb-4 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.priceListGoBackLabel)}
						onClick={handleCancel}
						className="rounded-md p-1 hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.createPriceListTitle} />
					</h1>
				</div>

				<div className="flex gap-4 ml-8 overflow-x-auto border-b border-slate-200 sm:mb-6 sm:gap-6">
					{TABS.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => handleTabClick(tab.key)}
							className={cn(
								"whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2",
								currentStep === tab.key
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<Translate text={tab.labelKey} />
						</button>
					))}
				</div>

				<div className="mb-4 ml-6 rounded-lg border border-slate-200 bg-white p-3 sm:mb-6 sm:p-4 xl:hidden">
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
						</p>
						<span className="text-xs font-semibold text-slate-600">
							{Math.round((currentStep / TOTAL_STEPS) * 100)}%
						</span>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full bg-[#111721] transition-all duration-300"
							style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
						/>
					</div>
				</div>

				<div className="pl-6 flex flex-col items-start gap-6 lg:gap-8 xl:flex-row">
					<div className="w-full min-w-0 flex-1">
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit}>
								{currentStep === 1 && <PriceListBasicInfoStep control={control} />}
								{currentStep === 2 && (
									<PriceListArticleStep
										articles={articles}
										onArticlesLoaded={handleArticlesLoaded}
										onToggleArticle={handleToggleArticle}
										onToggleAll={handleToggleAll}
									/>
								)}
								{currentStep === 3 && (
									<PriceListReviewStep
										articles={articles}
									/>
								)}
							</form>
						</FormProvider>
					</div>

					<div className="hidden w-72 shrink-0 xl:block">
						<div className="sticky top-6 rounded-lg bg-white p-4">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
								</p>
								<span className="text-xs font-semibold text-slate-600">
									{Math.round((currentStep / TOTAL_STEPS) * 100)}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-2 sm:pt-3">
				<div className="flex flex-wrap justify-end gap-2 px-3 pb-2 sm:flex-nowrap sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:pb-3">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={handleCancel}
						className="h-9 min-w-30 rounded bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{currentStep < TOTAL_STEPS ? (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleNext}
							className="h-9 min-w-30 rounded gap-2 bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					) : (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="h-9 min-w-40 rounded gap-2 bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.createPriceListTitle} />
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
