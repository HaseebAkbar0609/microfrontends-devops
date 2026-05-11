import { z } from "zod"

export const bankSchema = z.object({
  taxTable: z.string().min(1, "Tax table is required"),
	bank: z.string().min(1, "Bank is required"),
	bankAccountNumber: z.string().min(4, "Bank account number is required"),
	iban: z.string().min(10, "Invalid IBAN"),
	swish: z.string().min(6, "Invalid swish number"),
	swift: z.string().min(6, "Invalid SWIFT/BIC"),
})

export type BankFormValues = z.infer<typeof bankSchema>