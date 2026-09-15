"use client";

import { MoreVertical, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { deduction, toReceive } from "../../paymentPlanMath";
import { AcontoBadge } from "../../view/AcontoBadge";
import { SUPPLIER_ECONOMY_LABELS } from "../supplierPlan.config";
import type { SupplierAconto } from "../types";

const CELL = "px-4 py-3 text-sm whitespace-nowrap text-slate-900";

export interface SupplierAcontoRowProps {
	aconto: SupplierAconto;
	onMarkPaid: () => void;
	onViewInvoice: () => void;
}

/**
 * One Aconto lyft row. Ekonomi is a pill for Betald and Ej förfallen and plain
 * text for N/A; Handling opens the invoice once the aconto is paid and is a
 * disabled "N/A" until then, as the frame draws it.
 */
export function SupplierAcontoRow({ aconto, onMarkPaid, onViewInvoice }: SupplierAcontoRowProps) {
	const t = useTranslate();
	const paid = aconto.economy === "paid";
	const economyKey = SUPPLIER_ECONOMY_LABELS[aconto.economy];

	return (
		<TableRow>
			<TableCell className={CELL}>{aconto.date}</TableCell>
			<TableCell className={CELL}>{aconto.activity}</TableCell>
			<TableCell className={`${CELL} max-w-40 truncate`} title={aconto.lift}>
				{aconto.lift}
			</TableCell>
			<TableCell className={`${CELL} tabular-nums`}>{formatCurrency(aconto.amount)}</TableCell>
			<TableCell className={`${CELL} tabular-nums`}>{formatCurrency(deduction(aconto.retained))}</TableCell>
			<TableCell className={`${CELL} tabular-nums`}>{formatCurrency(toReceive(aconto))}</TableCell>
			<TableCell className={CELL}>
				{aconto.economy === "not_applicable" ? (
					<Translate text={economyKey} />
				) : (
					<AcontoBadge labelKey={economyKey} positive={paid} />
				)}
			</TableCell>
			<TableCell className={CELL}>
				{paid ? (
					<Button type="button" variant="outline" onClick={onViewInvoice} className="h-9 cursor-pointer border-slate-200 px-3">
						<Translate text={localizationConstants.projectPaymentPlanViewInvoice} />
					</Button>
				) : (
					<span title={t(localizationConstants.projectSupplierPlanNoInvoice)} className="inline-flex">
						<Button type="button" variant="outline" disabled className="h-9 border-slate-200 px-3">
							<Translate text={localizationConstants.projectPaymentPlanEconomyNotApplicable} />
						</Button>
					</span>
				)}
			</TableCell>
			<TableCell className="w-12 px-2 py-3 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`${t(localizationConstants.actions)} ${aconto.activity} ${aconto.date}`}
							className="h-9 w-9 cursor-pointer text-slate-700"
						>
							<MoreVertical className="h-4 w-4" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-52 border border-slate-200 bg-white p-1 shadow-md">
						<DropdownMenuItem
							disabled={paid}
							title={paid ? t(localizationConstants.projectSupplierPlanAlreadyPaid) : undefined}
							onClick={onMarkPaid}
							className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900"
						>
							<Wallet className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={localizationConstants.projectSupplierPlanMarkPaid} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

export default SupplierAcontoRow;
