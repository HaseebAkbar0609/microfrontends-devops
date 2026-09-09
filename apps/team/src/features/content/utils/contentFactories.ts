import {
	CONTENT_ROW_ID_PREFIX,
	GUIDE_CATEGORY_ID_PREFIX,
	GUIDE_ENTRY_ID_PREFIX,
	GUIDE_SUBCATEGORY_ID_PREFIX,
} from "../constants/content.constants";
import type { GuideCategory, GuideEntry, GuideSubcategory } from "../types";

/**
 * Ids are generated in event handlers only — never during render — so the
 * server and the client can never disagree about them.
 */

let sequence = 0;

function nextId(prefix: string): string {
	sequence += 1;
	return `${prefix}-${Date.now().toString(36)}-${sequence}`;
}

export function createRowId(): string {
	return nextId(CONTENT_ROW_ID_PREFIX);
}

export function createGuideCategory(name: string): GuideCategory {
	return { id: nextId(GUIDE_CATEGORY_ID_PREFIX), name, subcategories: [] };
}

export function createGuideSubcategory(name: string): GuideSubcategory {
	return { id: nextId(GUIDE_SUBCATEGORY_ID_PREFIX), name, entries: [] };
}

export function createGuideEntry(title = ""): GuideEntry {
	return {
		id: nextId(GUIDE_ENTRY_ID_PREFIX),
		title,
		text: "",
		images: [],
		screenshots: [],
		video: [],
	};
}
