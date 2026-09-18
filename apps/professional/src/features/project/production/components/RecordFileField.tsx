"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { baseNameOf, fileRejection, type RecordFileRules } from "../../shared/recordFiles";
import { RecordFileIcon } from "./RecordFileIcon";

/**
 * The three fields this writes. A form using it declares them under these
 * names: `file` is what "Ladda upp" attached, `pendingFile` what the picker
 * holds but has not attached — which the schema refuses rather than dropping
 * silently — and `name` the Benämning it fills from the file.
 */
export interface RecordFileFieldValues {
	name: string;
	file: File | null;
	pendingFile: File | null;
}

export interface RecordFileFieldProps {
	/**
	 * The dialog's form. A form with more fields than these three passes
	 * `form as unknown as UseFormReturn<RecordFileFieldValues>`: react-hook-form
	 * cannot express "a form that at least has these", and the three names are
	 * the contract.
	 */
	form: UseFormReturn<RecordFileFieldValues>;
	/** The row's own label — "Fil", "Ritning", "Dokument". */
	labelKey: TranslationKeys;
	/** The hint under the row, shown until a rule is broken. */
	hintKey: TranslationKeys;
	typeErrorKey: TranslationKeys;
	sizeErrorKey: TranslationKeys;
	/** "Ladda upp", on the picker and the button that attaches. */
	uploadKey: TranslationKeys;
	/** Takes `{ name }` — the attached file's, for the ✕. */
	removeKey: TranslationKeys;
	rules: RecordFileRules;
	/** The picker's advisory `accept`, from `acceptAttribute(rules.types)`. */
	accept: string;
	/** Cuts the name filled from the file to what the section's Benämning allows. */
	nameMaxLength: number;
}

/**
 * A dialog's file row, as the frames draw it: a picker showing the chosen
 * file's name, then "Ladda upp", which attaches it. A pick is checked for type
 * and size straight away. The attached file shows underneath and can be
 * removed; attaching another replaces it. Attaching fills an empty name from
 * the file's, which the reader can still change.
 *
 * Shared by the record's sections that upload a single file (Handlingar,
 * Garantiåtaganden), which differ only in their labels, rules and limits.
 */
export function RecordFileField({
	form,
	labelKey,
	hintKey,
	typeErrorKey,
	sizeErrorKey,
	uploadKey,
	removeKey,
	rules,
	accept,
	nameMaxLength,
}: RecordFileFieldProps) {
	const t = useTranslate();
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const pickerRef = useRef<HTMLButtonElement>(null);
	const [pickError, setPickError] = useState<TranslationKeys | null>(null);
	const [pending, file] = useWatch({ control: form.control, name: ["pendingFile", "file"] });
	const validate = form.formState.isSubmitted;

	const pick = (picked: File | undefined) => {
		if (!picked) return;
		const refused = fileRejection(picked, rules);
		setPickError(refused ? (refused === "size" ? sizeErrorKey : typeErrorKey) : null);
		form.setValue("pendingFile", refused ? null : picked);
		/* The pick changes what the file row's message should say, which lives on `file`. */
		if (validate) void form.trigger("file");
	};

	const attach = () => {
		if (!pending) return;
		if (!form.getValues("name").trim()) {
			form.setValue("name", baseNameOf(pending.name).slice(0, nameMaxLength), { shouldValidate: validate });
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
							<Translate text={labelKey} />
						</span>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
							<input
								ref={inputRef}
								type="file"
								accept={accept}
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
									<Translate text={uploadKey} />
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
								<Translate text={uploadKey} />
							</Button>
						</div>
						{file && (
							<div className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
								<RecordFileIcon fileName={file.name} types={rules.types} />
								<span className="min-w-0 flex-1 truncate text-sm text-slate-900">{file.name}</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={detach}
									aria-label={t(removeKey, { name: file.name })}
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
							<Translate text={message ?? hintKey} />
						</p>
					</div>
				);
			}}
		/>
	);
}

export default RecordFileField;
