import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const bankInformationSchema = z.object({
	bank: optionalString,
	accountNumber: optionalString,
	bankgiro: optionalString,
	postgiro: optionalString,
	iban: optionalString,
	bic: optionalString,
	swift: optionalString,
});

export type BankInformationFormValues = z.infer<typeof bankInformationSchema>;
