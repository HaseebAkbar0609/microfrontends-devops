import type { LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";

/** The two dashboards whose content this console administers. */
export type ContentGroupId = "kund" | "workspace";

export type ContentFieldType =
	| "text"
	| "textarea"
	| "select"
	| "image"
	| "images"
	| "video"
	| "date";

/**
 * A select option is both stored value and display text, so the two are kept
 * apart: `id` is written to the row, `labelKey` is what the user reads. Storing
 * the label instead would corrupt saved rows on a language change.
 */
export type ContentSelectOption = {
	id: string;
	labelKey: TranslationKeys;
};

export type ContentField = {
	name: string;
	labelKey: TranslationKeys;
	type: ContentFieldType;
	placeholderKey?: TranslationKeys;
	options?: ContentSelectOption[];
};

export type ContentSection = {
	slug: string;
	titleKey: TranslationKeys;
	summaryKey: TranslationKeys;
	icon: LucideIcon;
	/** Singular noun for one row, e.g. "inlägg". */
	itemLabelKey: TranslationKeys;
	/** Explicit plural; the prototype appended "er" and produced "inlägger". */
	itemLabelPluralKey: TranslationKeys;
	/** Renders the help-guide editor instead of the generic list and form. */
	variant?: "support";
	/** Adds the video field to each guide entry. */
	guideMedia?: boolean;
	fields: ContentField[];
};

/**
 * One row's values. Media fields hold a real array — the prototype packed them
 * into a single "|||"-joined string so every value could be typed `string`.
 */
export type ContentRowValue = string | string[];
export type ContentRowValues = Record<string, ContentRowValue>;

export type ContentRow = {
	id: string;
	values: ContentRowValues;
};

/** Rows are stored per section, keyed `${group}:${slug}`. */
export type ContentRowsBySection = Record<string, ContentRow[]>;

export type GuideEntry = {
	id: string;
	title: string;
	text: string;
	images: string[];
	screenshots: string[];
	video: string[];
};

export type GuideSubcategory = {
	id: string;
	name: string;
	entries: GuideEntry[];
};

export type GuideCategory = {
	id: string;
	name: string;
	subcategories: GuideSubcategory[];
};

export type SupportContact = {
	phone: string;
	email: string;
	hours: string;
};

/** Each group keeps its own contact details and guide tree. */
export type SupportGuideState = {
	contact: SupportContact;
	tree: GuideCategory[];
};

/** Everything the content console exposes to its pages. */
export type ContentContextValue = {
	getRows: (sectionKey: string) => ContentRow[];
	addRow: (sectionKey: string, values: ContentRowValues) => void;
	updateRow: (
		sectionKey: string,
		rowId: string,
		values: ContentRowValues,
	) => void;
	removeRow: (sectionKey: string, rowId: string) => void;

	getGuide: (groupId: ContentGroupId) => SupportGuideState;
	setContact: (groupId: ContentGroupId, contact: SupportContact) => void;
	addCategory: (groupId: ContentGroupId, name: string) => void;
	renameCategory: (
		groupId: ContentGroupId,
		categoryId: string,
		name: string,
	) => void;
	removeCategory: (groupId: ContentGroupId, categoryId: string) => void;
	addSubcategory: (
		groupId: ContentGroupId,
		categoryId: string,
		name: string,
	) => string;
	renameSubcategory: (
		groupId: ContentGroupId,
		categoryId: string,
		subcategoryId: string,
		name: string,
	) => void;
	removeSubcategory: (
		groupId: ContentGroupId,
		categoryId: string,
		subcategoryId: string,
	) => void;
	addEntry: (
		groupId: ContentGroupId,
		categoryId: string,
		subcategoryId: string,
	) => void;
	updateEntry: (
		groupId: ContentGroupId,
		categoryId: string,
		subcategoryId: string,
		entryId: string,
		patch: Partial<GuideEntry>,
	) => void;
	removeEntry: (
		groupId: ContentGroupId,
		categoryId: string,
		subcategoryId: string,
		entryId: string,
	) => void;
};
