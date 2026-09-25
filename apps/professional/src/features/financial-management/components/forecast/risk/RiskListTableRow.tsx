"use client";

import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import { RISK_LEVEL_META } from "../../../constants/forecastRisk.constants";
import type { RiskClient } from "../../../types/forecastRisk.types";
import { formatSek } from "../../../utils/economyFormatters";
import { riskClientTotals } from "../../../utils/forecastRisk";
import { RiskProgressCell } from "./RiskProgressCell";

const CELL = "px-4 py-3.5 text-sm whitespace-nowrap text-slate-900";

export interface RiskListTableRowProps {
	client: RiskClient;
	onView: () => void;
}

/** One client: what it is building, what it owes, and where that leaves it. */
export function RiskListTableRow({ client, onView }: RiskListTableRowProps) {
	const t = useTranslate();
	const totals = riskClientTotals(client);
	const level = RISK_LEVEL_META[totals.level];

	return (
		<TableRow className="group hover:bg-slate-50">
			<TableCell className={cn(CELL, "font-medium")}>{client.name}</TableCell>

			{/* Two digits, as the frame counts them. */}
			<TableCell className={cn(CELL, "tabular-nums")}>
				{String(totals.activeObjects).padStart(2, "0")}
			</TableCell>

			<TableCell className="px-4 py-3">
				<RiskProgressCell
					percent={totals.spentPercent}
					amount={formatSek(totals.totalCost)}
					label={t(localizationConstants.forecastRiskSpendBarLabel, { client: client.name })}
				/>
			</TableCell>

			<TableCell className={cn(CELL, "tabular-nums")}>{formatSek(client.settings.creditLimit)}</TableCell>

			<TableCell className={cn(CELL, "font-medium text-emerald-600 tabular-nums")}>
				{formatSek(totals.totalPaid)}
			</TableCell>

			<TableCell className={cn(CELL, "font-medium tabular-nums", level.amountClass)}>
				{formatSek(totals.pendingAmount)}
			</TableCell>

			<TableCell className={CELL}>
				<Badge variant={level.variant}>{t(level.labelKey)}</Badge>
			</TableCell>

			<TableCell className={cn(FORECAST_ACTION_COLUMN, "z-10 px-2 py-2 group-hover:bg-slate-50")}>
				<div className="flex items-center justify-end">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onView}
						aria-label={t(localizationConstants.forecastRiskViewDetailsFor, { client: client.name })}
						className="h-8 w-8 cursor-pointer text-slate-700 hover:text-slate-900"
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
}

export default RiskListTableRow;
