"use client";

import { MultiFileUploadField } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROJECT_CREATE_CONSTANTS } from "../constants";
import type { ProjectDocumentItem } from "../types";
import { AttachedDocumentsTable } from "../components/AttachedDocumentsTable";

export interface Step3DocumentsProps {
	documents: ProjectDocumentItem[];
	pendingFiles: { name: string; file: File }[];
	onSelectFiles: (files: File[]) => void;
	onRemovePending: (name: string) => void;
	onUpload: () => void;
	onRename: (id: string, name: string) => void;
	onRemove: (id: string) => void;
}

/**
 * Dokument — the picker above, the attached files below.
 *
 * `accept` is passed to the input for the OS dialog's benefit only; the same
 * extensions and a size cap are enforced in `useCreateProjectForm`, which is
 * the check a drag-and-drop or a scripted change event cannot walk past.
 */
export function Step3Documents({
	documents,
	pendingFiles,
	onSelectFiles,
	onRemovePending,
	onUpload,
	onRename,
	onRemove,
}: Step3DocumentsProps) {
	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="border-b border-slate-200 px-6 py-4">
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate text={localizationConstants.orderDokumentSection} />
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4 p-6">
				<div className="space-y-1.5">
					<p className="text-sm font-medium text-slate-700">
						<Translate
							text={localizationConstants.orderUploadFileLabel}
						/>
					</p>
					<MultiFileUploadField
						pendingFiles={pendingFiles}
						onSelectFiles={onSelectFiles}
						onRemovePending={onRemovePending}
						onUpload={onUpload}
						accept={PROJECT_CREATE_CONSTANTS.ALLOWED_FILE_TYPES}
						buttonLabel={localizationConstants.orderUploadButton}
					/>
					<p className="text-sm text-slate-500">
						<Translate
							text={localizationConstants.orderFileAllowedHelper}
						/>
					</p>
				</div>

				<AttachedDocumentsTable
					documents={documents}
					onRename={onRename}
					onRemove={onRemove}
				/>
			</CardContent>
		</Card>
	);
}

export default Step3Documents;
