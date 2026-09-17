"use client";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { deduction } from "../paymentPlanMath";

export interface InvoiceSummaryDialogProps {
	activity: string;
	lift: string;
	/** `yyyy-MM-dd`. */
	date?: string;
	amount: number;
	retained: number;
	economyKey: TranslationKeys;
	/** Defaults to "Fakturadatum"; a supplier's paid aconto reads "Betaldatum". */
	dateLabelKey?: TranslationKeys;
	/** Defaults to "Att erhålla"; a supplier's plan reads "Att betala". */
	toReceiveLabelKey?: TranslationKeys;
	onClose: () => void;
}

/**
 * "Se Faktura" — the figures behind one aconto's invoice.
 *
 * Read-only and local: the invoicing module has no invoice to open for an
 * aconto yet, so this shows what the invoice was raised on. Flagged. Shared by
 * the Beställare plan and a supplier's plan, which word two fields differently.
 */
export function InvoiceSummaryDialog({
	activity,
	lift,
	date,
	amount,
	retained,
	economyKey,
	dateLabelKey = localizationConstants.projectPaymentPlanInvoiceDate,
	toReceiveLabelKey = localizationConstants.colAttErhalla,
	onClose,
}: InvoiceSummaryDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectPaymentPlanInvoiceSummaryTitle} />
						{` — ${activity}`}
					</DialogTitle>
				</DialogHeader>

				<dl className="grid grid-cols-2 gap-x-6 gap-y-4">
					<InfoField labelKey={localizationConstants.colLyft} value={lift} />
					<InfoField labelKey={dateLabelKey} value={date} />
					<InfoField labelKey={localizationConstants.colBelopp} value={`${formatCurrency(amount)} kr`} />
					<InfoField labelKey={localizationConstants.colInnehallet} value={`${formatCurrency(deduction(retained))} kr`} />
					<InfoField labelKey={toReceiveLabelKey} value={`${formatCurrency(amount - retained)} kr`} />
					<InfoField labelKey={localizationConstants.projectPaymentPlanColEconomy} value={t(economyKey)} />
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
