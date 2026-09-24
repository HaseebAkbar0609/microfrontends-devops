import { Translate } from "@/utils/translation/translate";
import { MEETING_CATEGORIES, MEETING_CATEGORY_LABELS, PROTOCOL_TYPE_LABELS, PROTOCOL_TYPES } from "../projectProtocol.config";

/* Module constants: each label is rendered in the reader's language. */

/** Typ — the protocol types, as the list's column and filter name them. */
export const TYPE_OPTIONS = PROTOCOL_TYPES.map((value) => ({
	value,
	label: <Translate text={PROTOCOL_TYPE_LABELS[value]} />,
}));

/** Kategori. */
export const CATEGORY_OPTIONS = MEETING_CATEGORIES.map((value) => ({
	value,
	label: <Translate text={MEETING_CATEGORY_LABELS[value]} />,
}));
