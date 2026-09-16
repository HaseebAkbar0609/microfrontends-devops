import { z } from "zod";
import { ATA_CONSTANTS } from "../constants/ata.constants";

export const createAtaFormSchema = z.object({
	orderId: z.string().default(ATA_CONSTANTS.DEFAULT_ORDER_ID),
	orderer: z.string().trim().min(1, { message: "createAtaValidationOrdererRequired" }),
	ordererName: z.string().trim().optional(),
	address: z.string().trim().optional(),
	postalCode: z.string().trim().optional(),
	city: z.string().trim().optional(),
	eatingNumber: z.string().trim().min(1, { message: "createAtaValidationEatingNoRequired" }),
	title: z.string().trim().min(1, { message: "createAtaValidationTitleRequired" }),
	subTitle: z.string().trim().optional(),
	proposedAction: z.string().trim().optional(),
	action: z.string().trim().optional(),
	qualityStatus: z.string().trim().optional(),
	reason: z.string().trim().optional(),
	economicStatus: z.string().trim().optional(),
	location: z.string().trim().optional(),
	description: z.string().trim().optional(),
	ataType: z.enum([
		ATA_CONSTANTS.TYPES.CHANGE,
		ATA_CONSTANTS.TYPES.ADDITION,
		ATA_CONSTANTS.TYPES.DEDUCTION,
	]).default(ATA_CONSTANTS.TYPES.ADDITION),
	date: z.string().optional(),
	responsible: z.string().optional(),
	amount: z.number().nonnegative().default(0),
	vat: z.number().nonnegative().optional(),
	status: z.enum([
		ATA_CONSTANTS.STATUSES.OK,
		ATA_CONSTANTS.STATUSES.ACCOUNTED,
		ATA_CONSTANTS.STATUSES.NEGOTIATION,
		ATA_CONSTANTS.STATUSES.PENDING,
		ATA_CONSTANTS.STATUSES.APPROVED,
		ATA_CONSTANTS.STATUSES.REJECTED,
		ATA_CONSTANTS.STATUSES.DRAFT,
	]).default(ATA_CONSTANTS.STATUSES.DRAFT),
	supplierInvoices: z.array(z.string()).default([]),
	timeReports: z.array(z.string()).default([]),
});

export type CreateAtaFormSchemaType = z.infer<typeof createAtaFormSchema>;

export function validateCreateAtaForm(data: unknown): {
	isValid: boolean;
	errors: Record<string, string>;
	data?: CreateAtaFormSchemaType;
} {
	const result = createAtaFormSchema.safeParse(data);
	if (!result.success) {
		const errors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const fieldName = issue.path[0];
			if (fieldName && typeof fieldName === "string") {
				errors[fieldName] = issue.message;
			}
		}
		return { isValid: false, errors };
	}
	return { isValid: true, errors: {}, data: result.data };
}
