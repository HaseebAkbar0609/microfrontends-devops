"use client";

import { useId, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { fileRejection } from "../../../../shared/recordFiles";
import { SIGNATURE_FILE_ACCEPT, SIGNATURE_FILE_RULES } from "../../projectDiary.config";
import type { ConfirmationValues } from "../confirmationSchema";

/**
 * "Underskrift": the file row the Bekräftelse modal draws — a box naming the
 * chosen file and a "Ladda upp" button that picks it. The file is checked as it
 * is picked and again by the schema.
 *
 * Only the name is kept: there is no file store behind this, so the signature
 * cannot be opened again later.
 */
export function SignatureUploadField({ form }: { form: UseFormReturn<ConfirmationValues> }) {
	const t = useTranslate();
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [pickError, setPickError] = useState<TranslationKeys | null>(null);

	const pick = (picked: File | undefined) => {
		if (!picked) return;
		const refused = fileRejection(picked, SIGNATURE_FILE_RULES);
		setPickError(
			refused ? (refused === "size" ? localizationConstants.projectDiaryFileSizeError : localizationConstants.projectDiaryFileTypeError) : null,
		);
		form.setValue("file", refused ? null : picked, { shouldValidate: form.formState.isSubmitted });
	};

	return (
		<FormField
			control={form.control}
			name="file"
			render={({ field, fieldState }) => {
				const file = field.value;
				const message = pickError ?? (fieldState.error?.message as TranslationKeys | undefined);

				return (
					<div className="grid gap-2">
						<span id={`${id}-label`} className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.projectDiarySignature} />
						</span>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
							{/* The native control names itself in the browser's language, so it stays hidden. */}
							<input
								ref={inputRef}
								type="file"
								accept={SIGNATURE_FILE_ACCEPT}
								tabIndex={-1}
								className="hidden"
								onChange={(event) => {
									pick(event.target.files?.[0]);
									/* Reset, so picking the same file again still fires a change. */
									event.target.value = "";
								}}
							/>
							<p
								id={`${id}-value`}
								className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm"
							>
								<span className="truncate text-slate-700">{file ? file.name : t(localizationConstants.noFileChosen)}</span>
								{file && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => {
											setPickError(null);
											form.setValue("file", null, { shouldValidate: form.formState.isSubmitted });
										}}
										aria-label={t(localizationConstants.projectDiaryRemoveFile, { name: file.name })}
										className="ml-auto h-7 w-7 shrink-0 cursor-pointer text-slate-500 hover:text-slate-900"
									>
										<X className="h-4 w-4" aria-hidden />
									</Button>
								)}
							</p>
							<Button
								ref={field.ref}
								type="button"
								variant="secondary"
								onClick={() => inputRef.current?.click()}
								aria-labelledby={`${id}-label ${id}-button`}
								aria-describedby={`${id}-help`}
								className="h-10 cursor-pointer gap-2 bg-slate-100 px-5 text-sm font-medium text-slate-900 hover:bg-slate-200"
							>
								<Upload className="h-4 w-4" aria-hidden />
								<span id={`${id}-button`}>
									<Translate text={localizationConstants.projectDiaryUploadButton} />
								</span>
							</Button>
						</div>
						<p id={`${id}-help`} role={message ? "alert" : undefined} className={message ? "text-sm text-red-600" : "text-sm text-slate-500"}>
							<Translate text={message ?? localizationConstants.projectDiaryAllowedFiles} />
						</p>
					</div>
				);
			}}
		/>
	);
}

export default SignatureUploadField;
