"use client";

import { Save } from "lucide-react";

import { Form, FormDatePicker, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WARRANTY_NAME_MAX_LENGTH } from "../projectWarranty.config";
import type { WarrantyCommitment, WarrantyCommitmentInput } from "../types";
import { ReminderEmailFields } from "./ReminderEmailFields";
import { useWarrantyForm } from "./useWarrantyForm";
import { WarrantyDocumentsField } from "./WarrantyDocumentsField";

export interface WarrantyDialogProps {
	/** The commitment being changed; absent when creating one. */
	commitment?: WarrantyCommitment;
	/** Stores it; `false` when the store refused it and the dialog should stay open. */
	onSave: (input: WarrantyCommitmentInput, id?: string) => boolean;
	onClose: () => void;
}

/**
 * "Skapa ny" and ⋮ Redigera — the frame's five fields: the commitment's name
 * and day, the addresses its reminder goes to, the day it goes out, and the
 * files hung on it. The caller mounts it only while open, so each opening
 * starts from the row or an empty form.
 *
 * Only Datum is starred in the frame; Benämning is required too, because it is
 * the list's own column. The fields the frame does not draw —
 * Garantiansvarig, Godkänd, Garantitid and Kontaktperson — are left as they
 * were by a save.
 */
export function WarrantyDialog({ commitment, onSave, onClose }: WarrantyDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);
	const { form, emailArray, submit } = useWarrantyForm({ commitment, onSave, onClose });

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={commitment ? localizationConstants.projectWarrantyDialogEdit : localizationConstants.projectWarrantyDialogAdd} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-4">
						<FormInput
							control={form.control}
							name="name"
							label={localizationConstants.projectWarrantyColName}
							required
							inputProps={{ maxLength: WARRANTY_NAME_MAX_LENGTH, autoFocus: true }}
							translateError={translateError}
						/>
						<FormDatePicker
							control={form.control}
							name="date"
							label={localizationConstants.projectWarrantyColDate}
							iconPosition="start"
							required
							translateError={translateError}
						/>

						<ReminderEmailFields
							control={form.control}
							fields={emailArray.fields}
							onAppend={() => emailArray.append({ value: "" })}
							onRemove={emailArray.remove}
							translateError={translateError}
						/>

						<FormDatePicker
							control={form.control}
							name="reminderDate"
							label={localizationConstants.reminderRuleLabel}
							iconPosition="start"
							translateError={translateError}
						/>

						<WarrantyDocumentsField control={form.control} translateError={translateError} />

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.buttonClose} />
							</Button>
							<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
								<Save className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.buttonSave} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default WarrantyDialog;
