"use client";

import { FileImage } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { isImageFile } from "../inspectionFiles";
import type { ProjectInspectionDocument } from "../types";

function FileIcon({ name, small = false }: { name: string; small?: boolean }) {
	if (isImageFile(name)) {
		return <FileImage className={small ? "h-4 w-4 shrink-0 text-slate-500" : "h-8 w-8 shrink-0 text-slate-500"} aria-hidden />;
	}
	return <PdfFileIcon className={small ? "h-5 w-4 shrink-0" : "h-10 w-8 shrink-0"} />;
}

export interface InspectionDocumentCellProps {
	documents: ProjectInspectionDocument[];
}

/**
 * The PDF column: the first file, as the frame draws it, and a "+N fler" menu
 * reaching the rest. A file stored this session opens in a new tab through
 * `openSafeUrl`; a seeded file has nothing behind it, so its name is plain text
 * that says so rather than a button that does nothing.
 */
export function InspectionDocumentCell({ documents }: InspectionDocumentCellProps) {
	const t = useTranslate();
	const [first, ...rest] = documents;

	if (!first) {
		return (
			<>
				<span aria-hidden className="text-slate-400">
					—
				</span>
				<span className="sr-only">
					<Translate text={localizationConstants.noFileChosen} />
				</span>
			</>
		);
	}

	const open = (doc: ProjectInspectionDocument) => {
		if (!openSafeUrl(doc.url)) showToast("error", t(localizationConstants.inspectionActionFailed));
	};
	const noPreview = t(localizationConstants.projectInspectionNoPreview);

	return (
		<span className="flex min-w-0 items-center gap-2 lg:gap-3">
			<FileIcon name={first.name} />
			{/* Below lg the count sits under the name, so the table fits a tablet held upright. */}
			<span className="flex min-w-0 flex-col items-start lg:flex-row lg:items-center lg:gap-3">
				{first.url ? (
					<button
						type="button"
						onClick={() => open(first)}
						aria-label={t(localizationConstants.projectInspectionOpenFile, { name: first.name })}
						className="max-w-[7rem] lg:max-w-[10rem] xl:max-w-[16rem] cursor-pointer truncate rounded text-left text-sm text-slate-900 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
					>
						{first.name}
					</button>
				) : (
					<span title={noPreview} className="max-w-[7rem] lg:max-w-[10rem] xl:max-w-[16rem] truncate text-sm text-slate-900">
						{first.name}
					</span>
				)}
				{rest.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								className="h-7 shrink-0 cursor-pointer px-0 text-xs font-medium text-slate-600 hover:text-slate-900 lg:h-9 lg:px-2"
							>
								<Translate text={localizationConstants.projectInspectionMoreFiles} values={{ count: rest.length }} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-64 border border-slate-200 bg-white p-1 shadow-md">
							{documents.map((doc) => (
								<DropdownMenuItem
									key={doc.id}
									disabled={!doc.url}
									title={doc.url ? undefined : noPreview}
									onClick={() => open(doc)}
									className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900"
								>
									<FileIcon name={doc.name} small />
									<span className="truncate">{doc.name}</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</span>
		</span>
	);
}

export default InspectionDocumentCell;
