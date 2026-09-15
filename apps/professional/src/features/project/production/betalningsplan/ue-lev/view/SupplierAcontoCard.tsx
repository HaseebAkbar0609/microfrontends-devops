"use client";

import { useMemo } from "react";
import { Folder } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { toReceive, type PaymentPlanSummary } from "../../paymentPlanMath";
import { AcontoSummary, type AcontoSummaryLabels } from "../../view/AcontoSummary";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import { SortableHead } from "../../../components/SortableHead";
import type { SupplierAconto } from "../types";
import { SupplierAcontoRow } from "./SupplierAcontoRow";

type SortKey = "date" | "activity" | "lift" | "amount" | "retained" | "toPay" | "economy";

const COLUMNS: { key: SortKey; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.colDatum },
	{ key: "activity", labelKey: localizationConstants.colAktivitet },
	{ key: "lift", labelKey: localizationConstants.colLyft },
	{ key: "amount", labelKey: localizationConstants.colBelopp },
	{ key: "retained", labelKey: localizationConstants.colInnehallet },
	{ key: "toPay", labelKey: localizationConstants.projectSupplierPlanToPay },
	{ key: "economy", labelKey: localizationConstants.projectPaymentPlanColEconomy },
];

const SUMMARY_LABELS: AcontoSummaryLabels = {
	sent: localizationConstants.projectSupplierPlanReceived,
	remaining: localizationConstants.projectSupplierPlanRemaining,
};

function sortValue(aconto: SupplierAconto, key: string): string | number {
	if (key === "amount") return aconto.amount;
	if (key === "retained") return aconto.retained;
	if (key === "toPay") return toReceive(aconto);
	return aconto[key as "date" | "activity" | "lift" | "economy"];
}

export interface SupplierAcontoCardProps {
	acontos: SupplierAconto[];
	summary: PaymentPlanSummary;
	onMarkPaid: (aconto: SupplierAconto) => void;
	onViewInvoice: (aconto: SupplierAconto) => void;
}

/** Aconto lyft — what the project pays the supplier, and what has gone out. */
export function SupplierAcontoCard({ acontos, summary, onMarkPaid, onViewInvoice }: SupplierAcontoCardProps) {
	const { sortField, sortDir, toggleSort } = useTableSort<SortKey>();
	const rows = useMemo(() => sortItems(acontos, sortField, sortDir, sortValue), [acontos, sortField, sortDir]);

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectSupplierPlanAcontoLift}
			icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="flex flex-col gap-4"
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[52rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{COLUMNS.map((column) => (
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
								<TableCell colSpan={COLUMNS.length + 2} className="py-10 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.projectSupplierPlanAcontosEmpty} />
								</TableCell>
							</TableRow>
						) : (
							rows.map((aconto) => (
								<SupplierAcontoRow
									key={aconto.id}
									aconto={aconto}
									onMarkPaid={() => onMarkPaid(aconto)}
									onViewInvoice={() => onViewInvoice(aconto)}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>
			<AcontoSummary summary={summary} labels={SUMMARY_LABELS} />
		</ProjectSectionCard>
	);
}

export default SupplierAcontoCard;
