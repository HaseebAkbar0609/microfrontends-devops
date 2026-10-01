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
	TEMPLATE_CATEGORY_LABELS,
	TEMPLATE_FILE_RULES,
} from "../../../constants/forecastTemplates.constants";
import type { TemplateDocument } from "../../../types/forecastTemplates.types";

export interface TemplateDetailsDialogProps {
	template: TemplateDocument;
	/** Opens the held file in a new tab; refused on a template holding none. */
	onOpenFile: () => void;
	onClose: () => void;
}

/**
 * What the eye opens: the template as the register holds it, including the
 * description the table has no column for. The file opens from here too, or
 * says why it cannot — a seeded template, and a new one after a reload, holds
 * no file.
 */
export function TemplateDetailsDialog({ template, onOpenFile, onClose }: TemplateDetailsDialogProps) {
	const t = useTranslate();

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastTemplatesDetailsTitle} />
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col">
					<DetailRow labelKey={localizationConstants.forecastTemplatesColId}>
						<span className="tabular-nums">{template.templateNo}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastTemplatesColCategory}>
						<Badge variant="category">{t(TEMPLATE_CATEGORY_LABELS[template.category])}</Badge>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastTemplatesColDate}>
						<span className="tabular-nums">{template.date}</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastTemplatesColName}>
						<span className="truncate" title={template.documentName}>
							{template.documentName}
						</span>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastTemplatesColFile}>
						<div className="flex items-center gap-2.5">
							<RecordFileIcon fileName={template.fileName} types={TEMPLATE_FILE_RULES.types} />
							<span className="truncate" title={template.fileName}>
								{template.fileName}
							</span>
						</div>
					</DetailRow>

					<DetailRow labelKey={localizationConstants.forecastTemplatesDetailSize}>
						{template.fileSize === undefined ? (
							<span className="text-slate-500">
								<Translate text={localizationConstants.forecastTemplatesSizeUnknown} />
							</span>
						) : (
							<span className="tabular-nums">{formatFileSize(template.fileSize)}</span>
						)}
					</DetailRow>

					{/* Always drawn, so the dialog keeps its height whether or not a
					    description was given. */}
					<DetailRow labelKey={localizationConstants.forecastTemplatesFieldDescription}>
						{template.description ? (
							<p className="whitespace-pre-wrap">{template.description}</p>
						) : (
							<span className="text-slate-500">
								<Translate text={localizationConstants.forecastTemplatesNoDescription} />
							</span>
						)}
					</DetailRow>
				</div>

				{!template.url && (
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.forecastTemplatesNoFile} />
					</p>
				)}

				<DialogFooter className="gap-2 sm:gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="cursor-pointer border-slate-200"
					>
						<Translate text={localizationConstants.buttonClose} />
					</Button>
					<Button
						type="button"
						onClick={onOpenFile}
						disabled={!template.url}
						className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800 disabled:cursor-not-allowed"
					>
						<ExternalLink className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.forecastTemplatesOpenFile} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default TemplateDetailsDialog;
