"use client";

import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useContentSections } from "../../hooks/useContentSections";
import type { ContentGroupId, GuideSubcategory } from "../../types";
import { GuideEntryCard } from "./GuideEntryCard";

type GuideSubcategoryRowProps = {
	groupId: ContentGroupId;
	categoryId: string;
	subcategory: GuideSubcategory;
	allowVideo: boolean;
	isExpanded: boolean;
	onToggle: () => void;
};

/** Level two of the guide tree. */
export function GuideSubcategoryRow({
	groupId,
	categoryId,
	subcategory,
	allowVideo,
	isExpanded,
	onToggle,
}: GuideSubcategoryRowProps) {
	const { renameSubcategory, removeSubcategory, addEntry } =
		useContentSections();
	const t = useTranslate();

	return (
		<div className="rounded-md border border-slate-200 bg-white">
			<div className="flex items-center gap-2 p-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.contentToggleSubcategory)}
					aria-expanded={isExpanded}
					onClick={onToggle}
					className="size-8 shrink-0 cursor-pointer"
				>
					<ChevronRight
						className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
						aria-hidden
					/>
				</Button>

				<Input
					value={subcategory.name}
					aria-label={t(localizationConstants.contentSubcategoryNameLabel)}
					className="max-w-sm border-transparent bg-transparent shadow-none"
					onChange={(event) =>
						renameSubcategory(
							groupId,
							categoryId,
							subcategory.id,
							event.target.value,
						)
					}
				/>

				<ConfirmDialog
					title={t(localizationConstants.contentConfirmDeleteTitle)}
					description={t(localizationConstants.contentConfirmDeleteDescription)}
					confirmText={t(localizationConstants.contentConfirmLabel)}
					cancelText={t(localizationConstants.contentCancelButton)}
					onConfirm={() =>
						removeSubcategory(groupId, categoryId, subcategory.id)
					}
					trigger={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={t(localizationConstants.contentDeleteSubcategory)}
							className="ml-auto size-8 shrink-0 cursor-pointer"
						>
							<Trash2 className="size-4" aria-hidden />
						</Button>
					}
				/>
			</div>

			{isExpanded && (
				<div className="flex flex-col gap-4 border-t border-slate-200 p-3 pl-6">
					{subcategory.entries.map((entry) => (
						<GuideEntryCard
							key={entry.id}
							groupId={groupId}
							categoryId={categoryId}
							subcategoryId={subcategory.id}
							entry={entry}
							allowVideo={allowVideo}
						/>
					))}

					<Button
						type="button"
						variant="outline"
						size="sm"
						className="w-fit cursor-pointer"
						onClick={() => addEntry(groupId, categoryId, subcategory.id)}
					>
						<Plus className="size-4" aria-hidden />
						{t(localizationConstants.contentAddEntryButton)}
					</Button>
				</div>
			)}
		</div>
	);
}

export default GuideSubcategoryRow;
