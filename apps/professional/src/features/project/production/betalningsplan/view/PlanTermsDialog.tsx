"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { PaymentTerms } from "../types";
import { termsSchema, type TermsFormValues } from "./acontoSchema";

export interface PlanTermsDialogProps {
	terms: PaymentTerms;
	onClose: () => void;
	onSave: (terms: PaymentTerms) => void;
}

const FIELDS: { name: keyof TermsFormValues; label: TranslationKeys }[] = [
	{ name: "contractSum", label: localizationConstants.lblKontraktsummaAlt },
	{ name: "retentionFixedAmount", label: localizationConstants.lblBelopp },
	{ name: "retentionPerAcontoPercent", label: localizationConstants.lblInnehallnaMedelPerAconto },
	{ name: "retentionTotalPercent", label: localizationConstants.lblTotaltInnehalletAvKontraktsumma },
];

/**
 * The Betalningsplan card's pencil: the contract sum and the retention terms.
 *
 * Saving recalculates every uninvoiced row, so the table and the summary follow
 * the new terms at once. Mounted only while open.
 */
export function PlanTermsDialog({ terms, onClose, onSave }: PlanTermsDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	const form = useForm<TermsFormValues>({
		resolver: zodResolver(termsSchema) as Resolver<TermsFormValues>,
		defaultValues: {
			contractSum: String(terms.contractSum),
			retentionPerAcontoPercent: String(terms.retentionPerAcontoPercent),
			retentionTotalPercent: String(terms.retentionTotalPercent),
			retentionFixedAmount: String(terms.retentionFixedAmount),
		},
		mode: "onTouched",
	});

	const submit = (values: TermsFormValues) =>
		onSave({
			contractSum: Number(values.contractSum),
			retentionPerAcontoPercent: Number(values.retentionPerAcontoPercent),
			retentionTotalPercent: Number(values.retentionTotalPercent),
			retentionFixedAmount: Number(values.retentionFixedAmount),
		});

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectPaymentPlanTermsTitle} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} noValidate className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{FIELDS.map((field) => (
								<FormInput
									key={field.name}
									control={form.control}
									name={field.name}
									label={field.label}
									required
									inputProps={{ inputMode: "numeric" }}
									translateError={translateError}
								/>
							))}
						</div>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.btnAvbryt} />
							</Button>
							<Button type="submit" className="cursor-pointer bg-[#111721] text-white hover:bg-slate-800">
								<Translate text={localizationConstants.btnSpara} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default PlanTermsDialog;
