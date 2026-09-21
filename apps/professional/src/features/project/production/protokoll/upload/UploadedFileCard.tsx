"use client";

import { useId } from "react";
import { Eye, FileText, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { RecordFileIcon } from "../../components/RecordFileIcon";
import { PROTOCOL_FILE_RULES } from "../projectProtocol.config";

const ACTION = "h-9 cursor-pointer gap-2 border-slate-200 px-3 text-sm font-medium text-slate-900";

export interface UploadedFileCardProps {
	fileName: string;
	/** The `blob:` the store minted; a seeded file has none. */
	url?: string;
	onOpen: () => void;
	onPrint: () => void;
}

/**
 * The uploaded protocol's file: its icon and full name, with Öppna and Skriv
 * ut. A seeded file has nothing stored behind it, so both are disabled and the
 * reason is printed beside them — a disabled button's tooltip never shows.
 */
export function UploadedFileCard({ fileName, url, onOpen, onPrint }: UploadedFileCardProps) {
	const reasonId = useId();
	const stored = Boolean(url);
	const describedBy = stored ? undefined : reasonId;

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectProtocolFileLabel}
			icon={<FileText className="h-5 w-5 text-slate-700" aria-hidden />}
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<RecordFileIcon fileName={fileName} types={PROTOCOL_FILE_RULES.types} />
					<span className="truncate text-sm text-slate-900" title={fileName}>
						{fileName}
					</span>
				</div>
				<div className="flex gap-2">
					<Button type="button" variant="outline" disabled={!stored} aria-describedby={describedBy} onClick={onOpen} className={ACTION}>
						<Eye className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectListOpen} />
					</Button>
					<Button type="button" variant="outline" disabled={!stored} aria-describedby={describedBy} onClick={onPrint} className={ACTION}>
						<Printer className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectListPrint} />
					</Button>
				</div>
			</div>
			{!stored && (
				<p id={reasonId} className="mt-3 text-sm text-slate-500">
					<Translate text={localizationConstants.projectProtocolNoFile} />
				</p>
			)}
		</ProjectSectionCard>
	);
}

export default UploadedFileCard;
