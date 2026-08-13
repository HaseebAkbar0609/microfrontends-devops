"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface OrderOpenedActionBarProps {
	onCancel: () => void;
	onAccept: () => void;
}

export function OrderOpenedActionBar({ onCancel, onAccept }: OrderOpenedActionBarProps) {
	return (
		<div className="sticky bottom-0 z-30 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="h-10 px-6 text-sm font-medium border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 cursor-pointer shadow-none"
			>
				<Translate text={localizationConstants.cancel} />
			</Button>
			<Button
				type="button"
				onClick={onAccept}
				className="h-10 px-6 gap-2 text-sm font-medium bg-[#111721] text-white hover:bg-slate-800 cursor-pointer shadow-2xs"
			>
				<Check className="h-4 w-4" />
				<span><Translate text={localizationConstants.acceptButton} /></span>
			</Button>
		</div>
	);
}
