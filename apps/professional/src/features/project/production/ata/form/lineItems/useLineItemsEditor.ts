"use client";

import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { ATA_LINE_LIMITS, ATA_SECTION_CONFIG } from "../../projectAta.config";
import type { AtaLineItem, AtaSection } from "../../types";
import { blankDraft, lineItemDraftSchema, toDraft, toLineItem, type LineItemDraft } from "./lineItemSchema";

export interface RowsDraft {
	rows: LineItemDraft[];
}

/**
 * The Ändra dialog's own form: the section's rows as editable drafts. Nothing
 * reaches the ÄTA until the dialog's Spara, which validates every row and hands
 * the numbers back; Avbryt leaves the section as it was.
 */
export function useLineItemsEditor(
	section: AtaSection,
	items: AtaLineItem[],
	today: string,
	onApply: (section: AtaSection, items: AtaLineItem[]) => void,
) {
	const { kind } = ATA_SECTION_CONFIG[section];
	const [schema] = useState(() =>
		z.object({
			rows: z.array(lineItemDraftSchema(kind)).max(ATA_LINE_LIMITS.rows, localizationConstants.projectAtaTooManyRows),
		}),
	);
	const form = useForm<RowsDraft>({
		resolver: zodResolver(schema) as Resolver<RowsDraft>,
		defaultValues: { rows: items.map(toDraft) },
		mode: "onTouched",
	});
	/* `keyName` keeps the field array's own key off the row's stored `id`. */
	const { fields, append, remove: removeRow } = useFieldArray({ control: form.control, name: "rows", keyName: "key" });
	const addButtonRef = useRef<HTMLButtonElement>(null);

	const count = fields.length;

	const add = useCallback(() => {
		append(blankDraft(today), { shouldFocus: false });
		setTimeout(() => form.setFocus(`rows.${count}.party`), 0);
	}, [append, count, form, today]);

	/** Removes a row and moves focus to the row that takes its place, or to Lägg till rad. */
	const remove = useCallback(
		(index: number) => {
			const remaining = count - 1;
			removeRow(index);
			setTimeout(() => {
				if (remaining > 0) form.setFocus(`rows.${Math.min(index, remaining - 1)}.party`);
				else addButtonRef.current?.focus();
			}, 0);
		},
		[count, form, removeRow],
	);

	const apply = form.handleSubmit((values) => {
		onApply(section, values.rows.map((draft) => toLineItem(draft, kind)));
	});

	return {
		form,
		kind,
		fields,
		canAdd: count < ATA_LINE_LIMITS.rows,
		add,
		remove,
		apply,
		addButtonRef,
	};
}
