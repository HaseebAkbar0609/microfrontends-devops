"use client";

import { useMemo } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { acontoEconomyKey } from "../paymentPlan.config";
import { toReceive } from "../paymentPlanMath";
import type { PaymentAconto } from "../types";
import { AcontoRow } from "./AcontoRow";
import { SortableHead } from "../../components/SortableHead";

type AcontoSortKey = "date" | "activity" | "lift" | "amount" | "retained" | "toReceive" | "status" | "economy";

const COLUMNS: { key: AcontoSortKey; labelKey: TranslationKeys; economyOnly?: boolean }[] = [
	{ key: "date", labelKey: localizationConstants.colDatum },
	{ key: "activity", labelKey: localizationConstants.colAktivitet },
	{ key: "lift", labelKey: localizationConstants.colLyft },
	{ key: "amount", labelKey: localizationConstants.colBelopp },
	{ key: "retained", labelKey: localizationConstants.colInnehallet },
	{ key: "toReceive", labelKey: localizationConstants.colAttErhalla },
	{ key: "status", labelKey: localizationConstants.statusLabel },
	{ key: "economy", labelKey: localizationConstants.projectPaymentPlanColEconomy, economyOnly: true },
];

/** What each column sorts by; amounts as numbers, ISO dates as text. */
function sortValue(aconto: PaymentAconto, key: string): string | number {
	switch (key as AcontoSortKey) {
		case "amount":
			return aconto.amount;
		case "retained":
			return aconto.retained;
		case "toReceive":
			return toReceive(aconto);
		case "status":
			return aconto.invoicedDate ? 1 : 0;
		case "economy":
			return acontoEconomyKey(aconto);
		default:
			return aconto[key as "date" | "activity" | "lift"];
	}
}

export interface AcontoTableProps {
	acontos: PaymentAconto[];
	showEconomy: boolean;
	editable: boolean;
	dirty: boolean;
	onEdit: (aconto: PaymentAconto) => void;
	onDelete: (aconto: PaymentAconto) => void;
	onCreateInvoice: (aconto: PaymentAconto) => void;
	onViewInvoice: (aconto: PaymentAconto) => void;
}

/**
 * Innehöll medel's rows. Every figure column sorts, as the frame draws; the
 * table scrolls sideways inside its card rather than widening the page.
 */
export function AcontoTable({ acontos, showEconomy, ...handlers }: AcontoTableProps) {
	const { sortField, sortDir, toggleSort } = useTableSort<AcontoSortKey>();
	const columns = COLUMNS.filter((column) => showEconomy || !column.economyOnly);
	const rows = useMemo(() => sortItems(acontos, sortField, sortDir, sortValue), [acontos, sortField, sortDir]);

	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[56rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{columns.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => toggleSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
						<SortableHead labelKey={localizationConstants.projectPaymentPlanColHandling} />
						<TableHead className="w-12" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns.length + 2} className="py-10 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.projectPaymentPlanAcontosEmpty} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((aconto) => (
							<AcontoRow
								key={aconto.id}
								aconto={aconto}
								showEconomy={showEconomy}
								editable={handlers.editable}
								dirty={handlers.dirty}
								onEdit={() => handlers.onEdit(aconto)}
								onDelete={() => handlers.onDelete(aconto)}
								onCreateInvoice={() => handlers.onCreateInvoice(aconto)}
								onViewInvoice={() => handlers.onViewInvoice(aconto)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default AcontoTable;
