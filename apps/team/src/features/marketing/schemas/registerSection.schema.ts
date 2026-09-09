import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import type {
	MarketingRowValues,
	MarketingSection,
} from "../types";

/** Route segments are lowercase slugs. */
const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/;

/** Every field is edited as text; number fields are converted on submit. */
export type RegisterFormValues = Record<string, string>;

/** Only http(s) links are rendered as anchors, and never as `javascript:`. */
export function isSafeHttpUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

/**
 * Builds a schema from a register's field config.
 *
 * The prototype validated one field for truthiness and raised a toast; the
 * team app validates with zod and renders the message inline under the field
 * that failed. The first field is the record's title, so it is the one that is
 * required — everything else may legitimately be blank.
 */
export function buildRegisterSchema(section: MarketingSection) {
	const shape: Record<string, z.ZodTypeAny> = {};

	section.fields.forEach((field, index) => {
		const text = z.string().trim();
		let rule: z.ZodTypeAny =
			index === 0
				? text.min(1, {
						message: localizationConstants.marketingValidationRequired,
					})
				: text;

		if (field.type === "number") {
			rule = rule.refine(
				(value: string) => value === "" || Number.isFinite(Number(value)),
				{ message: localizationConstants.marketingValidationNumber },
			);
		}

		if (field.type === "url") {
			rule = rule.refine(
				(value: string) => value === "" || isSafeHttpUrl(value),
				{ message: localizationConstants.marketingValidationUrl },
			);
		}

		shape[field.name] = rule;
	});

	return z.object(shape);
}

/** Empty draft for a register, kept next to the schema it is validated against. */
export function buildEmptyValues(section: MarketingSection): RegisterFormValues {
	const values: RegisterFormValues = {};
	for (const field of section.fields) values[field.name] = "";
	return values;
}

/** Stored row -> form draft. Fills any field the row omits, so nothing goes uncontrolled. */
export function toFormValues(
	section: MarketingSection,
	values: MarketingRowValues,
): RegisterFormValues {
	const draft = buildEmptyValues(section);
	for (const field of section.fields) {
		const value = values[field.name];
		if (value !== undefined && value !== null) draft[field.name] = String(value);
	}
	return draft;
}

/** Form draft -> stored row. Number fields become numbers so the KPIs can sum them. */
export function toRowValues(
	section: MarketingSection,
	values: RegisterFormValues,
): MarketingRowValues {
	const row: MarketingRowValues = {};
	for (const field of section.fields) {
		const raw = values[field.name] ?? "";
		row[field.name] =
			field.type === "number" && raw !== "" ? Number(raw) : raw.trim();
	}
	return row;
}

export const marketingSlugSchema = z.string().regex(SLUG_PATTERN);

export function parseMarketingSlug(value: string): string | null {
	const result = marketingSlugSchema.safeParse(value);
	return result.success ? result.data : null;
}
