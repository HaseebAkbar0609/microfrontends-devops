"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Section2WorkProps {
	jobTitle: string;
	onJobTitleChange: (val: string) => void;
	currentStatus: string;
	onCurrentStatusChange: (val: string) => void;
	worksWell: string;
	onWorksWellChange: (val: string) => void;
	challenging: string;
	onChallengingChange: (val: string) => void;
}

export function Section2Work({
	jobTitle,
	onJobTitleChange,
	currentStatus,
	onCurrentStatusChange,
	worksWell,
	onWorksWellChange,
	challenging,
	onChallengingChange,
}: Section2WorkProps) {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.nyIncheckningJobTitleLabel} />
					</Label>
					<Input
						value={jobTitle}
						onChange={(e) => onJobTitleChange(e.target.value)}
						placeholder="Tekniker / Djurvård"
						className="h-9 text-xs"
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.nyIncheckningCurrentStateLabel} />
					</Label>
					<Input
						value={currentStatus}
						onChange={(e) => onCurrentStatusChange(e.target.value)}
						placeholder="Nulägesbeskrivning"
						className="h-9 text-xs"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.nyIncheckningWhatWorksWellLabel} />
				</Label>
				<Textarea
					value={worksWell}
					onChange={(e) => onWorksWellChange(e.target.value)}
					placeholder="Beskriv vad som fungerar väl..."
					className="text-xs min-h-[70px] resize-y"
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningWhatIsChallengingLabel}
					/>
				</Label>
				<Textarea
					value={challenging}
					onChange={(e) => onChallengingChange(e.target.value)}
					placeholder="Beskriv eventuella utmaningar..."
					className="text-xs min-h-[70px] resize-y"
				/>
			</div>
		</div>
	);
}
