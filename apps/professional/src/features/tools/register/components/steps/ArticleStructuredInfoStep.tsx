"use client";

import type { Control } from "react-hook-form";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { CreateArticleFormData } from "../../types";
import { FormInput, FormSelect } from "@/components/form";
import { Card, CardContent } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useState, useMemo } from "react";

interface ArticleStructuredInfoStepProps {
	readonly control: Control<CreateArticleFormData>;
}

const PRISER_A_OPTIONS = [
	{ value: "standard", label: "Standard" },
	{ value: "premium", label: "Premium" },
];

const EUROPRISLISTA_OPTIONS = [
	{ value: "eu-standard", label: "EU Standard" },
	{ value: "eu-premium", label: "EU Premium" },
];



const MOMS_OPTIONS = [
	{ value: "25", label: "25%" },
	{ value: "12", label: "12%" },
	{ value: "6", label: "6%" },
	{ value: "0", label: "0%" },
];

export function ArticleStructuredInfoStep({ control }: ArticleStructuredInfoStepProps) {
	const t = useTranslate();
	const [bokoringUppgifterOpen, setBokoringUppgifterOpen] = useState(true);
	const [bokforingsUppgifterOpen, setBokforingsUppgifterOpen] = useState(true);

	const bestallningspunktOptions = useMemo(
		() => [
			{ value: "lager", label: t(localizationConstants.bestallningspunktStock) },
			{ value: "bestallning", label: t(localizationConstants.bestallningspunktOrder) },
		],
		[t],
	);

	const LABEL_CLASS = "text-[14px] font-medium leading-5 text-[#09090B]";

	return (
		<div className="flex flex-col gap-3 sm:gap-4">
			{/* Priser Section */}
			<Card className="w-full max-w-[737px] gap-0 p-0">
				<div className="border-b border-slate-200 px-4 sm:px-6 py-4">
					<h3 className="text-sm font-medium text-slate-900 sm:text-base">
						<Translate text={localizationConstants.createArticlePriserSection} />
					</h3>
				</div>
				<CardContent className="p-0 px-4 sm:px-6 pt-4 pb-4">
					<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 items-start">
						<FormSelect
							control={control}
							name="priserA"
							label={localizationConstants.articlePriserA}
							placeholder={t(localizationConstants.placeholderSelectPriserA)}
							options={PRISER_A_OPTIONS}
							labelClassName={LABEL_CLASS}
						/>
						<FormSelect
							control={control}
							name="europrislista"
							label={localizationConstants.articleEuroprislista}
							placeholder={t(localizationConstants.placeholderSelectEuroprislista)}
							options={EUROPRISLISTA_OPTIONS}
							labelClassName={LABEL_CLASS}
						/>
						<FormInput
							control={control}
							name="kampanj"
							label={localizationConstants.articleKampanj}
							placeholder={t(localizationConstants.placeholderArticleKampanj)}
							labelClassName={LABEL_CLASS}
						/>
						<FormInput
							control={control}
							name="vipPriser"
							label={localizationConstants.articleVipPriser}
							placeholder={t(localizationConstants.placeholderArticleVipPriser)}
							labelClassName={LABEL_CLASS}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Bokörings uppgifter Section (Collapsible) */}
			<Card className="w-full max-w-[737px] gap-0 p-0">
				<button
					type="button"
					onClick={() => setBokoringUppgifterOpen(!bokoringUppgifterOpen)}
					className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left sm:px-6 sm:py-4"
				>
					<h3 className="text-sm font-medium text-slate-900 sm:text-base">
						<Translate text={localizationConstants.createArticleBokoringsUppgifterSection} />
					</h3>
					{bokoringUppgifterOpen ? (
						<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
					) : (
						<ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
					)}
				</button>
				{bokoringUppgifterOpen && (
					<CardContent className="p-0 px-4 sm:px-6 pt-4 pb-4">
						<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 items-start">
							<FormInput
								control={control}
								name="kalkylkostnad"
								label={localizationConstants.articleKalkylkostnad}
								placeholder={t(localizationConstants.placeholderArticleKalkylkostnad)}
								labelClassName={LABEL_CLASS}
							/>
							<FormSelect
								control={control}
								name="bestallningspunkt"
								label={localizationConstants.articleBestallningspunkt}
								placeholder={t(localizationConstants.placeholderSelectBestallningspunkt)}
								options={bestallningspunktOptions}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="iLager"
								label={localizationConstants.articleILager}
								placeholder={t(localizationConstants.placeholderArticleILager)}
								labelClassName={LABEL_CLASS}
								className="lg:col-span-2"
							/>
						</div>

						{/* Lagerplats Sub-section */}
						<div className="mt-4">
							<h4 className="mb-3 border-b border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.createArticleLagerplatsSection} />
							</h4>
							<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 items-start">
								<FormInput
									control={control}
									name="vikt"
									label={localizationConstants.articleViktLabel}
									placeholder={t(localizationConstants.placeholderArticleVikt)}
									labelClassName={LABEL_CLASS}
								/>
								<FormInput
									control={control}
									name="langd"
									label={localizationConstants.articleLangdLabel}
									placeholder={t(localizationConstants.placeholderArticleLangd)}
									labelClassName={LABEL_CLASS}
								/>
								<FormInput
									control={control}
									name="bredd"
									label={localizationConstants.articleBreddLabel}
									placeholder={t(localizationConstants.placeholderArticleBredd)}
									labelClassName={LABEL_CLASS}
								/>
								<FormInput
									control={control}
									name="hojd"
									label={localizationConstants.articleHojdLabel}
									placeholder={t(localizationConstants.placeholderArticleHojd)}
									labelClassName={LABEL_CLASS}
								/>
								<FormInput
									control={control}
									name="material"
									label={localizationConstants.articleMaterialLabel}
									placeholder={t(localizationConstants.placeholderArticleMaterial)}
									labelClassName={LABEL_CLASS}
								/>
							</div>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Bokföringsuppgifter Section (Collapsible) */}
			<Card className="w-full max-w-[737px] gap-0 p-0">
				<button
					type="button"
					onClick={() => setBokforingsUppgifterOpen(!bokforingsUppgifterOpen)}
					className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left sm:px-6 sm:py-4"
				>
					<h3 className="text-sm font-medium text-slate-900 sm:text-base">
						<Translate text={localizationConstants.createArticleBokforingsUppgifterSection} />
					</h3>
					{bokforingsUppgifterOpen ? (
						<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
					) : (
						<ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
					)}
				</button>
				{bokforingsUppgifterOpen && (
					<CardContent className="p-0 px-4 sm:px-6 pt-4 pb-4">
						<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 items-start">
							<FormInput
								control={control}
								name="forsaljningSESkattskyldighet"
								label={localizationConstants.articleForsaljningSELabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningSE)}
								labelClassName={LABEL_CLASS}
							/>
							<FormSelect
								control={control}
								name="momsSESkattskyldighet"
								label={localizationConstants.articleMomsLabel}
								placeholder={t(localizationConstants.placeholderSelectMoms)}
								options={MOMS_OPTIONS}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningEUSkattskyldighet"
								label={localizationConstants.articleForsaljningEULabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningEU)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="lagerkonto"
								label={localizationConstants.articleLagerkontoLabel}
								placeholder={t(localizationConstants.placeholderArticleLagerkonto)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningEUMoms"
								label={localizationConstants.articleForsaljningEUMomsLabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningEUMoms)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningExport"
								label={localizationConstants.articleForsaljningExportLabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningExport)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="inkop"
								label={localizationConstants.articleInkopLabel}
								placeholder={t(localizationConstants.placeholderArticleInkop)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="lagerforandring"
								label={localizationConstants.articleLagerforandringLabel}
								placeholder={t(localizationConstants.placeholderArticleLagerforandring)}
								labelClassName={LABEL_CLASS}
							/>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
