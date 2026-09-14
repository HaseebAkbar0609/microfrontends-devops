"use client";

import { MoreVertical, PencilLine, Trash2 } from "lucide-react";

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
import { acontoEconomyKey, acontoStatus } from "../paymentPlan.config";
import { deduction, toReceive } from "../paymentPlanMath";
import type { PaymentAconto } from "../types";
import { AcontoBadge } from "./AcontoBadge";

const CELL = "px-4 py-3 text-sm whitespace-nowrap text-slate-900";
const ITEM = "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900";

export interface AcontoRowProps {
	aconto: PaymentAconto;
	showEconomy: boolean;
	/** Rows can be changed — a draft plan, or a sent one unlocked by its pencil. */
	editable: boolean;
	/** Unsaved changes block invoicing until the plan is saved. */
	dirty: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onCreateInvoice: () => void;
	onViewInvoice: () => void;
}

/** One aconto: its figures, its status, and what can be done with it. */
export function AcontoRow({
	aconto,
	showEconomy,
	editable,
	dirty,
	onEdit,
	onDelete,
	onCreateInvoice,
	onViewInvoice,
}: AcontoRowProps) {
	const t = useTranslate();
	const status = acontoStatus(aconto);
	const economyKey = acontoEconomyKey(aconto);
	/* An invoiced row is fixed: the invoice was raised on these figures. */
	const locked = !editable || status.sent;
	const lockReason = status.sent ? t(localizationConstants.projectPaymentPlanInvoicedLocked) : undefined;
	const saveFirst = t(localizationConstants.projectPaymentPlanSaveFirst);

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
				<AcontoBadge labelKey={status.labelKey} positive={status.sent} />
			</TableCell>
			{showEconomy && (
				<TableCell className={CELL}>
					{status.sent ? (
						<AcontoBadge labelKey={economyKey} positive={aconto.paid} />
					) : (
						<Translate text={economyKey} />
					)}
				</TableCell>
			)}
			<TableCell className={CELL}>
				{status.sent ? (
					<Button type="button" variant="outline" onClick={onViewInvoice} className="h-9 cursor-pointer border-slate-200 px-3">
						<Translate text={localizationConstants.projectPaymentPlanViewInvoice} />
					</Button>
				) : (
					/* Wrapped so the reason still shows as a tooltip on a disabled button. */
					<span title={dirty ? saveFirst : undefined} className="inline-flex">
						<Button
							type="button"
							variant="outline"
							onClick={onCreateInvoice}
							disabled={dirty}
							className="h-9 cursor-pointer border-slate-200 px-3"
						>
							<Translate text={localizationConstants.projectPaymentPlanCreateInvoice} />
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
					<DropdownMenuContent align="end" className="w-44 border border-slate-200 bg-white p-1 shadow-md">
						<DropdownMenuItem disabled={locked} onClick={onEdit} title={lockReason} className={ITEM}>
							<PencilLine className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={localizationConstants.btnRedigera} />
						</DropdownMenuItem>
						<DropdownMenuItem disabled={locked} onClick={onDelete} title={lockReason} className={ITEM}>
							<Trash2 className="h-4 w-4 shrink-0" aria-hidden />
							<Translate text={localizationConstants.btnRadera} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

export default AcontoRow;
