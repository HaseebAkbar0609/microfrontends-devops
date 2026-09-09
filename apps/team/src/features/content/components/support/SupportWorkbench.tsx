"use client";

import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { pickCountKey } from "@/utils/pluralLabel";
import { useSupportGuide } from "../../hooks/useSupportGuide";
import type { ContentGroupId, ContentSection } from "../../types";
import { GuideCategoryRow } from "./GuideCategoryRow";
import { SupportContactCard } from "./SupportContactCard";

type SupportWorkbenchProps = {
	groupId: ContentGroupId;
	section: ContentSection;
};

/**
 * The `variant: "support"` screen: contact details plus the help-guide tree.
 * Replaces the generic list/form for that one section.
 */
export function SupportWorkbench({ groupId, section }: SupportWorkbenchProps) {
	const {
		guide,
		newCategory,
		setNewCategory,
		isExpanded,
		toggle,
		addCategory,
		removeCategory,
		addSubcategory,
	} = useSupportGuide(groupId);
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-5">
			<SupportContactCard
				key={groupId}
				groupId={groupId}
				contact={guide.contact}
			/>

			<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
				<header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.contentGuideTitle} />
					</h2>
					<span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
						{`${guide.tree.length} ${t(
							pickCountKey(
								guide.tree.length,
								localizationConstants.contentGuideCategorySuffixSingular,
								localizationConstants.contentGuideCategoriesSuffix,
							),
						)}`}
					</span>
				</header>

				<div className="flex flex-col gap-4 px-5 py-5">
					<div className="flex flex-wrap gap-2">
						<Input
							value={newCategory}
							// Distinct from the per-row "Kategorinamn" inputs below, which
							// would otherwise share this control's accessible name.
							aria-label={t(localizationConstants.contentNewCategoryLabel)}
							placeholder={t(
								localizationConstants.contentNewCategoryPlaceholder,
							)}
							className="max-w-sm"
							onChange={(event) => setNewCategory(event.target.value)}
						/>
						<Button
							type="button"
							onClick={addCategory}
							className="cursor-pointer"
						>
							<FolderPlus className="size-4" aria-hidden />
							{t(localizationConstants.contentAddCategoryButton)}
						</Button>
					</div>

					<div className="flex flex-col gap-3">
						{guide.tree.map((category) => (
							<GuideCategoryRow
								key={category.id}
								groupId={groupId}
								category={category}
								allowVideo={section.guideMedia === true}
								isExpanded={isExpanded}
								onToggle={toggle}
								onAddSubcategory={addSubcategory}
								onRemove={removeCategory}
							/>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

export default SupportWorkbench;
