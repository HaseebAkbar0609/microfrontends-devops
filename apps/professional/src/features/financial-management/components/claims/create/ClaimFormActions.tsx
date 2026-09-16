"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ClaimFormActionsProps {
	activeTab: "basic" | "docs";
	onCancel: () => void;
	onNext: () => void;
	onPrevious: () => void;
	onSave: () => void;
	isSubmitting?: boolean;
}

export function ClaimFormActions({
	activeTab,
	onCancel,
	onNext,
	onPrevious,
	onSave,
	isSubmitting = false,
}: ClaimFormActionsProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-4 pb-12">
			{activeTab === "docs" && (
				<Button
					type="button"
					variant="outline"
					onClick={onPrevious}
					className="h-9 px-5 text-xs font-medium text-slate-700 hover:bg-slate-50 border-slate-200 rounded-md cursor-pointer bg-white gap-1.5"
				>
					<ArrowLeft className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.claimsBtnPrevious} />
				</Button>
			)}

			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="h-9 px-6 text-xs font-medium text-slate-700 hover:bg-slate-50 border-slate-200 rounded-md cursor-pointer bg-white"
			>
				<Translate text={localizationConstants.claimsBtnCancel} />
			</Button>

			{activeTab === "basic" ? (
				<Button
					type="button"
					onClick={onNext}
					className="h-9 px-6 bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-xs gap-1.5 cursor-pointer transition-colors"
				>
					<Translate text={localizationConstants.claimsBtnNext} />
					<ArrowRight className="w-3.5 h-3.5" />
				</Button>
			) : (
				<Button
					type="button"
					onClick={onSave}
					disabled={isSubmitting}
					className="h-9 px-6 bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium rounded-md shadow-xs gap-2 cursor-pointer transition-colors"
				>
					<Save className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.claimsBtnSave} />
				</Button>
			)}
		</div>
	);
}

export default ClaimFormActions;
