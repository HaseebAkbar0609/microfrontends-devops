"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateArticleFormData } from "../../../../types/article.types";

export function ArticleAccountingStep1Fields() {
	const {
		register,
		formState: { errors },
	} = useFormContext<CreateArticleFormData>();

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
				<Translate text={localizationConstants.createArticleBokforingsUppgifterSection} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Sales Account / Försäljning */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleForsaljningLabel} /> *
					</label>
					<Input
						{...register("forsaljning")}
						placeholder="3001"
						className={`h-10 text-sm border-slate-200 ${errors.forsaljning ? "border-red-500" : ""}`}
					/>
					{errors.forsaljning && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleSalesRequired} />
						</span>
					)}
				</div>

				{/* VAT / Moms */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleMomsLabel} /> *
					</label>
					<Input
						{...register("moms")}
						placeholder="25%"
						className={`h-10 text-sm border-slate-200 ${errors.moms ? "border-red-500" : ""}`}
					/>
					{errors.moms && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleVatRequired} />
						</span>
					)}
				</div>

				{/* Sales SE */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleForsaljningSELabel} />
					</label>
					<Input
						{...register("forsaljningSE")}
						placeholder="3001"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Sales EU */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleForsaljningEULabel} />
					</label>
					<Input
						{...register("forsaljningEU")}
						placeholder="3002"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Stock Account / Lagerkonto */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleLagerkontoLabel} />
					</label>
					<Input
						{...register("lagerkonto")}
						placeholder="1460"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Purchase Account / Inköp */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleInkopLabel} />
					</label>
					<Input
						{...register("inkop")}
						placeholder="4001"
						className="h-10 text-sm border-slate-200"
					/>
				</div>
			</div>
		</div>
	);
}
