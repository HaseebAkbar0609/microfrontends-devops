"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ReviewFeeling } from "@/features/personnel/types/medarbetarsamtal.types";

interface Section4WellbeingProps {
	overallFeeling: ReviewFeeling;
	onOverallFeelingChange: (val: ReviewFeeling) => void;
	feelingChangedDate: string;
	onFeelingChangedDateChange: (val: string) => void;
	negativeImpactNotes: string;
	onNegativeImpactNotesChange: (val: string) => void;
}

export function Section4Wellbeing({
	overallFeeling,
	onOverallFeelingChange,
	feelingChangedDate,
	onFeelingChangedDateChange,
	negativeImpactNotes,
	onNegativeImpactNotesChange,
}: Section4WellbeingProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label className="text-xs font-semibold text-slate-700 block">
					<Translate
						text={localizationConstants.nyIncheckningOverallFeelingLabel}
					/>
				</Label>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onOverallFeelingChange("positiv")}
						className={`h-8 px-3 text-xs font-medium cursor-pointer ${
							overallFeeling === "positiv"
								? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300"
								: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
						}`}
					>
						<Translate text={localizationConstants.medarbetarsamtalFeelingPos} />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onOverallFeelingChange("neutral")}
						className={`h-8 px-3 text-xs font-medium cursor-pointer ${
							overallFeeling === "neutral"
								? "bg-slate-100 text-slate-800 border-slate-300 ring-1 ring-slate-300"
								: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
						}`}
					>
						<Translate text={localizationConstants.medarbetarsamtalFeelingNeut} />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onOverallFeelingChange("behover_uppmarksamhet")}
						className={`h-8 px-3 text-xs font-medium cursor-pointer ${
							overallFeeling === "behover_uppmarksamhet"
								? "bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-300"
								: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
						}`}
					>
						<Translate text={localizationConstants.medarbetarsamtalFeelingWarn} />
					</Button>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningFeelingLastChangedLabel}
					/>
				</Label>
				<Input
					type="date"
					value={feelingChangedDate}
					onChange={(e) => onFeelingChangedDateChange(e.target.value)}
					className="h-9 text-xs"
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningNegativeImpactQuestion}
					/>
				</Label>
				<Textarea
					value={negativeImpactNotes}
					onChange={(e) => onNegativeImpactNotesChange(e.target.value)}
					placeholder="Beskriv eventuella faktorer..."
					className="text-xs min-h-[70px] resize-y"
				/>
			</div>
		</div>
	);
}
