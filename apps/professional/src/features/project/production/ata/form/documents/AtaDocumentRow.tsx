"use client";

import { useRef } from "react";
import { FileImage, MoreVertical, PencilLine, Trash2 } from "lucide-react";
import type { Control } from "react-hook-form";

import { FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { TableCell, TableRow } from "@/components/ui/table";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { isImageFile } from "../../../../shared/recordFiles";
import { AtaMenuAction } from "../../list/AtaRowMenu";
import { ATA_DOCUMENT_NAME_MAX_LENGTH, ATA_FILE_RULES } from "../../projectAta.config";
import type { AtaDocumentInput } from "../../types";
import type { AtaFormValues } from "../ataFormSchema";

export interface AtaDocumentRowProps {
	control: Control<AtaFormValues>;
	document: AtaDocumentInput;
	/** Its position in the form's list, whatever order the table shows. */
	index: number;
	/** The stored file's URL, once the ÄTA has been saved with it. */
	url?: string;
	lockReason: TranslationKeys | null;
	translateError: (message: string) => string;
	onFocusName: (index: number) => void;
	onDelete: (document: AtaDocumentInput) => void;
}

/**
 * One attached document: Datum, its name as an editable field, the file (opened
 * in a new tab once saved), and ⋮ Redigera — which focuses the name — and Radera.
 */
export function AtaDocumentRow({ control, document, index, url, lockReason, translateError, onFocusName, onDelete }: AtaDocumentRowProps) {
	const t = useTranslate();
	const focusNameOnClose = useRef(false);
	const locked = Boolean(lockReason);
	const noPreview = t(localizationConstants.projectAtaNoPreview);

	return (
		<TableRow>
			<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-900 tabular-nums">{document.date}</TableCell>
			<TableCell className="min-w-56 px-4 py-2">
				<FormInput
					control={control}
					name={`documents.${index}.documentName`}
					disabled={locked}
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
					{isImageFile(document.fileName, ATA_FILE_RULES.types) ? (
						<FileImage className="h-8 w-8 shrink-0 text-slate-500" aria-hidden />
					) : (
						<PdfFileIcon className="h-10 w-8 shrink-0" />
					)}
					{url ? (
						<button
							type="button"
							onClick={() => {
								if (!openSafeUrl(url)) showToast("error", noPreview);
							}}
							aria-label={t(localizationConstants.projectAtaOpenFile, { name: document.fileName })}
							className="max-w-[14rem] cursor-pointer truncate rounded text-left underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
						>
							{document.fileName}
						</button>
					) : (
						<span title={noPreview} className="max-w-[14rem] truncate">
							{document.fileName}
						</span>
					)}
				</span>
			</TableCell>
			<TableCell className="w-12 px-2 py-3 text-right">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={t(localizationConstants.projectAtaRowActions, { label: document.fileName })}
							className="h-9 w-9 cursor-pointer text-slate-700"
						>
							<MoreVertical className="h-4 w-4" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-60 border border-slate-200 bg-white p-1 shadow-md"
						onCloseAutoFocus={(event) => {
							/* Radix returns focus to ⋮ on close; Redigera wants it in the name field. */
							if (!focusNameOnClose.current) return;
							focusNameOnClose.current = false;
							event.preventDefault();
							onFocusName(index);
						}}
					>
						<AtaMenuAction
							icon={PencilLine}
							labelKey={localizationConstants.ataActionEdit}
							reasonKey={lockReason}
							onSelect={() => {
								focusNameOnClose.current = true;
							}}
						/>
						<AtaMenuAction
							icon={Trash2}
							labelKey={localizationConstants.ataActionDelete}
							reasonKey={lockReason}
							destructive
							onSelect={() => onDelete(document)}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}

export default AtaDocumentRow;
