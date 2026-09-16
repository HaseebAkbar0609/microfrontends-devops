"use client";

import React from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface AuthorityFormActionsProps {
	onCancel: () => void;
	isSubmitting?: boolean;
}

export function AuthorityFormActions({
	onCancel,
	isSubmitting = false,
}: AuthorityFormActionsProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="h-10 px-4 text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs gap-1.5"
			>
				<X className="h-4 w-4" />
				<Translate text={localizationConstants.actionCancel} />
			</Button>
			<Button
				type="submit"
				disabled={isSubmitting}
				className="h-10 px-6 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-2xs gap-1.5 cursor-pointer"
			>
				<Save className="h-4 w-4" />
				<Translate text={localizationConstants.actionSave} />
			</Button>
		</div>
	);
}

export default AuthorityFormActions;
