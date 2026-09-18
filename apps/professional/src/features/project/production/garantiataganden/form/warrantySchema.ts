import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { WARRANTY_NAME_MAX_LENGTH } from "../projectWarranty.config";

const M = localizationConstants;

/** The frame's two fields. Messages are translation keys. */
export const warrantySchema = z.object({
	date: z.string().min(1, M.projectWarrantyDateRequired),
	name: z.string().trim().min(1, M.projectWarrantyNameRequired).max(WARRANTY_NAME_MAX_LENGTH, M.projectWarrantyTooLong),
});

export type WarrantyFormValues = z.infer<typeof warrantySchema>;

export const EMPTY_WARRANTY: WarrantyFormValues = { date: "", name: "" };
