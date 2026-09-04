"use client";

import { Link2, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { SalesPayment } from "../../types";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";

type CompanyPaymentPanelProps = {
	payment: SalesPayment | null;
	onSendPayment: () => void;
	onMarkPaid: () => void;
};

/** The payment step shown once a company reaches Accepted. */
export function CompanyPaymentPanel({
	payment,
	onSendPayment,
	onMarkPaid,
}: CompanyPaymentPanelProps) {
	const t = useTranslate();

	if (!payment) {
		return (
			<>
				<p className="text-sm text-slate-500">
					<Translate
						text={localizationConstants.salesNextStepAcceptedHint}
					/>
				</p>
				<ConfirmDialog
					title={t(localizationConstants.salesConfirmSendPaymentTitle)}
					description={t(
						localizationConstants.salesConfirmSendPaymentDescription,
					)}
					confirmText={t(localizationConstants.salesConfirmLabel)}
					cancelText={t(localizationConstants.salesCancelButton)}
					onConfirm={onSendPayment}
					trigger={
						<Button
							type="button"
							className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
						>
							<Link2 className="mr-2 h-4 w-4" />
							<Translate
								text={localizationConstants.salesSendPaymentButton}
							/>
						</Button>
					}
				/>
			</>
		);
	}

	return (
		<div className="space-y-2 rounded-lg border border-slate-200 p-3">
			<p className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.salesPaymentStatusLabel} />
				{": "}
				<span
					className={
						payment.status === "paid" ? "text-emerald-700" : "text-slate-500"
					}
				>
					<Translate
						text={
							payment.status === "paid"
								? localizationConstants.salesPaymentPaid
								: localizationConstants.salesPaymentPending
						}
					/>
				</span>
			</p>

			<p className="text-sm text-slate-700">
				<Translate text={localizationConstants.salesInvoicedAmountLabel} />
				{": "}
				<span className="tabular-nums">{formatCurrency(payment.amount)}</span>
			</p>

			<p className="flex items-start gap-1 break-all text-xs text-slate-500">
				<Link2 className="mt-0.5 h-3 w-3 shrink-0" />
				{payment.link}
			</p>

			<p className="flex items-start gap-1 text-xs text-slate-500">
				<ReceiptText className="mt-0.5 h-3 w-3 shrink-0" />
				<span>
					<Translate text={localizationConstants.salesOrderInvoiceLabel} />{" "}
					{payment.invoiceNumber} ·{" "}
					<Translate text={localizationConstants.salesInvoiceSentLabel} />{" "}
					{formatDate(payment.sentAt)}
				</span>
			</p>

			{payment.status === "pending" ? (
				<ConfirmDialog
					title={t(localizationConstants.salesConfirmMarkPaidTitle)}
					description={t(
						localizationConstants.salesConfirmMarkPaidDescription,
					)}
					confirmText={t(localizationConstants.salesConfirmLabel)}
					cancelText={t(localizationConstants.salesCancelButton)}
					onConfirm={onMarkPaid}
					trigger={
						<Button
							type="button"
							size="sm"
							className="w-full cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
						>
							<Translate text={localizationConstants.salesMarkPaidButton} />
						</Button>
					}
				/>
			) : null}
		</div>
	);
}
