"use client";

import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useContentSections } from "../../hooks/useContentSections";
import type { ContentGroupId, GuideCategory } from "../../types";
import { pickCountKey } from "../../utils/countLabel";
import { GuideSubcategoryRow } from "./GuideSubcategoryRow";

type GuideCategoryRowProps = {
	groupId: ContentGroupId;
	category: GuideCategory;
	allowVideo: boolean;
	isExpanded: (id: string) => boolean;
	onToggle: (id: string) => void;
	onAddSubcategory: (categoryId: string) => void;
	onRemove: (categoryId: string) => void;
};

/** Level one of the guide tree. */
export function GuideCategoryRow({
	groupId,
	category,
	allowVideo,
	isExpanded,
	onToggle,
	onAddSubcategory,
	onRemove,
}: GuideCategoryRowProps) {
	const { renameCategory } = useContentSections();
	const t = useTranslate();
	const expanded = isExpanded(category.id);

	return (
		<div className="rounded-lg border border-slate-200">
			<div className="flex items-center gap-2 p-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={t(localizationConstants.contentToggleCategory)}
					aria-expanded={expanded}
					onClick={() => onToggle(category.id)}
					className="size-8 shrink-0 cursor-pointer"
				>
					<ChevronRight
						className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`}
						aria-hidden
					/>
				</Button>

				<Input
					value={category.name}
					aria-label={t(localizationConstants.contentCategoryNameLabel)}
					className="max-w-sm border-transparent bg-transparent font-medium shadow-none"
					onChange={(event) =>
						renameCategory(groupId, category.id, event.target.value)
					}
				/>

				<span className="ml-auto shrink-0 text-xs text-slate-500">
					{`${category.subcategories.length} ${t(
						pickCountKey(
							category.subcategories.length,
							localizationConstants.contentGuideSubcategorySuffixSingular,
							localizationConstants.contentGuideSubcategoriesSuffix,
						),
					)}`}
				</span>

				<ConfirmDialog
					title={t(localizationConstants.contentConfirmDeleteTitle)}
					description={t(localizationConstants.contentConfirmDeleteDescription)}
					confirmText={t(localizationConstants.contentConfirmLabel)}
					cancelText={t(localizationConstants.contentCancelButton)}
					onConfirm={() => onRemove(category.id)}
					trigger={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={t(localizationConstants.contentDeleteCategory)}
							className="size-8 shrink-0 cursor-pointer"
						>
							<Trash2 className="size-4" aria-hidden />
						</Button>
					}
				/>
			</div>

			{expanded && (
				<div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-3 pl-8">
					{category.subcategories.map((subcategory) => (
						<GuideSubcategoryRow
							key={subcategory.id}
							groupId={groupId}
							categoryId={category.id}
							subcategory={subcategory}
							allowVideo={allowVideo}
							isExpanded={isExpanded(subcategory.id)}
							onToggle={() => onToggle(subcategory.id)}
						/>
					))}

					<Button
						type="button"
						variant="outline"
						size="sm"
						className="w-fit cursor-pointer"
						onClick={() => onAddSubcategory(category.id)}
					>
						<Plus className="size-4" aria-hidden />
						{t(localizationConstants.contentAddSubcategoryButton)}
					</Button>
				</div>
			)}
		</div>
	);
}

export default GuideCategoryRow;
