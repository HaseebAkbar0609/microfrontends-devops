"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Section3GoalsProps {
	rightPlace: boolean;
	onRightPlaceChange: (val: boolean) => void;
	progress: string;
	onProgressChange: (val: string) => void;
	skillsToDevelop: string;
	onSkillsToDevelopChange: (val: string) => void;
	needsTrainingSupport: boolean;
	onNeedsTrainingSupportChange: (val: boolean) => void;
}

export function Section3Goals({
	rightPlace,
	onRightPlaceChange,
	progress,
	onProgressChange,
	skillsToDevelop,
	onSkillsToDevelopChange,
	needsTrainingSupport,
	onNeedsTrainingSupportChange,
}: Section3GoalsProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label className="text-xs font-semibold text-slate-700 block">
					<Translate
						text={localizationConstants.nyIncheckningRightPlaceQuestion}
					/>
				</Label>
				<div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
					<Button
						type="button"
						variant={rightPlace ? "default" : "ghost"}
						size="sm"
						onClick={() => onRightPlaceChange(true)}
						className={`h-7 px-3 text-xs font-medium ${
							rightPlace
								? "bg-white text-slate-900 shadow-2xs hover:bg-white"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<Translate text={localizationConstants.nyIncheckningYes} />
					</Button>
					<Button
						type="button"
						variant={!rightPlace ? "default" : "ghost"}
						size="sm"
						onClick={() => onRightPlaceChange(false)}
						className={`h-7 px-3 text-xs font-medium ${
							!rightPlace
								? "bg-white text-slate-900 shadow-2xs hover:bg-white"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<Translate text={localizationConstants.nyIncheckningNo} />
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.nyIncheckningProgressLabel} />
					</Label>
					<Input
						value={progress}
						onChange={(e) => onProgressChange(e.target.value)}
						placeholder="Framsteg och prestationer"
						className="h-9 text-xs"
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="text-xs font-semibold text-slate-700">
						<Translate
							text={localizationConstants.nyIncheckningSkillsToDevelopLabel}
						/>
					</Label>
					<Input
						value={skillsToDevelop}
						onChange={(e) => onSkillsToDevelopChange(e.target.value)}
						placeholder="Områden att utveckla"
						className="h-9 text-xs"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-xs font-semibold text-slate-700 block">
					<Translate
						text={localizationConstants.nyIncheckningSupportTrainingLabel}
					/>
				</Label>
				<div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
					<Button
						type="button"
						variant={needsTrainingSupport ? "default" : "ghost"}
						size="sm"
						onClick={() => onNeedsTrainingSupportChange(true)}
						className={`h-7 px-3 text-xs font-medium ${
							needsTrainingSupport
								? "bg-white text-slate-900 shadow-2xs hover:bg-white"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<Translate text={localizationConstants.nyIncheckningYes} />
					</Button>
					<Button
						type="button"
						variant={!needsTrainingSupport ? "default" : "ghost"}
						size="sm"
						onClick={() => onNeedsTrainingSupportChange(false)}
						className={`h-7 px-3 text-xs font-medium ${
							!needsTrainingSupport
								? "bg-white text-slate-900 shadow-2xs hover:bg-white"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<Translate text={localizationConstants.nyIncheckningNo} />
					</Button>
				</div>
			</div>
		</div>
	);
}
