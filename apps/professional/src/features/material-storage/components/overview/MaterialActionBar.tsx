"use client";

import { Download, History, Plus, Upload, Warehouse, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { MaterialPageAction } from "../../hooks/useMaterialOverviewActions";
import type { MaterialDepot } from "../../types/materialStorage.types";

const DEPOT_LABEL_ID = "material-overview-depot-label";

const OUTLINE_BUTTON_CLASS = "h-10 gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50";

/** Outline buttons on the right, in Figma order; "Ta ut material" follows as the primary one. */
const SECONDARY_ACTIONS: { id: MaterialPageAction; label: TranslationKeys; icon: LucideIcon }[] = [
	{ id: "transactionHistory", label: localizationConstants.materialTransactionHistory, icon: History },
	{ id: "newMaterial", label: localizationConstants.materialNewMaterial, icon: Plus },
	{ id: "receive", label: localizationConstants.materialReceiveMaterial, icon: Download },
];

interface MaterialActionBarProps {
	depots: MaterialDepot[];
	depotId: string | null;
	onDepotChange: (depotId: string) => void;
	onAction: (action: MaterialPageAction) => void;
}

export function MaterialActionBar({ depots, depotId, onDepotChange, onAction }: MaterialActionBarProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div className="flex flex-wrap items-center gap-3">
				<span id={DEPOT_LABEL_ID} className="text-sm font-medium text-slate-700">
					<Translate text={localizationConstants.materialDepotLabel} />
				</span>
				<Select value={depotId ?? ""} onValueChange={onDepotChange} disabled={depots.length === 0}>
					<SelectTrigger aria-labelledby={DEPOT_LABEL_ID} className="w-72 cursor-pointer bg-white">
						<SelectValue placeholder={t(localizationConstants.materialDepotPlaceholder)} />
					</SelectTrigger>
					<SelectContent>
						{depots.map((depot) => (
							<SelectItem key={depot.id} value={depot.id} className="cursor-pointer">
								{depot.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button variant="outline" className={OUTLINE_BUTTON_CLASS} onClick={() => onAction("manageDepots")}>
					<Warehouse className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.materialManageDepots} />
				</Button>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				{SECONDARY_ACTIONS.map(({ id, label, icon: Icon }) => (
					<Button key={id} variant="outline" className={OUTLINE_BUTTON_CLASS} onClick={() => onAction(id)}>
						<Icon className="h-4 w-4" aria-hidden />
						<Translate text={label} />
					</Button>
				))}
				<Button className="h-10 gap-2 bg-[#111721] text-white hover:bg-slate-800" onClick={() => onAction("withdraw")}>
					<Upload className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.materialWithdrawMaterial} />
				</Button>
			</div>
		</div>
	);
}
