"use client";

import React from "react";
import { ImageIcon } from "lucide-react";

import { RecordDocumentsTable } from "@/components/table/RecordDocumentsTable";
import { openSafeUrl } from "@/lib/safeUrl";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	CASE_DOCUMENT_FILE_RULES,
	CASE_DOCUMENT_TABLE_COPY,
} from "../../../constants/cases.constants";
import type { CaseDocument } from "../../../types/cases.types";
import { CaseImageGrid } from "../shared/CaseImageGrid";

interface CaseDocumentsViewProps {
	documents: CaseDocument[];
	images: CaseDocument[];
}

/**
 * What a case carries, read-only.
 *
 * The table is the one the create screen uses, without its delete column: a
 * case being read is not a case being edited, and one table means the two
 * screens cannot drift apart again.
 */
export function CaseDocumentsView({ documents, images }: CaseDocumentsViewProps) {
	return (
		<div className="space-y-6">
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<h2 className="border-b border-slate-100 px-6 py-4 text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.casesDocumentsSectionTitle} />
				</h2>
				<div className="px-6 py-5">
					<RecordDocumentsTable
						documents={documents}
						types={CASE_DOCUMENT_FILE_RULES.types}
						copy={CASE_DOCUMENT_TABLE_COPY}
					/>
				</div>
			</div>

			{images.length > 0 && (
				<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
					<h2 className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 text-sm font-bold text-slate-900">
						<ImageIcon className="h-4 w-4 text-slate-500" aria-hidden />
						<Translate text={localizationConstants.casesImagesSectionTitle} />
					</h2>
					<div className="px-6 py-5">
						<CaseImageGrid images={images} onOpen={(image) => openSafeUrl(image.url)} />
					</div>
				</div>
			)}
		</div>
	);
}

export default CaseDocumentsView;
