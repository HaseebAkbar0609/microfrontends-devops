import { z } from "zod";

export const createAgreementSchema = z.object({
	avdelning: z.string().min(1, "validationDepartmentRequired"),
	objekt: z.string().min(1, "validationObjectRequired"),
	ansvarig: z.string().optional(),
	anteckning: z.string().optional(),
	startdatum: z.string().min(1, "validationStartDateRequired"),
	slutdatum: z.string().optional(),
	aktionsdatum: z.string().optional(),
	paminnelseDatum: z.string().optional(),
	paminnelseText: z.string().optional(),
	avtalsprioritet: z.string().optional(),
	fornamn: z.string().optional(),
	efternamn: z.string().optional(),
	mail: z.string().optional(),
	mobil: z.string().optional(),
	roll: z.string().optional(),
});

export type CreateAgreementFormData = z.infer<typeof createAgreementSchema>;

export interface AgreementContact {
	id: string;
	fornamn: string;
	efternamn: string;
	mail: string;
	mobil: string;
	roll: string;
}

export interface AgreementDocument {
	id: string;
	datum: string;
	namn: string;
	fil: string;
	type: "pdf" | "doc";
}

export type CreateAgreementFullData = CreateAgreementFormData & {
	id?: string | null;
	contacts: AgreementContact[];
	documents: AgreementDocument[];
};
