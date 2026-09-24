"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateArticleFormData } from "../../../../types/article.types";

export function ArticleAccountingStep2Fields() {
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
				{/* Försäljning SE Skattskyldighet */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleForsaljningSELabel} /> *
					</label>
					<Input
						{...register("forsaljningSESkattskyldighet")}
						placeholder="3001"
						className={`h-10 text-sm border-slate-200 ${errors.forsaljningSESkattskyldighet ? "border-red-500" : ""}`}
					/>
					{errors.forsaljningSESkattskyldighet && (
						<span className="text-[11px] text-red-500 font-medium">
							<Translate text={localizationConstants.validationArticleSalesRequired} />
						</span>
					)}
				</div>

				{/* Moms SE Skattskyldighet */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleMomsLabel} />
					</label>
					<Input
						{...register("momsSESkattskyldighet")}
						placeholder="25%"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Försäljning EU Skattskyldighet */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleForsaljningEULabel} />
					</label>
					<Input
						{...register("forsaljningEUSkattskyldighet")}
						placeholder="3002"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Lagerförändring */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleLagerforandringLabel} />
					</label>
					<Input
						{...register("lagerforandring")}
						placeholder="4990"
						className="h-10 text-sm border-slate-200"
					/>
				</div>
			</div>
		</div>
	);
}
