"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Form, FormDatePicker, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WARRANTY_NAME_MAX_LENGTH } from "../projectWarranty.config";
import type { WarrantyCommitment, WarrantyCommitmentInput } from "../types";
import { EMPTY_WARRANTY, warrantySchema, type WarrantyFormValues } from "./warrantySchema";

export interface WarrantyDialogProps {
	/** The commitment being changed; absent when creating one. */
	commitment?: WarrantyCommitment;
	onSave: (input: WarrantyCommitmentInput, id?: string) => void;
	onClose: () => void;
}

/**
 * "Skapa ny" and ⋮ Redigera: a commitment's day and name. The caller mounts it
 * only while open, so each opening starts from the row or an empty form.
 */
export function WarrantyDialog({ commitment, onSave, onClose }: WarrantyDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	const form = useForm<WarrantyFormValues>({
		resolver: zodResolver(warrantySchema) as Resolver<WarrantyFormValues>,
		defaultValues: commitment ? { date: commitment.date, name: commitment.name } : EMPTY_WARRANTY,
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		onSave(values, commitment?.id);
		onClose();
	});

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={commitment ? localizationConstants.projectWarrantyDialogEdit : localizationConstants.projectWarrantyDialogAdd} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-4">
						<FormDatePicker
							control={form.control}
							name="date"
							label={localizationConstants.projectWarrantyColDate}
							iconPosition="start"
							translateError={translateError}
						/>
						<FormInput
							control={form.control}
							name="name"
							label={localizationConstants.projectWarrantyColName}
							required
							inputProps={{ maxLength: WARRANTY_NAME_MAX_LENGTH, autoFocus: true }}
							translateError={translateError}
						/>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button type="submit" className="cursor-pointer bg-[#111721] text-white hover:bg-slate-800">
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
