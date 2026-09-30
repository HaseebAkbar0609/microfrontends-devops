"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import { fileRejection, type RecordFileRules } from "@/features/project/shared/recordFiles";
import { formatFileSize } from "@/utils/formatFileSize";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

/**
 * What the picker says. Each register names its own file in its own words, so
 * the wording travels with the rules rather than being guessed from them.
 */
export interface RecordFilePickerCopy {
	labelKey: TranslationKeys;
	chooseKey: TranslationKeys;
	/** The line under the row, until a refusal replaces it. */
	hintKey: TranslationKeys;
	/** Takes a `{{name}}`. */
	removeKey: TranslationKeys;
	sizeErrorKey: TranslationKeys;
	typeErrorKey: TranslationKeys;
}

export interface RecordFilePickerProps {
	file: File | null;
	/** The file that passed the rules, or `null` when the pick was refused or cleared. */
	onChange: (file: File | null) => void;
	/** Which rule the last pick broke, or the missing-file message after Spara. */
	error: TranslationKeys | null;
	onError: (error: TranslationKeys | null) => void;
	rules: RecordFileRules;
	/** `acceptAttribute(rules.types)`, which each register already keeps beside its rules. */
	accept: string;
	copy: RecordFilePickerCopy;
	/** Marks the field required; a register that allows none passes `false`. */
	required?: boolean;
}

/**
 * A dialog's file row: pick one, see it, remove it. A pick is checked against
 * the register's rules as it is made, so a file the store would refuse never
 * reaches Spara. The hint under the row gives way to the refusal.
 */
export function RecordFilePicker({
	file,
	onChange,
	error,
	onError,
	rules,
	accept,
	copy,
	required = true,
}: RecordFilePickerProps) {
	const t = useTranslate();
	const picker = useRef<HTMLInputElement>(null);

	const pick = (picked: File | undefined) => {
		/* Clearing the input lets the same file be picked again after a refusal. */
		if (picker.current) picker.current.value = "";
		if (!picked) return;

		const reason = fileRejection(picked, rules);
		if (reason) {
			onChange(null);
			onError(reason === "size" ? copy.sizeErrorKey : copy.typeErrorKey);
			return;
		}

		onChange(picked);
		onError(null);
	};

	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={copy.labelKey} />
				{required && (
					<span aria-hidden className="text-red-600">
						*
					</span>
				)}
			</Label>

			<input
				ref={picker}
				type="file"
				accept={accept}
				className="sr-only"
				tabIndex={-1}
				aria-hidden
				onChange={(event) => pick(event.target.files?.[0])}
			/>
			<Button
				type="button"
				variant="outline"
				onClick={() => picker.current?.click()}
				className="h-10 cursor-pointer justify-start gap-2 border-slate-200 font-normal text-slate-700"
			>
				<Upload className="h-4 w-4" aria-hidden />
				<Translate text={copy.chooseKey} />
			</Button>

			{file && (
				<div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
					<RecordFileIcon fileName={file.name} types={rules.types} />
					<span className="min-w-0 flex-1 truncate text-sm text-slate-900" title={file.name}>
						{file.name}
					</span>
					<span className="shrink-0 text-xs text-slate-500">{formatFileSize(file.size)}</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => {
							onChange(null);
							onError(null);
						}}
						aria-label={t(copy.removeKey, { name: file.name })}
						className="h-7 w-7 shrink-0 cursor-pointer text-slate-500 hover:text-slate-900"
					>
						<X className="h-4 w-4" aria-hidden />
					</Button>
				</div>
			)}

			<p className={error ? "text-xs text-red-600" : "text-xs text-slate-500"}>
				<Translate text={error ?? copy.hintKey} />
			</p>
		</div>
	);
}

export default RecordFilePicker;
