"use client";

import { useMemo } from "react";
import { MapIcon, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ataSummary, padCount } from "../ataMath";
import type { AtaLineItems } from "../types";

const ROW = "flex items-baseline justify-between gap-3";

export interface AtaRailFiguresProps {
	/** As written after "ÄTA Nr:" — "106" for the project's own, "001" for a supplier's. */
	numberLabel: string;
	/** The project number without its `#`, the frame's "PRJ092" badge. */
	projectNo: string;
	projectCity: string;
	clientCity: string;
	lineItems: AtaLineItems;
}

/**
 * The rail's figures, shared by Skapa ÄTA and a supplier's View ÄTA: ÄTA Nr
 * with the project badge, the project's and the client's towns (once when they
 * match), and the running totals from the rows.
 */
export function AtaRailFigures({ numberLabel, projectNo, projectCity, clientCity, lineItems }: AtaRailFiguresProps) {
	const t = useTranslate();
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
		<div className="space-y-4">
			<div className={ROW}>
				<p className="text-lg font-medium text-slate-900">
					<Translate text={localizationConstants.createAtaNumberPrefix} /> {numberLabel}
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
	);
}

export default AtaRailFigures;
