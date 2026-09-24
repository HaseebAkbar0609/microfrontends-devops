"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { Control } from "react-hook-form";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { RecordFileChips, type RecordFileChipsLabels } from "../../components/RecordFileChips";
import { acceptPickedFiles, type PickedFilesResult } from "../inspectionFiles";
import {
	INSPECTION_CHIPS_COLLAPSED,
	INSPECTION_DOCUMENTS_MAX,
	INSPECTION_FILE_ACCEPT,
} from "../projectInspection.config";
import type { InspectionFormValues } from "./inspectionSchema";

/** Module constant: Besiktning's wording for the shared chips. */
const CHIP_LABELS: RecordFileChipsLabels = {
	list: localizationConstants.inspectionDocumentFieldLabel,
	remove: localizationConstants.projectInspectionRemoveFile,
	more: localizationConstants.projectInspectionMoreFiles,
	showAll: localizationConstants.projectInspectionShowAllFiles,
	showFewer: localizationConstants.projectInspectionShowFewerFiles,
};

export interface InspectionDocumentsFieldProps {
	control: Control<InspectionFormValues>;
	translateError: (message: string) => string;
}

/**
 * Dokument: the frame's single "Ladda upp dina filer" field, its allowed-types
 * line, and the attached files as chips.
 *
 * Several files can be picked at once. Each is checked as it is picked — type,
 * size, a name already attached, the per-inspection maximum — and the first
 * refusal is shown inline, naming the file. Nothing is stored until Spara.
 */
export function InspectionDocumentsField({ control, translateError }: InspectionDocumentsFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const id = useId();
	const [expanded, setExpanded] = useState(false);
	const [rejection, setRejection] = useState<PickedFilesResult["rejection"]>(null);
	const focusUpload = useCallback(() => buttonRef.current?.focus(), []);

	return (
		<FormField
			control={control}
			name="documents"
			render={({ field }) => {
				const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
					const files = Array.from(event.target.files ?? []);
					/* Reset, so picking the same file again still fires a change. */
					event.target.value = "";
					if (files.length === 0) return;

					const result = acceptPickedFiles(field.value, files);
					setRejection(result.rejection);
					if (result.added === 0) return;
					field.onChange(result.next);
					if (result.next.length > INSPECTION_CHIPS_COLLAPSED) setExpanded(true);
				};

				const remove = (documentId: string) => {
					field.onChange(field.value.filter((doc) => doc.id !== documentId));
					setRejection(null);
				};

				return (
					<FormItem className="grid gap-1">
						<FormLabel id={`${id}-label`}>
							<Translate text={localizationConstants.inspectionDocumentFieldLabel} />
						</FormLabel>
						<input
							ref={inputRef}
							type="file"
							multiple
							accept={INSPECTION_FILE_ACCEPT}
							tabIndex={-1}
							className="hidden"
							onChange={pick}
						/>
						<FormControl>
							<button
								ref={buttonRef}
								type="button"
								onClick={() => inputRef.current?.click()}
								onBlur={field.onBlur}
								aria-labelledby={`${id}-label ${id}-action`}
								className="flex h-10 w-full cursor-pointer items-center rounded-md border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 shadow-2xs hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:outline-none"
							>
								<span id={`${id}-action`} className="truncate">
									<Translate text={localizationConstants.lblLaddaUppDinaFiler} />
								</span>
							</button>
						</FormControl>
						<FormDescription className="text-sm text-slate-500">
							<Translate text={localizationConstants.inspectionAllowedFileTypes} />
						</FormDescription>
						{rejection && (
							<p role="alert" className="text-sm text-red-600">
								<Translate text={rejection.key} values={{ max: INSPECTION_DOCUMENTS_MAX }} />
								{rejection.name && (
									<>
										{" "}
										<span className="font-medium break-all">{rejection.name}</span>
									</>
								)}
							</p>
						)}
						<FormMessage translate={translateError} />
						<RecordFileChips
							documents={field.value}
							onRemove={remove}
							expanded={expanded}
							onToggle={() => setExpanded((open) => !open)}
							listId={`${id}-files`}
							onFocusFallback={focusUpload}
							labels={CHIP_LABELS}
							collapsedCount={INSPECTION_CHIPS_COLLAPSED}
						/>
					</FormItem>
				);
			}}
		/>
	);
}

export default InspectionDocumentsField;
