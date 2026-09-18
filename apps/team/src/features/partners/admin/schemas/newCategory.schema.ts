import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { PARTNER_CATEGORY_TYPES } from "../constants/partners";

/** A category partners can be placed in. Messages are translation keys. */
export const newCategorySchema = z.object({
	category: z.string().trim().min(1, localizationConstants.partnerCategoryNameRequired),
	type: z.enum(PARTNER_CATEGORY_TYPES),
});

export type NewCategoryValues = z.infer<typeof newCategorySchema>;

export const EMPTY_NEW_CATEGORY: NewCategoryValues = {
	category: "",
	type: PARTNER_CATEGORY_TYPES[0],
};
