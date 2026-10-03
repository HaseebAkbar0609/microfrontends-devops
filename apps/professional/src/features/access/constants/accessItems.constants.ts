import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { AccessDocumentFileType } from "../types/accessItemDetails.types";
import type { AccessItemSortField, AccessItemStatusId } from "../types/accessItems.types";

export const ACCESS_ITEM_STATUS_IDS: AccessItemStatusId[] = ["active", "returned"];

/** File format names are not translated. */
export const ACCESS_DOCUMENT_TYPE_LABELS: Record<AccessDocumentFileType, string> = { pdf: "PDF" };

export const ACCESS_ITEM_STATUS_LABELS: Record<AccessItemStatusId, TranslationKeys> = {
	active: localizationConstants.accessStatusActive,
	returned: localizationConstants.accessItemStatusReturned,
};

/** Solid fills as in the Figma status badges (green, blue). */
export const ACCESS_ITEM_STATUS_CLASSES: Record<AccessItemStatusId, string> = {
	active: "bg-green-500",
	returned: "bg-blue-500",
};

const ACCESS_ITEM_SORT_FIELDS: AccessItemSortField[] = [
	"nycId",
	"regNo",
	"type",
	"accessTo",
	"startDate",
	"endDate",
	"status",
];

/** The table reports the clicked column as a plain string; this narrows it. */
export function isAccessItemSortField(value: string): value is AccessItemSortField {
	return (ACCESS_ITEM_SORT_FIELDS as string[]).includes(value);
}
