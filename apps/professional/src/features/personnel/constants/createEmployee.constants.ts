import { CreateEmployeeFormData } from "../types/createEmployee.types";

export const CITY_OPTIONS = [
	"Solna",
	"Stockholm",
	"Göteborg",
	"Malmö",
	"Uppsala",
	"Västerås",
] as const;

export const CATEGORY_OPTIONS = [
	"Tjänsteman / Kollektiv",
	"Tjänsteman",
	"Kollektiv",
] as const;

export const DEPARTMENT_OPTIONS = [
	"Construction",
	"Installation",
	"Ekonomi",
	"HR",
	"Projektledning",
	"Lager",
] as const;

export const LOCATION_OPTIONS = [
	"Stockholm",
	"Göteborg",
	"Malmö",
	"Uppsala",
	"Västerås",
	"Solna",
] as const;

export const RELATION_OPTIONS = [
	"Fru",
	"Make",
	"Sambo",
	"Far",
	"Mor",
	"Barn",
	"Syskon",
	"Annan",
] as const;

export const EMPLOYMENT_FORM_OPTIONS = [
	"Fast",
	"Visstid",
	"Provanställning",
	"Timanställning",
	"Konsult",
] as const;

export const HEALTH_PROVIDER_OPTIONS = [
	"AXA - Global Hälsovård",
	"Feelgood",
	"Previa",
	"Falck Hälsa",
] as const;

export const HANDBOOK_OPTIONS = [
	"Personal bok 1",
	"Personalhandbok 2026",
	"Standard handbok",
] as const;

export const POLICY_OPTIONS = [
	"Bil-policy",
	"IT-policy",
	"Arbetsmiljöpolicy",
	"Säkerhetspolicy",
] as const;

export const JOB_DESCRIPTION_OPTIONS = [
	"Projektledare",
	"Snickare",
	"Elektriker",
	"Tekniker",
	"HR-koordinator",
] as const;

export const DEFAULT_CREATE_EMPLOYEE_DATA: CreateEmployeeFormData = {
	personalInfo: {
		firstName: "Johan",
		lastName: "Andersson",
		personalId: "1985-05-05-1010",
		workEmail: "info@byggochhantverk.se",
		phone: "070-560 50 60",
		privateEmail: "johan@gmail.com",
		address: "Storgatan 15",
		city: "Solna",
		postalCode: "171 63",
	},
	bankInfo: {
		bankName: "Swedbank",
		clearingNumber: "6165",
		accountNumber: "4960 5900",
		swishNumber: "070-560 50 60",
		iban: "SE628105604671",
		bic: "SWEDESS",
	},
	taxUnion: {
		taxTable: "30",
		collectiveAgreement: "1161",
		unionAffiliation: "Unionen",
	},
	workDuties: {
		role: "Projektledare",
		category: "Tjänsteman / Kollektiv",
		startDate: "2026-01-01",
		department: "Construction",
		location: "Stockholm",
	},
	emergencyContacts: [
		{
			id: "c-1",
			firstName: "Scarlett",
			lastName: "Andersson",
			mobileNumber: "070-560 50 50",
			privateEmail: "scarlett@gmail.com",
			relation: "Fru",
			comment: "Hon är min primära kontaktperson vid eventuella nödsituationer.",
		},
		{
			id: "c-2",
			firstName: "Martin",
			lastName: "Andersson",
			mobileNumber: "070-560 60 60",
			privateEmail: "martin@gmail.com",
			relation: "Far",
			comment: "Han är min bästa vän. Vänligen kontakta honom vid akuta situationer.",
		},
	],
	workInfo: {
		workingHours: "40",
		employmentForm: "Fast",
		annualVacationDays: "30",
	},
	salaryCompensation: {
		paymentDay: "25:e varje månad",
		hourlyRate: "150 kr",
		grossSalary: "45 000",
		overtimeCompensation: true,
		travelCompensation: true,
	},
	workingHours: {
		startWorkDay: "Måndag",
		endWorkDay: "Fredag",
		startFlexTime: "07:00 - 09:00",
		endFlexTime: "16:00 - 18:00",
	},
	healthSupport: {
		workEnvironmentProvider: "AXA - Global Hälsovård",
		coverageStartDate: "2025-05-08",
		mandatoryMedicalCheckRequired: true,
		wellnessAllowance: true,
		wellnessAmount: "500",
	},
	uploadedCompetenceTags: ["Document 1.pdf", "Document 2.doc"],
	competenceDocs: [
		{
			id: "cmp-1",
			date: "2024-05-10",
			name: "Arbetsbeskrivning",
			validity: "2026-01-01",
			fileName: "Document 1.pdf",
			fileType: "PDF",
		},
		{
			id: "cmp-2",
			date: "2024-05-10",
			name: "Policy",
			validity: "2026-08-01",
			fileName: "Document 2.doc",
			fileType: "PDF",
		},
	],
	documentsConfig: {
		employeeHandbook: "Personal bok 1",
		policy: "Bil-policy",
		jobDescription: "Projektledare",
	},
	uploadedDocumentTags: ["Document 1.pdf", "Document 2.doc"],
	attachedDocs: [
		{
			id: "doc-1",
			date: "2024-05-10",
			name: "Arbetsbeskrivning",
			fileFormat: "PDF",
		},
		{
			id: "doc-2",
			date: "2024-05-10",
			name: "Policy",
			fileFormat: "PDF",
		},
	],
};
