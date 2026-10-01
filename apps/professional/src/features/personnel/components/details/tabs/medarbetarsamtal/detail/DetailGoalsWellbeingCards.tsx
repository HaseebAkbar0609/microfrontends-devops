"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalItem } from "../../../../../types/medarbetarsamtal.types";

interface DetailGoalsWellbeingCardsProps {
	review: MedarbetarsamtalItem;
	onEditSection?: (sectionNumber: number) => void;
}

export function DetailGoalsWellbeingCards({
	review,
	onEditSection,
}: DetailGoalsWellbeingCardsProps) {
	return (
		<>
			{/* 3. Mål & Utveckling Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<h3 className="text-xs font-bold text-slate-900">
						<Translate text={localizationConstants.nyIncheckningSectionGoals} />
					</h3>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onEditSection?.(3)}
						className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
					>
						<Pencil className="h-3 w-3 text-slate-400" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				<div className="space-y-3 text-xs">
					<div>
						<span className="text-[11px] text-slate-400 block">
							<Translate text={localizationConstants.nyIncheckningRightPlaceQuestion} />
						</span>
						<p className="font-semibold text-slate-800">
							{review.rightPlace ? (
								<Translate text={localizationConstants.nyIncheckningYes} />
							) : (
								<Translate text={localizationConstants.nyIncheckningNo} />
							)}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningProgressLabel} />
							</span>
							<p className="font-semibold text-slate-800">{review.progress || "—"}</p>
						</div>
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningSkillsToDevelopLabel} />
							</span>
							<p className="font-semibold text-slate-800">{review.skillsToDevelop || "—"}</p>
						</div>
					</div>
				</div>
			</div>

			{/* 4. Välbefinnande & Engagemang Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<h3 className="text-xs font-bold text-slate-900">
						<Translate text={localizationConstants.nyIncheckningSectionWellbeing} />
					</h3>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onEditSection?.(4)}
						className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
					>
						<Pencil className="h-3 w-3 text-slate-400" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				<div className="space-y-3 text-xs">
					<div className="flex items-center justify-between">
						<span className="text-[11px] text-slate-400">
							<Translate text={localizationConstants.nyIncheckningOverallFeelingLabel} />
						</span>
						{review.overallFeeling === "positiv" && (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
								<Translate text={localizationConstants.medarbetarsamtalFeelingPos} />
							</span>
						)}
						{review.overallFeeling === "neutral" && (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
								<Translate text={localizationConstants.medarbetarsamtalFeelingNeut} />
							</span>
						)}
						{review.overallFeeling === "behover_uppmarksamhet" && (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
								<Translate text={localizationConstants.medarbetarsamtalFeelingWarn} />
							</span>
						)}
					</div>
					{review.negativeImpactNotes && (
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningNegativeImpactQuestion} />
							</span>
							<p className="text-slate-700 text-[11px]">{review.negativeImpactNotes}</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
