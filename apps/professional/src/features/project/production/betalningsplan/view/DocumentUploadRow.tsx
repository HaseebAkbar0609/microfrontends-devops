"use client";

import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { checkUploadedFile } from "@/lib/validation/fileUpload";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DOCUMENT_FILE_EXTENSIONS, PAYMENT_PLAN_FILE_MAX_BYTES } from "../paymentPlan.config";

/**
 * "Ladda upp dina filer": pick a file, then "Lägg till".
 *
 * The file is checked by extension and size here — `accept` only filters the
 * OS dialog, and a drag-and-drop or a renamed file walks past it. With no upload
 * endpoint only the name is handed on; the file itself is never read or kept.
 */
export function DocumentUploadRow({ onAdd }: { onAdd: (fileName: string) => void }) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<TranslationKeys | null>(null);

	const clear = () => {
		setFile(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	const pick = (picked: File | null) => {
		if (!picked) return clear();
		const reason = checkUploadedFile(picked, {
			acceptExtensions: DOCUMENT_FILE_EXTENSIONS,
			maxFileSizeBytes: PAYMENT_PLAN_FILE_MAX_BYTES,
		});
		if (reason) {
			setError(
				reason === "size"
					? localizationConstants.projectPaymentPlanFileTooLarge
					: localizationConstants.projectPaymentPlanFileTypeInvalid,
			);
			return clear();
		}
		setError(null);
		setFile(picked);
	};

	const add = () => {
		if (!file) {
			setError(localizationConstants.projectPaymentPlanFileRequired);
			return;
		}
		onAdd(file.name);
		clear();
	};

	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={inputId} className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.lblLaddaUppDinaFiler} />
			</label>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* The native control prints "No file chosen" in the browser's own
				    language whatever the app's is, so it stays visually hidden and
				    this button speaks for it in the app's language. */}
				<input
					ref={inputRef}
					id={inputId}
					type="file"
					accept={DOCUMENT_FILE_EXTENSIONS.join(",")}
					aria-invalid={Boolean(error)}
					aria-describedby={`${inputId}-help`}
					onChange={(event) => pick(event.target.files?.[0] ?? null)}
					className="sr-only"
				/>
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-left text-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
				>
					<span className="shrink-0 font-medium text-slate-900">
						<Translate text={localizationConstants.btnLaddaUpp} />
					</span>
					<span className="truncate text-slate-700">
						{file ? file.name : <Translate text={localizationConstants.noFileChosen} />}
					</span>
				</button>
				<Button
					type="button"
					onClick={add}
					className="h-10 cursor-pointer bg-[#111721] px-5 text-sm font-medium text-white hover:bg-slate-800"
				>
					<Translate text={localizationConstants.btnLaggTill} />
				</Button>
			</div>
			<p id={`${inputId}-help`} className={error ? "text-sm text-red-600" : "text-sm text-slate-500"}>
				<Translate text={error ?? localizationConstants.lblAllowedFileFormats} />
			</p>
		</div>
	);
}

export default DocumentUploadRow;
