"use client";

import { Save } from "lucide-react";

import { Form, FormInput, FormSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DOCUMENT_KIND_META,
	DOCUMENT_NAME_MAX_LENGTH,
	DRAWING_CATEGORIES,
	DRAWING_CATEGORY_LABELS,
	DRAWING_NUMBER_MAX_LENGTH,
} from "../projectDocuments.config";
import type { ProjectDocumentInput, ProjectDocumentKind } from "../types";
import { DocumentFileField } from "./DocumentFileField";
import { useDocumentUploadForm } from "./useDocumentUploadForm";

/** Module constant: the categories, labelled in the reader's language when rendered. */
const CATEGORY_OPTIONS = DRAWING_CATEGORIES.map((value) => ({
	value,
	label: <Translate text={DRAWING_CATEGORY_LABELS[value]} />,
}));

export interface DocumentUploadDialogProps {
	kind: ProjectDocumentKind;
	onUpload: (input: ProjectDocumentInput) => boolean;
	onClose: () => void;
}

/**
 * "Ladda upp handling": Benämning and the file, then Spara. On Ritningar it
 * asks for the Ritningsnummer and Kategori instead — the frame draws only the
 * handling, and a drawing's table needs both. The caller mounts it only while
 * open, so each opening starts from an empty form.
 */
export function DocumentUploadDialog({ kind, onUpload, onClose }: DocumentUploadDialogProps) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);
	const { form, submit } = useDocumentUploadForm({ kind, onUpload, onClose });
	const drawing = kind === "ritning";

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={DOCUMENT_KIND_META[kind].uploadKey} />
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-4">
						<FormInput
							control={form.control}
							name="name"
							label={drawing ? localizationConstants.projectDocumentsColDrawingNumber : localizationConstants.projectDocumentsColName}
							required
							inputProps={{ maxLength: drawing ? DRAWING_NUMBER_MAX_LENGTH : DOCUMENT_NAME_MAX_LENGTH, autoFocus: true }}
							translateError={translateError}
						/>

						{drawing && (
							<FormSelect
								control={form.control}
								name="category"
								label={localizationConstants.projectDocumentsColCategory}
								placeholder={localizationConstants.projectDocumentsCategoryPlaceholder}
								options={CATEGORY_OPTIONS}
								translateError={translateError}
							/>
						)}

						<DocumentFileField form={form} />

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

export default DocumentUploadDialog;
