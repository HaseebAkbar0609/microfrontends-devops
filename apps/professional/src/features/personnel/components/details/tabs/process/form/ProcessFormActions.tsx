"use client";

import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ProcessFormActionsProps {
	onCancel: () => void;
	isSubmitting?: boolean;
}

export function ProcessFormActions({
	onCancel,
	isSubmitting,
}: ProcessFormActionsProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onCancel}
				className="h-9 px-5 text-xs font-medium border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg cursor-pointer shadow-2xs"
			>
				<Translate text={localizationConstants.processBtnCancel} />
			</Button>

			<Button
				type="submit"
				size="sm"
				disabled={isSubmitting}
				className="h-9 px-6 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs gap-1.5"
			>
				<Save className="w-3.5 h-3.5" />
				<Translate text={localizationConstants.processBtnSave} />
			</Button>
		</div>
	);
}
