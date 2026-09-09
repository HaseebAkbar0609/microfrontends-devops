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
		firstName: "",
		lastName: "",
		personalId: "",
		workEmail: "",
		phone: "",
		privateEmail: "",
		address: "",
		city: "Solna",
		postalCode: "",
	},
	bankInfo: {
		bankName: "",
		clearingNumber: "",
		accountNumber: "",
		swishNumber: "",
		iban: "",
		bic: "",
	},
	taxUnion: {
		taxTable: "",
		collectiveAgreement: "",
		unionAffiliation: "",
	},
	workDuties: {
		role: "",
		category: "Tjänsteman / Kollektiv",
		startDate: "",
		department: "Construction",
		location: "Stockholm",
	},
	emergencyContacts: [
		{
			id: "c-1",
			firstName: "",
			lastName: "",
			mobileNumber: "",
			privateEmail: "",
			relation: "Fru",
			comment: "",
		},
	],
	workInfo: {
		workingHours: "40",
		employmentForm: "Fast",
		annualVacationDays: "30",
	},
	salaryCompensation: {
		paymentDay: "25:e varje månad",
		hourlyRate: "",
		grossSalary: "",
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
		coverageStartDate: "",
		mandatoryMedicalCheckRequired: true,
		wellnessAllowance: true,
		wellnessAmount: "500",
	},
	uploadedCompetenceTags: [],
	competenceDocs: [],
	documentsConfig: {
		employeeHandbook: "Personal bok 1",
		policy: "Bil-policy",
		jobDescription: "",
	},
	uploadedDocumentTags: [],
	attachedDocs: [],
};
