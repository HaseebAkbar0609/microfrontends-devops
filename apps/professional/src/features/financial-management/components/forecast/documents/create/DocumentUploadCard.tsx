"use client";

import { MultiFileUploadField } from "@/components/form/MultiFileUploadField";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DOCUMENT_BATCH_MAX,
	DOCUMENT_CATEGORIES,
	DOCUMENT_CATEGORY_LABELS,
	DOCUMENT_FILE_ACCEPT,
} from "../../../../constants/forecastDocuments.constants";
import type { DocumentUploadFormState } from "../../../../hooks/useDocumentUploadForm";
import type { DocumentCategory } from "../../../../types/forecastDocuments.types";

export interface DocumentUploadCardProps {
	form: DocumentUploadFormState;
	/** The staged table, which the card frames but does not own. */
	children: React.ReactNode;
}

/**
 * "Dokument": what the batch is about, the files it carries, and what has been
 * taken so far.
 *
 * The category sits above the picker because it governs the whole batch — the
 * frame draws no such field, but without it every upload would land as Övrigt
 * and the register's Kategori column and Filter would have nothing to say.
 */
export function DocumentUploadCard({ form, children }: DocumentUploadCardProps) {
	const t = useTranslate();

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-100 px-6 py-4 text-sm font-bold text-slate-900">
				<Translate text={localizationConstants.forecastDocumentsCardTitle} />
			</h2>

			<div className="flex flex-col gap-5 px-6 py-5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="document-category" className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.forecastDocumentsColCategory} />
						<span aria-hidden className="text-red-600">
							*
						</span>
					</Label>
					<Select
						value={form.category ?? undefined}
						onValueChange={(next) => form.setCategory(next as DocumentCategory)}
					>
						<SelectTrigger
							id="document-category"
							className="h-10 w-full cursor-pointer border-slate-200 sm:max-w-sm"
						>
							<SelectValue placeholder={t(localizationConstants.forecastDocumentsCategoryPlaceholder)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{DOCUMENT_CATEGORIES.map((option) => (
								<SelectItem key={option} value={option} className="cursor-pointer">
									<Translate text={DOCUMENT_CATEGORY_LABELS[option]} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{form.categoryError && (
						<p className="text-xs text-red-600">
							<Translate text={form.categoryError} />
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.forecastDocumentsUploadYourFiles} />
					</Label>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.forecastDocumentsAllowedFiles} />
					</p>

					<MultiFileUploadField
						pendingFiles={form.pending}
						onSelectFiles={form.selectFiles}
						onRemovePending={form.removePending}
						onUpload={form.commitPending}
						accept={DOCUMENT_FILE_ACCEPT}
						buttonLabel={localizationConstants.forecastDocumentsBtnUpload}
						placeholder={localizationConstants.forecastDocumentsSelectFiles}
					/>

					{form.rejection && (
						<p className="text-xs text-red-600">
							{t(form.rejection.key, { name: form.rejection.name ?? "", max: DOCUMENT_BATCH_MAX })}
						</p>
					)}
					{/* Only the first refusal says why, so the rest are counted. */}
					{form.refusedCount > 1 && (
						<p className="text-xs text-red-600">
							{t(localizationConstants.forecastDocumentsMoreRefused, { count: form.refusedCount - 1 })}
						</p>
					)}
					{form.filesError && (
						<p className="text-xs text-red-600">
							<Translate text={form.filesError} />
						</p>
					)}
				</div>

				{children}
			</div>
		</div>
	);
}

export default DocumentUploadCard;
