"use client";

import { useMemo } from "react";
import { MapIcon, MapPin, Send } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { StepRail } from "@/components/common/StepRail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ataSummary, padCount } from "../ataMath";
import { ATA_STEP_KEYS } from "../projectAta.config";
import type { AtaFormValues } from "./ataFormSchema";

const ROW = "flex items-baseline justify-between gap-3";

export interface AtaSummaryRailProps {
	control: Control<AtaFormValues>;
	step: number;
	number: number;
	/** The project number without its `#`, the frame's "PRJ092" badge. */
	projectNo: string;
	projectCity: string;
	sendReason: TranslationKeys | null;
	onSend: () => void;
}

/**
 * The right-hand card: the step bar (the shared `StepRail`), ÄTA Nr with the
 * project badge, the project's and the client's towns, the running totals from
 * the rows, and Skicka.
 */
export function AtaSummaryRail({ control, step, number, projectNo, projectCity, sendReason, onSend }: AtaSummaryRailProps) {
	const t = useTranslate();
	const [lineItems, clientCity] = useWatch({ control, name: ["lineItems", "client.city"] });
	const figures = useMemo(() => ataSummary(lineItems), [lineItems]);
	const sameTown = projectCity.trim().toLocaleLowerCase() === clientCity.trim().toLocaleLowerCase();

	const totals: [TranslationKeys, string][] = [
		[localizationConstants.projectAtaSectionStaff, padCount(figures.staffCount)],
		[localizationConstants.viewAtaTotalMaterial, formatCurrency(figures.material)],
		[localizationConstants.viewAtaTotalMachines, formatCurrency(figures.machines)],
		[localizationConstants.viewAtaTotalUe, formatCurrency(figures.ue)],
		[localizationConstants.viewAtaTotalSupplierAta, formatCurrency(figures.supplierAta)],
	];

	return (
		<StepRail current={step} steps={ATA_STEP_KEYS} className="order-first xl:order-none xl:w-80">
			<div className="space-y-4 border-t border-slate-200 pt-4">
				<div className={ROW}>
					<p className="text-lg font-medium text-slate-900">
						<Translate text={localizationConstants.createAtaNumberPrefix} /> {number}
					</p>
					{projectNo && <Badge variant="outline" className="border-slate-200 px-2 py-0.5 font-medium">{projectNo}</Badge>}
				</div>
				<div className="flex flex-wrap gap-2">
					{projectCity && (
						<Badge variant="success" className="gap-1 px-2 py-0.5" title={t(localizationConstants.projectAtaProjectCity)}>
							<MapIcon className="h-3 w-3" aria-hidden />
							{projectCity}
						</Badge>
					)}
					{clientCity.trim() && !sameTown && (
						<Badge variant="warning" className="gap-1 px-2 py-0.5" title={t(localizationConstants.projectAtaClientCity)}>
							<MapPin className="h-3 w-3" aria-hidden />
							{clientCity}
						</Badge>
					)}
				</div>
				<dl className="space-y-2">
					{totals.map(([labelKey, value]) => (
						<div key={labelKey} className={ROW}>
							<dt className="text-sm text-slate-500">
								<Translate text={labelKey} />
							</dt>
							<dd className="text-base text-slate-900 tabular-nums">{value}</dd>
						</div>
					))}
				</dl>
			</div>
			<div className="border-t border-slate-200 pt-4">
				<span title={sendReason ? t(sendReason) : undefined} className="flex">
					<Button
						type="button"
						onClick={onSend}
						disabled={Boolean(sendReason)}
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800"
					>
						<Send className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createAtaBtnSend} />
					</Button>
				</span>
				{sendReason && (
					<p className="pt-2 text-xs text-slate-500">
						<Translate text={sendReason} />
					</p>
				)}
			</div>
		</StepRail>
	);
}

export default AtaSummaryRail;
