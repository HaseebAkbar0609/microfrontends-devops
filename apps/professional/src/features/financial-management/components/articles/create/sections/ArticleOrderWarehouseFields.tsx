"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateArticleFormData } from "../../../../types/article.types";

export function ArticleOrderWarehouseFields() {
	const { register } = useFormContext<CreateArticleFormData>();

	return (
		<div className="flex flex-col gap-4">
			<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
				<Translate text={localizationConstants.createArticleLagerplatsSection} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Beställningspunkt */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleBestallningspunkt} />
					</label>
					<Input
						{...register("bestallningspunkt")}
						placeholder="0"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* I Lager */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleILager} />
					</label>
					<Input
						{...register("iLager")}
						placeholder="0"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Vikt */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleViktLabel} />
					</label>
					<Input
						{...register("vikt")}
						placeholder="0.0 kg"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Längd */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleLangdLabel} />
					</label>
					<Input
						{...register("langd")}
						placeholder="0 mm"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Bredd */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleBreddLabel} />
					</label>
					<Input
						{...register("bredd")}
						placeholder="0 mm"
						className="h-10 text-sm border-slate-200"
					/>
				</div>

				{/* Höjd */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.articleHojdLabel} />
					</label>
					<Input
						{...register("hojd")}
						placeholder="0 mm"
						className="h-10 text-sm border-slate-200"
					/>
				</div>
			</div>
		</div>
	);
}
