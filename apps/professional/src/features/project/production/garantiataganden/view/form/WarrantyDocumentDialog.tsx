"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm, type Resolver, type UseFormReturn } from "react-hook-form";

import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RecordFileField, type RecordFileFieldValues } from "../../../components/RecordFileField";
import { WARRANTY_FILE_ACCEPT, WARRANTY_FILE_RULES, WARRANTY_NAME_MAX_LENGTH } from "../../projectWarranty.config";
import type { WarrantyDocument, WarrantyDocumentInput } from "../../types";
import { emptyWarrantyDocument, warrantyDocumentSchema, type WarrantyDocumentValues } from "./warrantyDocumentSchema";

export interface WarrantyDocumentDialogProps {
	/** The document being renamed; absent when adding one. */
	document?: WarrantyDocument;
	/** Stores the document; `false` when the store refused it and the dialog should stay open. */
	onAdd: (input: WarrantyDocumentInput) => boolean;
	onRename: (documentId: string, name: string) => boolean;
	onClose: () => void;
}

/**
 * "Lägg till": a Benämning and the file. ⋮ Redigera reopens it on the name
 * alone — the stored file stays as it is, since there is nowhere to put a
 * replaced one. The caller mounts it only while open, so each opening starts
 * from the document or an empty form. A double press never stores it twice.
 */
export function WarrantyDocumentDialog({ document, onAdd, onRename, onClose }: WarrantyDocumentDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);
	const savedRef = useRef(false);

	const form = useForm<WarrantyDocumentValues>({
		resolver: zodResolver(warrantyDocumentSchema) as Resolver<WarrantyDocumentValues>,
		defaultValues: emptyWarrantyDocument(document),
		mode: "onTouched",
	});

	const submit = form.handleSubmit((values) => {
		if (savedRef.current) return;
		savedRef.current = true;
		const stored = document ? onRename(document.id, values.name) : values.file ? onAdd({ name: values.name, file: values.file }) : false;
		if (stored) onClose();
		else savedRef.current = false;
	});

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate
							text={document ? localizationConstants.projectWarrantyDocumentDialogEdit : localizationConstants.projectWarrantyDocumentDialogAdd}
						/>
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

						{!document && (
							/* This form carries the field's three names plus `withFile`, which
							   react-hook-form's types cannot express as "at least these". */
							<RecordFileField
								form={form as unknown as UseFormReturn<RecordFileFieldValues>}
								labelKey={localizationConstants.projectWarrantyColDocument}
								hintKey={localizationConstants.projectWarrantyAllowedFiles}
								typeErrorKey={localizationConstants.projectWarrantyFileTypeError}
								sizeErrorKey={localizationConstants.projectWarrantyFileSizeError}
								uploadKey={localizationConstants.projectWarrantyUploadButton}
								removeKey={localizationConstants.projectWarrantyRemoveFile}
								rules={WARRANTY_FILE_RULES}
								accept={WARRANTY_FILE_ACCEPT}
								nameMaxLength={WARRANTY_NAME_MAX_LENGTH}
							/>
						)}

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

export default WarrantyDocumentDialog;
