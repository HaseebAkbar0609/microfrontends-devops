"use client";

import { Plus } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { lineFigures, parseQuantity, parseWholeKronor } from "../../ataMath";
import { ATA_LINE_LIMITS, ATA_SECTION_CONFIG } from "../../projectAta.config";
import type { AtaLineItem, AtaSection } from "../../types";
import { AtaLineItemFieldset } from "./AtaLineItemFieldset";
import { useLineItemsEditor, type RowsDraft } from "./useLineItemsEditor";

/** Σ Belopp of the rows whose numbers already parse — the dialog's one live region. */
function DraftTotal({ control }: { control: Control<RowsDraft> }) {
	const rows = useWatch({ control, name: "rows" }) ?? [];
	const total = rows.reduce((sum, row) => {
		const quantity = parseQuantity(row.quantity);
		const netPrice = parseWholeKronor(row.netPrice);
		const markup = Number(row.markupPercent);
		if (quantity === null || netPrice === null || !Number.isInteger(markup)) return sum;
		return sum + lineFigures({ quantity, netPrice, markupPercent: markup }).amount;
	}, 0);

	return (
		<p aria-live="polite" className="text-sm text-slate-700">
			<Translate text={localizationConstants.createAtaColAmount} />{" "}
			<span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(total)}</span>
		</p>
	);
}

export interface AtaLineItemsDialogProps {
	section: AtaSection;
	items: AtaLineItem[];
	/** A new row's date, read in the click that opened the dialog. */
	today: string;
	onApply: (section: AtaSection, items: AtaLineItem[]) => void;
	onClose: () => void;
}

/**
 * Ändra: add, edit and remove one section's rows. Rendered outside the page's
 * `<form>` — a portal still bubbles React's submit event — and its own submit
 * stops there. Mounted only while open, so each opening starts from the
 * section's rows.
 */
export function AtaLineItemsDialog({ section, items, today, onApply, onClose }: AtaLineItemsDialogProps) {
	const t = useTranslate();
	const editor = useLineItemsEditor(section, items, today, onApply);
	const { titleKey } = ATA_SECTION_CONFIG[section];
	const translateError = (message: string) => t(message as TranslationKeys, { max: ATA_LINE_LIMITS.rows });

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="flex max-h-[90dvh] w-[calc(100vw-2rem)] flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						{t(localizationConstants.projectAtaEditRowsTitle, { section: t(titleKey) })}
					</DialogTitle>
					<DialogDescription className="text-sm text-slate-500">
						<Translate text={localizationConstants.projectAtaFormulaHint} />
					</DialogDescription>
				</DialogHeader>

				<Form {...editor.form}>
					<form
						noValidate
						onSubmit={(event) => {
							event.stopPropagation();
							void editor.apply(event);
						}}
						className="flex min-h-0 flex-1 flex-col gap-4"
					>
						<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
							{editor.fields.length === 0 && (
								<p className="py-6 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.viewAtaNoLineItems} />
								</p>
							)}
							{editor.fields.map((row, index) => (
								<AtaLineItemFieldset
									key={row.key}
									control={editor.form.control}
									index={index}
									kind={editor.kind}
									translateError={translateError}
									onRemove={editor.remove}
								/>
							))}
						</div>

						<div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
							<Button
								ref={editor.addButtonRef}
								type="button"
								variant="outline"
								onClick={editor.add}
								disabled={!editor.canAdd}
								className="h-10 cursor-pointer gap-2 border-slate-200"
							>
								<Plus className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.viewAtaAddRow} />
							</Button>
							<DraftTotal control={editor.form.control} />
						</div>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="h-10 cursor-pointer border-slate-200 px-6">
								<Translate text={localizationConstants.createAtaBtnCancel} />
							</Button>
							<Button type="submit" className="h-10 cursor-pointer bg-[#111721] px-6 text-white hover:bg-slate-800">
								<Translate text={localizationConstants.createAtaBtnSave} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default AtaLineItemsDialog;
