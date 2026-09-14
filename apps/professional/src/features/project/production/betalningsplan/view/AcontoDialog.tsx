"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { Form, FormDatePicker, FormInput } from "@/components/form";
import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ACONTO_TEXT_MAX_LENGTH } from "../paymentPlan.config";
import { deduction, previewRetention } from "../paymentPlanMath";
import type { AcontoValues, PaymentAconto, PaymentTerms } from "../types";
import { acontoSchema, type AcontoFormValues } from "./acontoSchema";

/** A new row's id in the preview, before it has a real one. */
const PREVIEW_ID = "preview";

export interface AcontoDialogProps {
	/** The row being edited; omit to add one. */
	aconto?: PaymentAconto;
	acontos: PaymentAconto[];
	terms: PaymentTerms;
	onClose: () => void;
	onSave: (values: AcontoValues, id?: string) => void;
}

/**
 * "Lägg till aconto" / "Redigera aconto".
 *
 * Innehållet and Att erhålla are previewed from the same recalculation the plan
 * applies, so what the dialog shows is what the table will show. Mounted only
 * while open, so each opening starts from the row's own values.
 */
export function AcontoDialog({ aconto, acontos, terms, onClose, onSave }: AcontoDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	const form = useForm<AcontoFormValues>({
		resolver: zodResolver(acontoSchema) as Resolver<AcontoFormValues>,
		defaultValues: {
			date: aconto?.date ?? "",
			activity: aconto?.activity ?? "",
			lift: aconto?.lift ?? "",
			amount: aconto ? String(aconto.amount) : "",
		},
		mode: "onTouched",
	});

	const [date, amountText] = useWatch({ control: form.control, name: ["date", "amount"] });
	const amount = acontoSchema.shape.amount.safeParse(amountText).success ? Number(amountText) : 0;
	const retained = previewRetention(acontos, terms, {
		id: aconto?.id ?? PREVIEW_ID,
		date: date || "9999-12-31",
		amount,
	});

	const submit = (values: AcontoFormValues) =>
		onSave({ ...values, amount: Number(values.amount) }, aconto?.id);

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate
							text={
								aconto
									? localizationConstants.projectPaymentPlanAcontoEditTitle
									: localizationConstants.projectPaymentPlanAcontoAddTitle
							}
						/>
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} noValidate className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormDatePicker
								control={form.control}
								name="date"
								label={localizationConstants.colDatum}
								placeholder={localizationConstants.pickDatePlaceholder}
								iconPosition="start"
								translateError={translateError}
							/>
							<FormInput
								control={form.control}
								name="amount"
								label={localizationConstants.colBelopp}
								required
								inputProps={{ inputMode: "numeric" }}
								translateError={translateError}
							/>
							<FormInput
								control={form.control}
								name="activity"
								label={localizationConstants.colAktivitet}
								required
								inputProps={{ maxLength: ACONTO_TEXT_MAX_LENGTH, autoFocus: true }}
								translateError={translateError}
							/>
							<FormInput
								control={form.control}
								name="lift"
								label={localizationConstants.colLyft}
								required
								inputProps={{ maxLength: ACONTO_TEXT_MAX_LENGTH }}
								translateError={translateError}
							/>
						</div>

						<dl className="grid grid-cols-2 gap-4 rounded-lg bg-slate-100 p-3" aria-live="polite">
							<InfoField labelKey={localizationConstants.colInnehallet} value={formatCurrency(deduction(retained))} />
							<InfoField labelKey={localizationConstants.colAttErhalla} value={formatCurrency(amount - retained)} />
						</dl>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.btnAvbryt} />
							</Button>
							<Button type="submit" className="cursor-pointer bg-[#111721] text-white hover:bg-slate-800">
								<Translate text={aconto ? localizationConstants.btnSpara : localizationConstants.btnLaggTill} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default AcontoDialog;
