"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { findOptionLabelKey } from "../constants/contentFieldOptions";
import { isMediaField } from "../schemas/contentSection.schema";
import type { ContentRow, ContentSection } from "../types";
import { toMediaList, toText } from "../utils/mediaValues";

type SectionItemCardProps = {
	section: ContentSection;
	row: ContentRow;
	isEditing: boolean;
	onEdit: () => void;
	onDelete: () => void;
};

/** One saved row: title, the remaining fields as a definition list, thumbnails. */
export function SectionItemCard({
	section,
	row,
	isEditing,
	onEdit,
	onDelete,
}: SectionItemCardProps) {
	const t = useTranslate();
	const [primary, ...rest] = section.fields;
	const detailFields = rest.filter((field) => !isMediaField(field.type));
	const mediaFields = section.fields.filter((field) =>
		isMediaField(field.type),
	);
	const images = mediaFields.flatMap((field) => toMediaList(row.values[field.name]));
	const title = primary ? toText(row.values[primary.name]) : "";

	return (
		<article
			className={`rounded-lg border p-4 ${
				isEditing ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
			}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="truncate text-sm font-semibold text-slate-900">
						{title}
					</h3>
					<dl className="mt-1 flex flex-col gap-0.5 text-sm text-slate-500">
						{detailFields.map((field) => {
							const raw = toText(row.values[field.name]);
							if (!raw) return null;
							const optionKey = findOptionLabelKey(field.options, raw);
							return (
								<div key={field.name} className="flex gap-1.5">
									<dt className="shrink-0 font-medium text-slate-700">
										{t(field.labelKey)}:
									</dt>
									<dd className="min-w-0">{optionKey ? t(optionKey) : raw}</dd>
								</div>
							);
						})}
					</dl>
				</div>

				<div className="flex shrink-0 items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={t(localizationConstants.contentEditAction)}
						onClick={onEdit}
						className="size-8 cursor-pointer"
					>
						<Pencil className="size-4" aria-hidden />
					</Button>
					<ConfirmDialog
						title={t(localizationConstants.contentConfirmDeleteTitle)}
						description={t(
							localizationConstants.contentConfirmDeleteDescription,
						)}
						confirmText={t(localizationConstants.contentConfirmLabel)}
						cancelText={t(localizationConstants.contentCancelButton)}
						onConfirm={onDelete}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label={t(localizationConstants.contentDeleteAction)}
								className="size-8 cursor-pointer"
							>
								<Trash2 className="size-4" aria-hidden />
							</Button>
						}
					/>
				</div>
			</div>

			{images.length > 0 && (
				<ul className="mt-3 flex flex-wrap gap-2">
					{images.map((source, index) => (
						<li key={source.slice(-32) + index}>
							<Image
								src={source}
								alt={`${title} ${index + 1}`}
								width={80}
								height={80}
								unoptimized
								className="size-20 rounded-md border border-slate-200 object-cover"
							/>
						</li>
					))}
				</ul>
			)}
		</article>
	);
}

export default SectionItemCard;
