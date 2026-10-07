"use client";

import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { ConsultantTypeFormState } from "../../hooks/useConsultantTypeForm";
import type { ConsultantTypesState } from "../../hooks/useConsultantTypes";
import type { ContentSection } from "../../types";
import { ConsultantTypeListItem } from "./ConsultantTypeListItem";

type ConsultantTypeListProps = {
	section: ContentSection;
	consultantTypes: ConsultantTypesState;
	typeForm: ConsultantTypeFormState;
};

/** The saved consultant types, with loading, error and empty states. */
export function ConsultantTypeList({
	section,
	consultantTypes,
	typeForm,
}: ConsultantTypeListProps) {
	const { types, isLoading, isError, refetch, deleteType, deletingId } =
		consultantTypes;
	const { startEditing, reset, editingId, isSaving } = typeForm;
	const t = useTranslate();

	const handleDelete = async (id: string) => {
		const deleted = await deleteType(id);
		if (deleted && editingId === id) reset();
	};

	const renderBody = () => {
		if (isLoading) {
			return (
				<p role="status" className="flex items-center gap-2 text-sm text-slate-500">
					<Loader2 className="size-4 animate-spin" aria-hidden />
					{t(localizationConstants.contentConsultantTypeLoading)}
				</p>
			);
		}
		if (isError) {
			return (
				<div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
					<span>{t(localizationConstants.contentConsultantTypeLoadFailed)}</span>
					<Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
						<RotateCw className="size-4" aria-hidden />
						{t(localizationConstants.contentConsultantTypeRetry)}
					</Button>
				</div>
			);
		}
		if (types.length === 0) {
			return (
				<p className="text-sm text-slate-500">
					{t(localizationConstants.contentConsultantTypeEmpty)}
				</p>
			);
		}
		return types.map((type) => (
			<ConsultantTypeListItem
				key={type.id}
				type={type}
				isEditing={editingId === type.id}
				// Locked while a save is in flight, so its response lands on the
				// draft it belongs to.
				isBusy={isSaving || deletingId === type.id}
				onEdit={() => startEditing(type)}
				onDelete={() => void handleDelete(type.id)}
			/>
		));
	};

	return (
		<section className="h-fit rounded-xl border border-slate-200 bg-white shadow-2xs">
			<header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
				<h2 className="text-base font-semibold text-slate-900">
					{`${t(localizationConstants.contentAddedItemsPrefix)} ${t(
						section.itemLabelPluralKey,
					)}`}
				</h2>
				<span className="inline-flex min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
					{types.length}
				</span>
			</header>

			<div className="flex flex-col gap-3 px-5 py-5">{renderBody()}</div>
		</section>
	);
}

export default ConsultantTypeList;
