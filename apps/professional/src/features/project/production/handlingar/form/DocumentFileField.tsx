"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { baseNameOf, fileRejection } from "../../../shared/recordFiles";
import { RecordFileIcon } from "../../components/RecordFileIcon";
import {
	DOCUMENT_FILE_ACCEPT,
	DOCUMENT_FILE_RULES,
	DOCUMENT_KIND_META,
	DOCUMENT_NAME_MAX_LENGTH,
	DRAWING_NUMBER_MAX_LENGTH,
} from "../projectDocuments.config";
import type { DocumentUploadValues } from "./documentUploadSchema";

/**
 * The dialog's file row, as the frame draws it: a picker showing the chosen
 * file's name, then "Ladda upp", which attaches it. A pick is checked for type
 * and size straight away. The attached file shows underneath and can be
 * removed; attaching another replaces it. Attaching fills an empty name from
 * the file's, which the reader can still change.
 */
export function DocumentFileField({ form }: { form: UseFormReturn<DocumentUploadValues> }) {
	const t = useTranslate();
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const pickerRef = useRef<HTMLButtonElement>(null);
	const [pickError, setPickError] = useState<TranslationKeys | null>(null);
	const [kind, pending, file] = useWatch({ control: form.control, name: ["kind", "pendingFile", "file"] });
	const validate = form.formState.isSubmitted;

	const pick = (picked: File | undefined) => {
		if (!picked) return;
		const refused = fileRejection(picked, DOCUMENT_FILE_RULES);
		setPickError(refused ? (refused === "size" ? localizationConstants.projectDocumentsFileSizeError : localizationConstants.projectDocumentsFileTypeError) : null);
		form.setValue("pendingFile", refused ? null : picked);
		/* The pick changes what the file row's message should say, which lives on `file`. */
		if (validate) void form.trigger("file");
	};

	const attach = () => {
		if (!pending) return;
		if (!form.getValues("name").trim()) {
			const maxLength = kind === "ritning" ? DRAWING_NUMBER_MAX_LENGTH : DOCUMENT_NAME_MAX_LENGTH;
			form.setValue("name", baseNameOf(pending.name).slice(0, maxLength), { shouldValidate: validate });
		}
		form.setValue("pendingFile", null);
		form.setValue("file", pending, { shouldDirty: true, shouldValidate: true });
	};

	const detach = () => {
		form.setValue("file", null, { shouldDirty: true, shouldValidate: validate });
		pickerRef.current?.focus();
	};

	return (
		<FormField
			control={form.control}
			name="file"
			render={({ field, fieldState }) => {
				const message = pickError ?? (fieldState.error?.message as TranslationKeys | undefined);
				return (
					<div className="grid gap-2">
						<span id={`${id}-label`} className="text-sm font-medium text-slate-900">
							<Translate text={DOCUMENT_KIND_META[kind].fileLabelKey} />
						</span>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
							<input
								ref={inputRef}
								type="file"
								accept={DOCUMENT_FILE_ACCEPT}
								tabIndex={-1}
								className="hidden"
								onChange={(event) => {
									pick(event.target.files?.[0]);
									/* Reset, so picking the same file again still fires a change. */
									event.target.value = "";
								}}
							/>
							{/* The native control prints "No file chosen" in the browser's own
							    language, so it stays hidden and this button speaks for it. */}
							<button
								ref={(node) => {
									pickerRef.current = node;
									if (!pending) field.ref(node);
								}}
								type="button"
								onClick={() => inputRef.current?.click()}
								aria-labelledby={`${id}-label ${id}-choose ${id}-value`}
								aria-describedby={`${id}-help`}
								className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-left text-sm hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:outline-none"
							>
								<span id={`${id}-choose`} className="shrink-0 font-medium text-slate-900">
									<Translate text={localizationConstants.projectDocumentsUploadButton} />
								</span>
								<span id={`${id}-value`} className="truncate text-slate-500">
									{pending ? pending.name : t(localizationConstants.noFileChosen)}
								</span>
							</button>
							<Button
								ref={pending ? field.ref : undefined}
								type="button"
								onClick={attach}
								disabled={!pending}
								className="h-10 cursor-pointer bg-[#111721] px-5 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:opacity-100"
							>
								<Translate text={localizationConstants.projectDocumentsUploadButton} />
							</Button>
						</div>
						{file && (
							<div className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
								<RecordFileIcon fileName={file.name} types={DOCUMENT_FILE_RULES.types} />
								<span className="min-w-0 flex-1 truncate text-sm text-slate-900">{file.name}</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={detach}
									aria-label={t(localizationConstants.projectDocumentsRemoveFile, { name: file.name })}
									className="h-8 w-8 cursor-pointer text-slate-500 hover:text-slate-900"
								>
									<X className="h-4 w-4" aria-hidden />
								</Button>
							</div>
						)}
						<p
							id={`${id}-help`}
							role={message ? "alert" : undefined}
							className={message ? "text-sm text-red-600" : "text-sm text-slate-500"}
						>
							<Translate text={message ?? localizationConstants.projectDocumentsAllowedFiles} />
						</p>
					</div>
				);
			}}
		/>
	);
}

export default DocumentFileField;
