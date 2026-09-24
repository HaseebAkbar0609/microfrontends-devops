"use client";

import type { Control, FieldPath } from "react-hook-form";

import { FormInput } from "@/components/form";
import { TableCell, TableRow } from "@/components/ui/table";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RecordFileIcon } from "../../../components/RecordFileIcon";
import { ATA_DOCUMENT_NAME_MAX_LENGTH, ATA_FILE_RULES } from "../../projectAta.config";
import type { AtaDocumentInput } from "../../types";
import { AtaDocumentRowMenu } from "./AtaDocumentRowMenu";
import { AtaDocumentViewButton } from "./AtaDocumentViewButton";

/** Any form holding attached documents — the project's own ÄTA or a supplier's. */
export interface AtaDocumentsFormValues {
	documents: AtaDocumentInput[];
}

/**
 * "manage" is the project's own ÄTA: the file name opens it, ⋮ Redigera and
 * Radera. "review" is a supplier's ÄTA: the name is text and "Visa" opens it.
 */
export type AtaDocumentActions =
	| { mode: "manage"; onFocusName: (index: number) => void; onDelete: (document: AtaDocumentInput) => void }
	| { mode: "review" };

export interface AtaDocumentRowProps<T extends AtaDocumentsFormValues> {
	control: Control<T>;
	document: AtaDocumentInput;
	/** Its position in the form's list, whatever order the table shows. */
	index: number;
	/** The stored file's URL, once the ÄTA has been saved with it. */
	url?: string;
	lockReason: TranslationKeys | null;
	translateError: (message: string) => string;
	actions: AtaDocumentActions;
}

/** One attached document: Datum, its name as an editable field, the file, and its action. */
export function AtaDocumentRow<T extends AtaDocumentsFormValues>({ control, document, index, url, lockReason, translateError, actions }: AtaDocumentRowProps<T>) {
	const t = useTranslate();
	const noPreview = t(localizationConstants.projectAtaNoPreview);
	const fileNameClass = "max-w-[14rem] truncate";

	return (
		<TableRow>
			<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-900 tabular-nums">{document.date}</TableCell>
			<TableCell className="min-w-56 px-4 py-2">
				<FormInput
					control={control}
					name={`documents.${index}.documentName` as FieldPath<T>}
					disabled={Boolean(lockReason)}
					inputClassName="h-9"
					inputProps={{
						maxLength: ATA_DOCUMENT_NAME_MAX_LENGTH,
						"aria-label": `${t(localizationConstants.viewAtaDocName)} ${document.fileName}`,
					}}
					translateError={translateError}
				/>
			</TableCell>
			<TableCell className="px-4 py-3 text-sm text-slate-900">
				<span className="flex min-w-0 items-center gap-3">
					<RecordFileIcon fileName={document.fileName} types={ATA_FILE_RULES.types} />
					{actions.mode === "manage" && url ? (
						<button
							type="button"
							onClick={() => {
								if (!openSafeUrl(url)) showToast("error", noPreview);
							}}
							aria-label={t(localizationConstants.projectAtaOpenFile, { name: document.fileName })}
							className={`${fileNameClass} cursor-pointer rounded text-left underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none`}
						>
							{document.fileName}
						</button>
					) : (
						<span title={actions.mode === "manage" ? noPreview : undefined} className={fileNameClass}>
							{document.fileName}
						</span>
					)}
				</span>
			</TableCell>
			<TableCell className="px-2 py-3 text-right">
				{actions.mode === "manage" ? (
					<AtaDocumentRowMenu
						fileName={document.fileName}
						lockReason={lockReason}
						onFocusName={() => actions.onFocusName(index)}
						onDelete={() => actions.onDelete(document)}
					/>
				) : (
					<AtaDocumentViewButton fileName={document.fileName} url={url} />
				)}
			</TableCell>
		</TableRow>
	);
}

export default AtaDocumentRow;
