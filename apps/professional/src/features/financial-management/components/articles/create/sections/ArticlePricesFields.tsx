"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateArticleFormData } from "../../../../types/article.types";

export function ArticlePricesFields() {
	const { register } = useFormContext<CreateArticleFormData>();

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
				<Translate text={localizationConstants.createArticlePriserSection} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Priser A */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articlePriserA} />
					</label>
					<Input
						{...register("priserA")}
						placeholder="0,00"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Europrislista */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleEuroprislista} />
					</label>
					<Input
						{...register("europrislista")}
						placeholder="0,00"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Kampanj */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleKampanj} />
					</label>
					<Input
						{...register("kampanj")}
						placeholder="0,00"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* VIP Priser */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleVipPriser} />
					</label>
					<Input
						{...register("vipPriser")}
						placeholder="0,00"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Kalkylkostnad */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleKalkylkostnad} />
					</label>
					<Input
						{...register("kalkylkostnad")}
						placeholder="0,00"
						className="h-10 text-sm border-slate-200"
					/>
				</div>
			</div>
		</div>
	);
}
