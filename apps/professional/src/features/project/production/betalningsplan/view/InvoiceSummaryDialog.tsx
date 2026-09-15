"use client";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { acontoEconomyKey } from "../paymentPlan.config";
import { deduction, toReceive } from "../paymentPlanMath";
import type { PaymentAconto } from "../types";

export interface InvoiceSummaryDialogProps {
	aconto: PaymentAconto;
	onClose: () => void;
}

/**
 * "Se Faktura" — what was invoiced for one aconto.
 *
 * Read-only and local: the invoicing module has no invoice to open for an
 * aconto yet, so this shows the figures the invoice was raised on. Flagged.
 */
export function InvoiceSummaryDialog({ aconto, onClose }: InvoiceSummaryDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectPaymentPlanInvoiceSummaryTitle} />
						{` — ${aconto.activity}`}
					</DialogTitle>
				</DialogHeader>

				<dl className="grid grid-cols-2 gap-x-6 gap-y-4">
					<InfoField labelKey={localizationConstants.colLyft} value={aconto.lift} />
					<InfoField labelKey={localizationConstants.projectPaymentPlanInvoiceDate} value={aconto.invoicedDate} />
					<InfoField labelKey={localizationConstants.colBelopp} value={`${formatCurrency(aconto.amount)} kr`} />
					<InfoField labelKey={localizationConstants.colInnehallet} value={`${formatCurrency(deduction(aconto.retained))} kr`} />
					<InfoField labelKey={localizationConstants.colAttErhalla} value={`${formatCurrency(toReceive(aconto))} kr`} />
					<InfoField
						labelKey={localizationConstants.projectPaymentPlanColEconomy}
						value={t(acontoEconomyKey(aconto))}
					/>
				</dl>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
						<Translate text={localizationConstants.closeButton} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default InvoiceSummaryDialog;
