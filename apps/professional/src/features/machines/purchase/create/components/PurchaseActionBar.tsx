import React from "react";
import { ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PurchaseActionBarProps {
	activeTab: "info" | "docs";
	onCancel: () => void;
	onSave: () => void;
	onNext: () => void;
}

export function PurchaseActionBar({
	activeTab,
	onCancel,
	onSave,
	onNext,
}: PurchaseActionBarProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-6 pb-12 mt-4">
			<Button
				type="button"
				onClick={onCancel}
				className="rounded-lg border border-slate-200 bg-white px-6 h-10 text-xs font-medium text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
			>
				<Translate text={localizationConstants.machinePurchaseBtnCancel} />
			</Button>

			<Button
				type="button"
				onClick={onSave}
				className="rounded-lg bg-[#111721] text-white hover:bg-slate-800 px-6 h-10 text-xs font-medium shadow-2xs flex items-center gap-2 cursor-pointer"
			>
				<span>
					<Translate text={localizationConstants.machinePurchaseBtnSave} />
				</span>
				<Save className="h-3.5 w-3.5" />
			</Button>

			{activeTab === "info" && (
				<Button
					type="button"
					onClick={onNext}
					className="rounded-lg bg-[#111721] text-white hover:bg-slate-800 px-6 h-10 text-xs font-medium shadow-2xs flex items-center gap-2 cursor-pointer"
				>
					<span>
						<Translate text={localizationConstants.machinePurchaseBtnNext} />
					</span>
					<ArrowRight className="h-3.5 w-3.5" />
				</Button>
			)}
		</div>
	);
}
