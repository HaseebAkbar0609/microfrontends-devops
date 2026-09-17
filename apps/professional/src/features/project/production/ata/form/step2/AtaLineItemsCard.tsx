"use client";

import { CirclePlus, Sigma } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { distinctPeople, padCount, sectionTotals } from "../../ataMath";
import { ATA_SECTION_CONFIG } from "../../projectAta.config";
import type { AtaLineItem, AtaSection } from "../../types";
import { AtaCollapsibleCard } from "./AtaCollapsibleCard";
import { AtaLineItemsTable } from "./AtaLineItemsTable";

export interface AtaLineItemsCardProps {
	section: AtaSection;
	items: AtaLineItem[];
	/** Why Ändra is unavailable (a locked ÄTA), or `null`. */
	editReason: TranslationKeys | null;
	onEdit: (section: AtaSection) => void;
}

/**
 * One "Detaljerad information" section: its rows, the Σ box and Ändra. Staff
 * totals people ("Total egen personal 02"); the other four total Belopp with
 * the arvode it includes.
 */
export function AtaLineItemsCard({ section, items, editReason, onEdit }: AtaLineItemsCardProps) {
	const t = useTranslate();
	const config = ATA_SECTION_CONFIG[section];
	const totals = sectionTotals(items);

	return (
		<AtaCollapsibleCard titleKey={config.titleKey} icon={config.icon}>
			<div className="flex flex-col gap-4">
				<AtaLineItemsTable section={section} items={items} />

				<div className="flex flex-wrap items-end justify-between gap-3">
					<dl className="min-w-64 rounded-md bg-slate-100 px-3 py-2">
						<div className="flex items-baseline justify-between gap-6">
							<dt className="flex items-center gap-2 text-sm font-medium text-slate-900">
								<Sigma className="h-4 w-4 text-slate-500" aria-hidden />
								<Translate text={config.totalKey} />
							</dt>
							<dd className="text-base font-semibold text-slate-900 tabular-nums">
								{config.kind === "staff" ? padCount(distinctPeople(items)) : formatCurrency(totals.amount)}
							</dd>
						</div>
						{config.kind === "supplier" && (
							<div className="flex items-baseline justify-between gap-6 pl-6">
								<dt className="text-xs text-slate-500">
									<Translate text={localizationConstants.projectAtaOfWhichFee} />
								</dt>
								<dd className="text-xs text-slate-500 tabular-nums">{formatCurrency(totals.fee)}</dd>
							</div>
						)}
					</dl>

					<span title={editReason ? t(editReason) : undefined} className="flex">
						<Button
							type="button"
							onClick={() => onEdit(section)}
							disabled={Boolean(editReason)}
							aria-label={`${t(localizationConstants.createAtaBtnChange)} ${t(config.titleKey)}`}
							className="h-9 cursor-pointer gap-2 bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
						>
							<CirclePlus className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.createAtaBtnChange} />
						</Button>
					</span>
				</div>
			</div>
		</AtaCollapsibleCard>
	);
}

export default AtaLineItemsCard;
