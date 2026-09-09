"use client";

import { useCallback, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { ContentGroupId } from "../types";
import { useContentSections } from "./useContentSections";

/**
 * View state for the help-guide editor: which branches are open, the pending
 * category name, and the two creates that need feedback. Everything that
 * mutates the tree itself lives in the provider.
 */
export function useSupportGuide(groupId: ContentGroupId) {
	const content = useContentSections();
	const t = useTranslate();
	const guide = content.getGuide(groupId);

	const [expanded, setExpanded] = useState<Record<string, boolean>>({});
	const [newCategory, setNewCategory] = useState("");

	const toggle = useCallback((id: string) => {
		setExpanded((previous) => ({ ...previous, [id]: !previous[id] }));
	}, []);

	const isExpanded = useCallback(
		(id: string) => expanded[id] === true,
		[expanded],
	);

	const addCategory = useCallback(() => {
		const name = newCategory.trim();
		if (!name) {
			showToast("error", t(localizationConstants.contentValidationCategoryName));
			return;
		}
		content.addCategory(groupId, name);
		setNewCategory("");
		showToast("success", t(localizationConstants.contentCategoryAddedToast));
	}, [content, groupId, newCategory, t]);

	const removeCategory = useCallback(
		(categoryId: string) => {
			content.removeCategory(groupId, categoryId);
			showToast("success", t(localizationConstants.contentCategoryRemovedToast));
		},
		[content, groupId, t],
	);

	const addSubcategory = useCallback(
		(categoryId: string) => {
			// The default name is resolved here and stored as data — it is an
			// editable record value from this point on, not a translation key.
			const subcategoryId = content.addSubcategory(
				groupId,
				categoryId,
				t(localizationConstants.contentNewSubcategoryName),
			);
			setExpanded((previous) => ({ ...previous, [subcategoryId]: true }));
		},
		[content, groupId, t],
	);

	return {
		guide,
		newCategory,
		setNewCategory,
		isExpanded,
		toggle,
		addCategory,
		removeCategory,
		addSubcategory,
	};
}
