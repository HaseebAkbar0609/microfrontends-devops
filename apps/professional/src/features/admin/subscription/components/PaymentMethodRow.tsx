"use client";

import type { BillingPaymentMethod } from "@/api-actions";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CheckCircle2, CreditCard, Trash2 } from "lucide-react";

type PaymentMethodRowProps = {
	card: BillingPaymentMethod;
	canDelete: boolean;
	disabled: boolean;
	onDelete: () => void;
};

export function PaymentMethodRow({
	card,
	canDelete,
	disabled,
	onDelete,
}: PaymentMethodRowProps) {
	const t = useTranslate();
	return (
		<div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white p-4 sm:max-w-xl">
			<div className="flex min-w-0 items-center gap-3">
				<RadioGroupItem value={card.id} disabled={disabled} />
				<CreditCard className="h-5 w-5 shrink-0 text-slate-500" />
				<div className="min-w-0">
					<Label className="text-base font-medium capitalize text-slate-900">
						{card.brand ??
							t(localizationConstants.subscriptionPaymentMethodCard)}
						{" •••• "}
						{card.last4 ?? "----"}
						{card.is_default && (
							<span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
								<CheckCircle2 className="h-3 w-3" />
								<Translate
									text={
										localizationConstants.subscriptionPaymentDefault
									}
								/>
							</span>
						)}
					</Label>
					<p className="mt-1 text-sm text-slate-500">
						<Translate
							text={localizationConstants.subscriptionPaymentExpires}
						/>{" "}
						{String(card.exp_month ?? "--").padStart(2, "0")}/
						{card.exp_year ?? "----"}
					</p>
				</div>
			</div>
			<ConfirmDialog
				title={t(localizationConstants.subscriptionPaymentDeleteTitle)}
				description={t(
					localizationConstants.subscriptionPaymentDeleteDescription,
				)}
				confirmText={t(localizationConstants.subscriptionPaymentDelete)}
				cancelText={t(localizationConstants.cancel)}
				disabled={!canDelete || disabled}
				onConfirm={onDelete}
				trigger={
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={!canDelete || disabled}
						aria-label={t(
							localizationConstants.subscriptionPaymentDelete,
						)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				}
			/>
		</div>
	);
}
