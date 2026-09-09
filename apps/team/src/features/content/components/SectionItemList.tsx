"use client";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useContentSections } from "../hooks/useContentSections";
import type { useSectionForm } from "../hooks/useSectionForm";
import type { ContentRow, ContentSection } from "../types";
import { SectionItemCard } from "./SectionItemCard";

type SectionItemListProps = {
	section: ContentSection;
	sectionKey: string;
	rows: ContentRow[];
	sectionForm: ReturnType<typeof useSectionForm>;
};

/**
 * The saved rows for one section. The heading uses the section's explicit
 * plural key — the prototype appended "er" and produced "inlägger".
 */
export function SectionItemList({
	section,
	sectionKey,
	rows,
	sectionForm,
}: SectionItemListProps) {
	const { removeRow } = useContentSections();
	const { startEditing, reset, editingId } = sectionForm;
	const t = useTranslate();

	const handleDelete = (rowId: string) => {
		removeRow(sectionKey, rowId);
		if (editingId === rowId) reset();
		showToast("success", t(localizationConstants.contentRowDeletedToast));
	};

	return (
		<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
			<header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
				<h2 className="text-base font-semibold text-slate-900">
					{`${t(localizationConstants.contentAddedItemsPrefix)} ${t(
						section.itemLabelPluralKey,
					)}`}
				</h2>
				<span className="inline-flex min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
					{rows.length}
				</span>
			</header>

			<div className="flex flex-col gap-3 px-5 py-5">
				{rows.length === 0 ? (
					<p className="text-sm text-slate-500">
						{t(localizationConstants.contentEmptyList)}
					</p>
				) : (
					rows.map((row) => (
						<SectionItemCard
							key={row.id}
							section={section}
							row={row}
							isEditing={editingId === row.id}
							onEdit={() => startEditing(row)}
							onDelete={() => handleDelete(row.id)}
						/>
					))
				)}
			</div>
		</section>
	);
}

export default SectionItemList;
