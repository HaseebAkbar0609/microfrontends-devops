"use client";

import { useId, useRef } from "react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ATA_FILE_ACCEPT, ATA_FILE_RULES } from "../../projectAta.config";
import type { AtaDocumentsState } from "./useAtaDocuments";

export interface AtaUploadRowProps {
	documents: AtaDocumentsState;
	disabled: boolean;
}

/**
 * "Ladda upp dina filer": pick files, then "Ladda upp" attaches them to the
 * table. Each file is checked as it is picked and the first refusal is shown
 * inline, naming the file.
 */
export function AtaUploadRow({ documents, disabled }: AtaUploadRowProps) {
	const t = useTranslate();
	const inputRef = useRef<HTMLInputElement>(null);
	const id = useId();
	const { pending, message } = documents;

	return (
		<div className="grid gap-1">
			<span id={`${id}-label`} className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.createAtaUploadYourFiles} />
			</span>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
				<input
					ref={inputRef}
					type="file"
					multiple
					accept={ATA_FILE_ACCEPT}
					tabIndex={-1}
					className="hidden"
					onChange={(event) => {
						documents.pick(Array.from(event.target.files ?? []));
						/* Reset, so picking the same file again still fires a change. */
						event.target.value = "";
					}}
				/>
				<button
					type="button"
					disabled={disabled}
					onClick={() => inputRef.current?.click()}
					aria-labelledby={`${id}-label ${id}-choose ${id}-value`}
					className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-left text-sm hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
				>
					<span id={`${id}-choose`} className="shrink-0 font-medium text-slate-900">
						<Translate text={localizationConstants.projectAtaChooseFiles} />
					</span>
					<span id={`${id}-value`} className="truncate text-slate-500">
						{pending.length > 0 ? pending.map((file) => file.name).join(", ") : t(localizationConstants.noFileChosen)}
					</span>
				</button>
				<Button
					type="button"
					onClick={documents.upload}
					disabled={disabled}
					className="h-10 cursor-pointer bg-slate-100 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-slate-200"
				>
					<Translate text={localizationConstants.createAtaUploadBtn} />
				</Button>
			</div>
			<p className="text-sm text-slate-500">
				<Translate text={localizationConstants.createAtaUploadHint} />
			</p>
			{message && (
				<p role="alert" className="text-sm text-red-600">
					{t(message.key, { max: ATA_FILE_RULES.maxCount })}
					{message.name && (
						<>
							{" "}
							<span className="font-medium break-all">{message.name}</span>
						</>
					)}
				</p>
			)}
		</div>
	);
}

export default AtaUploadRow;
