import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { CONSULTANT_TYPE_LIMITS } from "../constants/content.constants";
import type { ConsultantType, ConsultantTypeInput } from "../types";

function requiredText(maxLength: number) {
	return z
		.string()
		.trim()
		.min(1, { message: localizationConstants.contentValidationRequired })
		.max(maxLength, { message: localizationConstants.contentValidationTooLong });
}

/**
 * Mirrors the server's limits so a type it would refuse is caught inline.
 * Bullets are objects because `useFieldArray` cannot key an array of strings.
 */
export const consultantTypeSchema = z.object({
	name: requiredText(CONSULTANT_TYPE_LIMITS.nameLength),
	sections: z
		.array(
			z.object({
				title: requiredText(CONSULTANT_TYPE_LIMITS.sectionTitleLength),
				bullets: z
					.array(z.object({ text: requiredText(CONSULTANT_TYPE_LIMITS.bulletLength) }))
					.max(CONSULTANT_TYPE_LIMITS.bulletsPerSection, {
						message: localizationConstants.contentConsultantTypeBulletLimit,
					}),
			}),
		)
		.max(CONSULTANT_TYPE_LIMITS.sections, {
			message: localizationConstants.contentConsultantTypeSectionLimit,
		}),
});

export type ConsultantTypeFormValues = z.infer<typeof consultantTypeSchema>;
export type ConsultantTypeSectionValues = ConsultantTypeFormValues["sections"][number];

export const EMPTY_CONSULTANT_TYPE: ConsultantTypeFormValues = {
	name: "",
	sections: [],
};

/** A new section opens with one empty bullet, the usual next thing to type. */
export function createEmptySection(): ConsultantTypeSectionValues {
	return { title: "", bullets: [{ text: "" }] };
}

export function toConsultantTypeForm(type: ConsultantType): ConsultantTypeFormValues {
	return {
		name: type.name,
		sections: type.sections.map((section) => ({
			title: section.title,
			bullets: section.bullets.map((text) => ({ text })),
		})),
	};
}

export function toConsultantTypeInput(values: ConsultantTypeFormValues): ConsultantTypeInput {
	return {
		name: values.name,
		sections: values.sections.map((section) => ({
			title: section.title,
			bullets: section.bullets.map((bullet) => bullet.text),
		})),
	};
}
