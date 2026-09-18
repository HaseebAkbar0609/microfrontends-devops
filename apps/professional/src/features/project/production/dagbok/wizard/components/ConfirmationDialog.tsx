"use client";

import { useEffect } from "react";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { Form, FormInput, FormSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { DIARY_LIMITS, DIARY_SIGNER_LABELS, DIARY_SIGNER_ROLES } from "../../projectDiary.config";
import type { DiarySignerRole } from "../../types";
import { confirmationSchema, emptyConfirmation, type ConfirmationValues } from "../confirmationSchema";
import { SignatureUploadField } from "./SignatureUploadField";

const ROLE_OPTIONS = DIARY_SIGNER_ROLES.map((value) => ({ value, label: <Translate text={DIARY_SIGNER_LABELS[value]} /> }));

export interface ConfirmationDialogProps {
	/** Each role's name on this project, which fills Förtydligande. */
	signers: Record<DiarySignerRole, string>;
	/** Stores the diary and signs it; `false` keeps the modal open. */
	onSave: (values: ConfirmationValues) => boolean;
	onClose: () => void;
}

/**
 * "Bekräftelse": who signs, the name that goes on the line, and the signature
 * file. Spara creates the day's diary as a draft and signs it — it is published
 * later, from the diary itself.
 */
export function ConfirmationDialog({ signers, onSave, onClose }: ConfirmationDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);

	const form = useForm<ConfirmationValues>({
		resolver: zodResolver(confirmationSchema) as Resolver<ConfirmationValues>,
		defaultValues: emptyConfirmation("bestallare", signers.bestallare),
		mode: "onTouched",
	});
	const role = useWatch({ control: form.control, name: "role" });

	/* Förtydligande follows the role until the reader types their own. */
	useEffect(() => {
		if (!form.getFieldState("clarification").isDirty) form.setValue("clarification", signers[role]);
	}, [role, signers, form]);

	const submit = form.handleSubmit((values) => {
		if (onSave(values)) onClose();
	});

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectDiaryConfirmTitle} />
					</DialogTitle>
					<DialogDescription>
						<Translate text={localizationConstants.projectDiaryConfirmDesc} />
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-4"
						onSubmit={(event) => {
							event.stopPropagation();
							void submit(event);
						}}
					>
						<FormSelect
							control={form.control}
							name="role"
							label={localizationConstants.projectDiaryRole}
							options={ROLE_OPTIONS}
							translateError={translateError}
						/>
						<FormInput
							control={form.control}
							name="clarification"
							label={localizationConstants.projectDiaryClarification}
							required
							inputProps={{ maxLength: DIARY_LIMITS.text }}
							translateError={translateError}
						/>
						<SignatureUploadField form={form} />

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.cancel} />
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

export default ConfirmationDialog;
