import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { AccessSortField, AccessStatusId, AccessTypeId } from "../types/access.types";

export const ACCESS_DEFAULT_PAGE_SIZE = 10;

const ACCESS_SORT_FIELDS: AccessSortField[] = [
	"idNumber",
	"objectRef",
	"name",
	"type",
	"city",
	"assignedTo",
	"lastAssignedAt",
	"status",
];

/** The table reports the clicked column as a plain string; this narrows it. */
export function isAccessSortField(value: string): value is AccessSortField {
	return (ACCESS_SORT_FIELDS as string[]).includes(value);
}

/** Shown in a cell that has no value (a row not tied to a project, never assigned). */
export const ACCESS_EMPTY_CELL = "–";

export const ACCESS_TYPE_IDS: AccessTypeId[] = ["accessCard", "keys", "passCard", "tag"];

export const ACCESS_STATUS_IDS: AccessStatusId[] = ["active", "scheduled", "inProgress"];

export const ACCESS_TYPE_LABELS: Record<AccessTypeId, TranslationKeys> = {
	accessCard: localizationConstants.accessTypeAccessCard,
	keys: localizationConstants.accessTypeKeys,
	passCard: localizationConstants.accessTypePassCard,
	tag: localizationConstants.accessTypeTag,
};

export const ACCESS_STATUS_LABELS: Record<AccessStatusId, TranslationKeys> = {
	active: localizationConstants.accessStatusActive,
	scheduled: localizationConstants.accessStatusScheduled,
	inProgress: localizationConstants.accessStatusInProgress,
};

/** Solid fills as in the Figma status badges (green, orange, blue). */
export const ACCESS_STATUS_CLASSES: Record<AccessStatusId, string> = {
	active: "bg-green-600",
	scheduled: "bg-orange-500",
	inProgress: "bg-blue-500",
};
