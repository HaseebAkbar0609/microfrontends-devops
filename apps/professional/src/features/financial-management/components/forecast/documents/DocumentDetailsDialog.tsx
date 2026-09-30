"use client";

import { ExternalLink } from "lucide-react";

import { DetailRow } from "@/components/dialog/DetailRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import { formatFileSize } from "@/utils/formatFileSize";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DOCUMENT_CATEGORY_LABELS,
	DOCUMENT_FILE_RULES,
} from "../../../constants/forecastDocuments.constants";
import type { ForecastDocument } from "../../../types/forecastDocuments.types";

export interface DocumentDetailsDialogProps {
	document: ForecastDocument;
	/** Opens the held file in a new tab; refused on one holding none. */
	onOpenFile: () => void;
	onClose: () => void;
}

/**
 * What the eye opens: the document as the register holds it, including the
 * size the table has no column for. The file opens from here too, or says why
 * it cannot — a seeded document, and a new one after a reload, holds none.
 */
export function DocumentDetailsDialog({ document, onOpenFile, onClose }: DocumentDetailsDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastDocumentsDetailsTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col">
					<DetailRow labelKey={localizationConstants.forecastDocumentsColId}>
						<span className="tabular-nums">{document.documentNo}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastDocumentsColCategory}>
						<Badge variant="category">{t(DOCUMENT_CATEGORY_LABELS[document.category])}</Badge>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastDocumentsColFile}>
						<div className="flex items-center gap-2.5">
							<RecordFileIcon fileName={document.fileName} types={DOCUMENT_FILE_RULES.types} />
							<span className="truncate" title={document.fileName}>
								{document.fileName}
							</span>
						</div>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastDocumentsColDate}>
						<span className="tabular-nums">{document.date}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastDocumentsDetailSize}>
						{document.fileSize === undefined ? (
							<span className="text-slate-500">
								<Translate text={localizationConstants.forecastDocumentsSizeUnknown} />
							</span>
						) : (
							<span className="tabular-nums">{formatFileSize(document.fileSize)}</span>
						)}
					</DetailRow>
				</div>

				{!document.url && (
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.forecastDocumentsNoFile} />
					</p>
				)}

				<DialogFooter className="gap-2 sm:gap-3">
					<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
						<Translate text={localizationConstants.buttonClose} />
					</Button>
					<Button
						type="button"
						onClick={onOpenFile}
						disabled={!document.url}
						className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 disabled:cursor-not-allowed"
					>
						<ExternalLink className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastDocumentsOpenFile} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DocumentDetailsDialog;
