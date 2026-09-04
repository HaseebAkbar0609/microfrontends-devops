import { z } from "zod";

/**
 * Zod validation schema for Machine Purchase Creation (TFS-812)
 */
export const purchaseCreateSchema = z.object({
	number: z.string().trim().min(1, "Nummer är obligatoriskt"),
	type: z.string().trim().min(1, "Välj en maskintyp"),
	brand: z.string().trim().min(1, "Fabrikat är obligatoriskt"),
	designation: z.string().trim().min(1, "Beteckning är obligatoriskt"),
	price: z
		.string()
		.trim()
		.min(1, "Pris är obligatoriskt")
		.refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
			message: "Ange ett giltigt positivt pris",
		}),
	quantity: z
		.string()
		.optional()
		.refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
			message: "Ange ett giltigt antal",
		}),
	supplier: z.string().trim().min(1, "Leverantör är obligatoriskt"),
	address: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	phone: z.string().optional(),
	email: z
		.string()
		.optional()
		.refine((val) => !val || /^\S+@\S+\.\S+$/.test(val), {
			message: "Ogiltig e-postadress",
		}),
	additionalInfo: z.string().optional(),
});

export type PurchaseCreateFormValues = z.infer<typeof purchaseCreateSchema>;
