import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { MEDIA_FIELD_TYPES } from "../constants/content.constants";
import type {
	ContentField,
	ContentFieldType,
	ContentRowValues,
	ContentSection,
} from "../types";

/** Route segments are lowercase slugs. */
const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/;

export function isMediaField(type: ContentFieldType): boolean {
	return (MEDIA_FIELD_TYPES as readonly string[]).includes(type);
}

/**
 * Builds a schema from a section's field config.
 *
 * The prototype validated with a single truthiness check on the first field and
 * a toast; the ticket asks for zod plus inline errors, and the rest of the app
 * already works that way. The first field is the row's title, so it is the one
 * required field.
 */
export function buildSectionSchema(section: ContentSection) {
	const shape: Record<string, z.ZodTypeAny> = {};

	section.fields.forEach((field, index) => {
		if (isMediaField(field.type)) {
			shape[field.name] = z.array(z.string());
			return;
		}
		const base = z.string().trim();
		shape[field.name] =
			index === 0
				? base.min(1, {
						message: localizationConstants.contentValidationRequired,
					})
				: base;
	});

	return z.object(shape);
}

/** Empty draft for a section, kept next to the schema it is validated against. */
export function buildEmptyValues(section: ContentSection): ContentRowValues {
	const values: ContentRowValues = {};
	for (const field of section.fields) {
		values[field.name] = isMediaField(field.type) ? [] : "";
	}
	return values;
}

/** Fills any field the stored row omits, so the form is never uncontrolled. */
export function normaliseValues(
	section: ContentSection,
	values: ContentRowValues,
): ContentRowValues {
	return { ...buildEmptyValues(section), ...values };
}

export function getPrimaryField(section: ContentSection): ContentField | null {
	return section.fields[0] ?? null;
}

export const contentSlugSchema = z.string().regex(SLUG_PATTERN);

export function parseContentSlug(value: string): string | null {
	const result = contentSlugSchema.safeParse(value);
	return result.success ? result.data : null;
}
