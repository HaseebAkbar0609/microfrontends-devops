import { CreateEmployeeFormData } from "../types/createEmployee.types";

export const TOTAL_CREATE_EMPLOYEE_STEPS = 5;

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
		city: "",
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
		category: "",
		startDate: "",
		department: "",
		location: "",
	},
	emergencyContacts: [
		{
			id: "c-1",
			firstName: "",
			lastName: "",
			mobileNumber: "",
			privateEmail: "",
			relation: "",
			comment: "",
		},
	],
	workInfo: {
		workingHours: "",
		employmentForm: "",
		annualVacationDays: "",
	},
	salaryCompensation: {
		paymentDay: "",
		hourlyRate: "",
		grossSalary: "",
		overtimeCompensation: false,
		travelCompensation: false,
	},
	workingHours: {
		startWorkDay: "",
		endWorkDay: "",
		startFlexTime: "",
		endFlexTime: "",
	},
	healthSupport: {
		workEnvironmentProvider: "",
		coverageStartDate: "",
		mandatoryMedicalCheckRequired: false,
		wellnessAllowance: false,
		wellnessAmount: "",
	},
	uploadedCompetenceTags: [],
	competenceDocs: [],
	documentsConfig: {
		employeeHandbook: "",
		policy: "",
		jobDescription: "",
	},
	uploadedDocumentTags: [],
	attachedDocs: [],
};
