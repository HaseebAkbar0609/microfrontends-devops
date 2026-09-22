"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";

import { Form, FormDatePicker, FormInput, FormSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PROTOCOL_NAME_MAX_LENGTH } from "../projectProtocol.config";
import type { ProjectProtocolInput } from "../types";
import { TYPE_OPTIONS } from "./protocolOptions";
import { emptyProtocolDraft, protocolSchema, type ProtocolFormValues } from "./protocolSchema";

export interface ProtocolDialogProps {
	/** Stores the protocol; `false` when the store refused it and the dialog should stay open. */
	onSave: (input: ProjectProtocolInput) => boolean;
	onClose: () => void;
}

/**
 * "Skapa protokoll – Action": Datum, Typ and Benämning. The Action protocol's
 * meeting form is not drawn yet, so it is created with no PDF; Standard has
 * Nytt möte and Ladda upp Nytt protokoll. The caller mounts it only while
 * open, so each opening starts empty; a double press never stores it twice.
 */
export function ProtocolDialog({ onSave, onClose }: ProtocolDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);
	const savedRef = useRef(false);

	const form = useForm<ProtocolFormValues>({
		resolver: zodResolver(protocolSchema) as Resolver<ProtocolFormValues>,
		defaultValues: emptyProtocolDraft(),
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		if (savedRef.current || !values.type) return;
		savedRef.current = true;
		const stored = onSave({ date: values.date, type: values.type, name: values.name });
		if (stored) onClose();
		else savedRef.current = false;
	});

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectProtocolDialogAction} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-4">
						<FormDatePicker
							control={form.control}
							name="date"
							label={localizationConstants.projectProtocolColDate}
							placeholder={localizationConstants.pickDatePlaceholder}
							iconPosition="start"
							required
							translateError={translateError}
						/>
						<FormSelect
							control={form.control}
							name="type"
							label={localizationConstants.projectProtocolColType}
							placeholder={localizationConstants.projectProtocolTypePlaceholder}
							options={TYPE_OPTIONS}
							required
							translateError={translateError}
						/>
						<FormInput
							control={form.control}
							name="name"
							label={localizationConstants.projectProtocolColName}
							required
							inputProps={{ maxLength: PROTOCOL_NAME_MAX_LENGTH }}
							translateError={translateError}
						/>

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

export default ProtocolDialog;
