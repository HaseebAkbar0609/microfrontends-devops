"use client";

import { Trash2 } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { FormDatePicker, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { lineFigures, parseQuantity, parseWholeKronor } from "../../ataMath";
import { ATA_LINE_COLUMN_LABELS, ATA_LINE_LIMITS, ATA_PARTY_LABELS, type AtaSectionKind } from "../../projectAta.config";
import type { RowsDraft } from "./useLineItemsEditor";

export interface AtaLineItemFieldsetProps {
	control: Control<RowsDraft>;
	index: number;
	kind: AtaSectionKind;
	translateError: (message: string) => string;
	onRemove: (index: number) => void;
}

/** The row's derived figures, once its numbers parse; otherwise nothing to show yet. */
function RowPreview({ control, index }: { control: Control<RowsDraft>; index: number }) {
	const row = useWatch({ control, name: `rows.${index}` });
	const quantity = parseQuantity(row?.quantity ?? "");
	const netPrice = parseWholeKronor(row?.netPrice ?? "");
	const markup = Number(row?.markupPercent);
	const figures =
		quantity !== null && netPrice !== null && Number.isInteger(markup)
			? lineFigures({ quantity, netPrice, markupPercent: markup })
			: null;

	const items = [
		[localizationConstants.createAtaColNetSum, figures?.netSum],
		[localizationConstants.createAtaColAmount, figures?.amount],
		[localizationConstants.viewAtaColPricePerUnit, figures?.unitPrice],
	] as const;

	return (
		<dl className="grid grid-cols-3 gap-3 rounded-md bg-slate-50 px-3 py-2 sm:col-span-2 lg:col-span-4">
			{items.map(([labelKey, value]) => (
				<div key={labelKey}>
					<dt className="text-xs text-slate-500">
						<Translate text={labelKey} />
					</dt>
					<dd className="text-sm font-medium text-slate-900 tabular-nums">
						{value === undefined ? <span aria-hidden>—</span> : formatCurrency(value)}
					</dd>
				</div>
			))}
		</dl>
	);
}

/**
 * One row in the Ändra dialog, as a fieldset: the drawn columns as fields (Fakt.nr
 * only for supplier sections), with Nettosumma, Belopp and A-pris/enhet worked
 * out as the reader types.
 */
export function AtaLineItemFieldset({ control, index, kind, translateError, onRemove }: AtaLineItemFieldsetProps) {
	const t = useTranslate();
	const number = index + 1;
	const L = ATA_LINE_LIMITS;

	return (
		<fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
			<legend className="flex w-full items-center justify-between px-1 text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.projectAtaRowLegend} values={{ number }} />
			</legend>
			<FormDatePicker control={control} name={`rows.${index}.date`} label={ATA_LINE_COLUMN_LABELS.date} placeholder={localizationConstants.pickDatePlaceholder} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.party`} label={ATA_PARTY_LABELS[kind]} required inputProps={{ maxLength: L.shortText }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.resourceNo`} label={ATA_LINE_COLUMN_LABELS.resourceNo} inputProps={{ maxLength: L.resourceNo }} translateError={translateError} />
			{kind === "supplier" && (
				<FormInput control={control} name={`rows.${index}.invoiceNo`} label={ATA_LINE_COLUMN_LABELS.invoiceNo} inputProps={{ maxLength: L.invoiceNo }} translateError={translateError} />
			)}
			<FormInput control={control} name={`rows.${index}.quantity`} label={ATA_LINE_COLUMN_LABELS.quantity} required inputProps={{ inputMode: "decimal", maxLength: 9 }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.unit`} label={ATA_LINE_COLUMN_LABELS.unit} inputProps={{ maxLength: L.unit }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.netPrice`} label={ATA_LINE_COLUMN_LABELS.netPrice} required inputProps={{ inputMode: "numeric", maxLength: 13 }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.markupPercent`} label={ATA_LINE_COLUMN_LABELS.markup} required inputProps={{ inputMode: "numeric", maxLength: 3 }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.secondaryPercent`} label={ATA_LINE_COLUMN_LABELS.secondary} inputProps={{ inputMode: "numeric", maxLength: 3 }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.activity`} label={ATA_LINE_COLUMN_LABELS.activity} inputProps={{ maxLength: L.shortText }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.location`} label={ATA_LINE_COLUMN_LABELS.location} inputProps={{ maxLength: L.shortText }} translateError={translateError} />
			<FormInput control={control} name={`rows.${index}.description`} label={ATA_LINE_COLUMN_LABELS.description} className="sm:col-span-2" inputProps={{ maxLength: L.description }} translateError={translateError} />
			<RowPreview control={control} index={index} />
			<div className="flex justify-end sm:col-span-2 lg:col-span-4">
				<Button
					type="button"
					variant="ghost"
					onClick={() => onRemove(index)}
					className="h-9 cursor-pointer gap-2 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
				>
					<Trash2 className="h-4 w-4" aria-hidden />
					{t(localizationConstants.projectAtaRemoveRow, { number })}
				</Button>
			</div>
		</fieldset>
	);
}

export default AtaLineItemFieldset;
