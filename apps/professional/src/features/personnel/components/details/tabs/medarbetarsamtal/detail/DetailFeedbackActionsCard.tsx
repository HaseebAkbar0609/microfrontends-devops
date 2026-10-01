"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalItem } from "../../../../../types/medarbetarsamtal.types";

interface DetailFeedbackActionsCardProps {
	review: MedarbetarsamtalItem;
	onEditSection?: (sectionNumber: number) => void;
}

export function DetailFeedbackActionsCard({
	review,
	onEditSection,
}: DetailFeedbackActionsCardProps) {
	return (
		<>
			{/* 5. Feedback & Dialog Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<h3 className="text-xs font-bold text-slate-900">
						<Translate text={localizationConstants.nyIncheckningSectionFeedback} />
					</h3>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onEditSection?.(5)}
						className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
					>
						<Pencil className="h-3 w-3 text-slate-400" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				<div className="space-y-2 text-xs">
					{review.managerFeedback && (
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningManagerFeedbackLabel} />
							</span>
							<p className="text-slate-700 text-[11px]">{review.managerFeedback}</p>
						</div>
					)}
					{review.employeeFeedback && (
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningEmployeeFeedbackLabel} />
							</span>
							<p className="text-slate-700 text-[11px]">{review.employeeFeedback}</p>
						</div>
					)}
				</div>
			</div>

			{/* 6. Åtgärder & Uppföljningar Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<h3 className="text-xs font-bold text-slate-900">
						<Translate text={localizationConstants.nyIncheckningSectionActions} />
					</h3>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onEditSection?.(6)}
						className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
					>
						<Pencil className="h-3 w-3 text-slate-400" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				<div className="space-y-3 text-xs">
					<ul className="list-disc list-inside space-y-1 text-slate-700">
						{review.followups.length === 0 ? (
							<li className="text-slate-400 italic">
								<Translate text={localizationConstants.medarbetarsamtalEmptyActions} />
							</li>
						) : (
							review.followups.map((f) => (
								<li key={f.id} className="text-slate-700">
									{f.title}
								</li>
							))
						)}
					</ul>
					{review.nextCheckInDate && (
						<div className="pt-2 border-t border-slate-100">
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningScheduleNextLabel} />
							</span>
							<p className="font-semibold text-slate-800">{review.nextCheckInDate}</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
