"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalItem } from "../../../../../types/medarbetarsamtal.types";

interface DetailInfoCardsProps {
	review: MedarbetarsamtalItem;
	onEditSection?: (sectionNumber: number) => void;
}

export function DetailInfoCards({
	review,
	onEditSection,
}: DetailInfoCardsProps) {
	return (
		<>
			{/* 1. Incheckningsdetaljer Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<h3 className="text-xs font-bold text-slate-900">
						<Translate text={localizationConstants.nyIncheckningDetailCardInfo} />
					</h3>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onEditSection?.(1)}
						className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
					>
						<Pencil className="h-3 w-3 text-slate-400" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				<div className="grid grid-cols-2 gap-3 text-xs">
					<div>
						<span className="text-[11px] text-slate-400 block">
							<Translate text={localizationConstants.nyIncheckningDateLabel} />
						</span>
						<p className="font-semibold text-slate-800">{review.checkInDate}</p>
					</div>
					<div>
						<span className="text-[11px] text-slate-400 block">
							<Translate text={localizationConstants.nyIncheckningTypeLabel} />
						</span>
						<p className="font-semibold text-slate-800">{review.checkInType}</p>
					</div>
					<div>
						<span className="text-[11px] text-slate-400 block">
							<Translate text={localizationConstants.nyIncheckningManagerLabel} />
						</span>
						<p className="font-semibold text-slate-800">{review.manager}</p>
					</div>
					<div>
						<span className="text-[11px] text-slate-400 block">
							<Translate text={localizationConstants.nyIncheckningEmployeeLabel} />
						</span>
						<p className="font-semibold text-slate-800">{review.employee}</p>
					</div>
				</div>
			</div>

			{/* 2. Arbete & Roll Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<h3 className="text-xs font-bold text-slate-900">
						<Translate text={localizationConstants.nyIncheckningSectionWork} />
					</h3>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => onEditSection?.(2)}
						className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
					>
						<Pencil className="h-3 w-3 text-slate-400" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				<div className="space-y-3 text-xs">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningJobTitleLabel} />
							</span>
							<p className="font-semibold text-slate-800">{review.jobTitle}</p>
						</div>
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningCurrentStateLabel} />
							</span>
							<p className="font-semibold text-slate-800">{review.currentStatus}</p>
						</div>
					</div>
					{review.worksWell && (
						<div>
							<span className="text-[11px] text-slate-400 block">
								<Translate text={localizationConstants.nyIncheckningWhatWorksWellLabel} />
							</span>
							<p className="text-slate-700 text-[11px]">{review.worksWell}</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
