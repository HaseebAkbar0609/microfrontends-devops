"use client";

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateArticleFormData } from "../../../../types/article.types";

export function ArticleAccountingStep1Fields() {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<CreateArticleFormData>();
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="flex flex-col gap-4">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full text-left cursor-pointer border-b border-slate-100 pb-2"
			>
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.createArticleBokforingsUppgifterSection} />
				</h3>
				{isOpen ? (
					<ChevronUp className="h-4 w-4 text-slate-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-400" />
				)}
			</button>

			{isOpen && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Left Column 1: Försäljning */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleForsaljningLabel} /> *
						</label>
						<Controller
							name="forsaljning"
							control={control}
							render={({ field }) => (
								<Select value={field.value || "3001"} onValueChange={field.onChange}>
									<SelectTrigger className={`h-10 border-slate-200 bg-white text-xs ${errors.forsaljning ? "border-red-500" : ""}`}>
										<SelectValue placeholder="Info" />
									</SelectTrigger>
									<SelectContent className="bg-white border-slate-200 shadow-md">
										<SelectItem value="3001">3001 - Försäljning Sverige 25% moms</SelectItem>
										<SelectItem value="3010">3010 - Försäljning Varor</SelectItem>
										<SelectItem value="3020">3020 - Försäljning Tjänster</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.forsaljning && (
							<span className="text-[11px] text-red-500 font-medium">
								<Translate text={localizationConstants.validationArticleSalesRequired} />
							</span>
						)}
					</div>

					{/* Right Column 1: Moms */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleMomsLabel} /> *
						</label>
						<Controller
							name="moms"
							control={control}
							render={({ field }) => (
								<Select value={field.value || "25%"} onValueChange={field.onChange}>
									<SelectTrigger className={`h-10 border-slate-200 bg-white text-xs ${errors.moms ? "border-red-500" : ""}`}>
										<SelectValue placeholder="Info" />
									</SelectTrigger>
									<SelectContent className="bg-white border-slate-200 shadow-md">
										<SelectItem value="25%">25%</SelectItem>
										<SelectItem value="12%">12%</SelectItem>
										<SelectItem value="6%">6%</SelectItem>
										<SelectItem value="0%">0% (Momsfri)</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.moms && (
							<span className="text-[11px] text-red-500 font-medium">
								<Translate text={localizationConstants.validationArticleVatRequired} />
							</span>
						)}
					</div>

					{/* Left Column 2: Försäljning SE omvänd moms */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleForsaljningSELabel} />
						</label>
						<Input
							{...register("forsaljningSESkattskyldighet")}
							placeholder="Info"
							className="h-10 text-xs bg-white border-slate-200"
						/>
					</div>

					{/* Right Column 2: Försäljning EU omvänd moms */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleForsaljningEULabel} />
						</label>
						<Input
							{...register("forsaljningEUSkattskyldighet")}
							placeholder="Info"
							className="h-10 text-xs bg-white border-slate-200"
						/>
					</div>

					{/* Left Column 3: Lagerkonto */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleLagerkontoLabel} />
						</label>
						<Input
							{...register("lagerkonto")}
							placeholder="Info"
							className="h-10 text-xs bg-white border-slate-200"
						/>
					</div>

					{/* Right Column 3: Försäljning EU momspliktig */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleForsaljningEUMomsLabel} />
						</label>
						<Input
							{...register("forsaljningEUMoms")}
							placeholder="Info"
							className="h-10 text-xs bg-white border-slate-200"
						/>
					</div>

					{/* Left Column 4: Försäljning Export */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleForsaljningExportLabel} />
						</label>
						<Input
							{...register("forsaljningExport")}
							placeholder="Info"
							className="h-10 text-xs bg-white border-slate-200"
						/>
					</div>

					{/* Right Column 4: Inköp */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.articleInkopLabel} />
						</label>
						<Input
							{...register("inkop")}
							placeholder="Info"
							className="h-10 text-xs bg-white border-slate-200"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
