"use client";

import React from "react";
import { Check } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { ARTICLE_FORM_TABS } from "../../../hooks/useCreateArticleForm";

interface CreateArticleStepProgressProps {
	readonly currentStep: number;
	readonly onStepClick: (step: number) => void;
}

export function CreateArticleStepProgress({
	currentStep,
	onStepClick,
}: CreateArticleStepProgressProps) {
	return (
		<div className="w-full flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 rounded-xl shadow-2xs">
			<div className="flex items-center gap-8 w-full">
				{ARTICLE_FORM_TABS.map((tab) => {
					const isCompleted = tab.key < currentStep;
					const isActive = tab.key === currentStep;

					return (
						<button
							key={tab.key}
							type="button"
							onClick={() => onStepClick(tab.key)}
							className={`flex items-center gap-3 group cursor-pointer transition-colors ${
								isActive
									? "text-slate-900 font-semibold"
									: isCompleted
										? "text-slate-700 font-medium"
										: "text-slate-400 font-normal"
							}`}
						>
							<div
								className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
									isActive
										? "bg-[#111721] text-white shadow-xs"
										: isCompleted
											? "bg-emerald-600 text-white"
											: "bg-slate-100 text-slate-500 border border-slate-200"
								}`}
							>
								{isCompleted ? <Check className="h-4 w-4" /> : tab.key}
							</div>
							<span className="text-sm">
								<Translate text={tab.labelKey} />
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
