"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Section5FeedbackProps {
	managerFeedback: string;
	onManagerFeedbackChange: (val: string) => void;
	employeeFeedback: string;
	onEmployeeFeedbackChange: (val: string) => void;
	additionalNotes: string;
	onAdditionalNotesChange: (val: string) => void;
}

export function Section5Feedback({
	managerFeedback,
	onManagerFeedbackChange,
	employeeFeedback,
	onEmployeeFeedbackChange,
	additionalNotes,
	onAdditionalNotesChange,
}: Section5FeedbackProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningManagerFeedbackLabel}
					/>
				</Label>
				<Textarea
					value={managerFeedback}
					onChange={(e) => onManagerFeedbackChange(e.target.value)}
					placeholder="Chefens feedback och observationer..."
					className="text-xs min-h-[70px] resize-y"
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningEmployeeFeedbackLabel}
					/>
				</Label>
				<Textarea
					value={employeeFeedback}
					onChange={(e) => onEmployeeFeedbackChange(e.target.value)}
					placeholder="Medarbetarens tankar och reflektioner..."
					className="text-xs min-h-[70px] resize-y"
				/>
			</div>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate
						text={localizationConstants.nyIncheckningAdditionalNotesLabel}
					/>
				</Label>
				<Textarea
					value={additionalNotes}
					onChange={(e) => onAdditionalNotesChange(e.target.value)}
					placeholder="Ytterligare överenskomna punkter..."
					className="text-xs min-h-[70px] resize-y"
				/>
			</div>
		</div>
	);
}
