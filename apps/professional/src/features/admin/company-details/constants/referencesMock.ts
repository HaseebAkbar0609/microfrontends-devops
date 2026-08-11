export interface CompanyReference {
	id: string;
	project: string;
	customer: string;
	municipality: string;
	contact: string;
	phone: string;
	fileName: string;
}

// Mock rows are intentionally plain data (not i18n) — the backend will
// provide real company references once its API exists.
export const COMPANY_REFERENCES: CompanyReference[] = [
	{
		id: "ref-1",
		project: "Projekt Namn",
		customer: "Anna Hanson",
		municipality: "Boston",
		contact: "annahanson@email.com",
		phone: "093-808-489",
		fileName: "file name",
	},
	{
		id: "ref-2",
		project: "Projekt Namn",
		customer: "Anna Hanson",
		municipality: "Boston",
		contact: "annahanson@email.com",
		phone: "093-808-489",
		fileName: "file name",
	},
	{
		id: "ref-3",
		project: "Projekt Namn",
		customer: "Anna Hanson",
		municipality: "Boston",
		contact: "annahanson@email.com",
		phone: "093-808-489",
		fileName: "file name",
	},
	{
		id: "ref-4",
		project: "Projekt Namn",
		customer: "Anna Hanson",
		municipality: "Boston",
		contact: "annahanson@email.com",
		phone: "093-808-489",
		fileName: "file name",
	},
];

export const REFERENCE_ALLOWED_TYPES = [".png", ".jpg", ".jpeg", ".pdf"];
