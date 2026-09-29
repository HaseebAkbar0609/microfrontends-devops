import { EmployeeOverviewItem, ContractInfo } from "../types/personnelOverview.types";
import { CreateEmployeeFormData } from "../types/createEmployee.types";

/**
 * Builds a complete 5-step profile dataset for an employee.
 * Grounded in the TFS-976 specification and matching screenshot data.
 */
export function getOrCreateEmployeeProfile(employee: EmployeeOverviewItem): {
	formData: CreateEmployeeFormData;
	signedContract: ContractInfo;
} {
	if (employee.details) {
		const signedContract: ContractInfo = employee.signedContract || {
			signedDate: employee.startDate || "2025-10-05",
			fileName: `${employee.name.replace(/\s+/g, "-")}-Kontrakt.pdf`,
			fileSize: "1.2 MB",
		};
		return { formData: employee.details, signedContract };
	}

	const [firstName = "Johan", ...restName] = employee.name.split(" ");
	const lastName = restName.join(" ") || "Andersson";

	const formData: CreateEmployeeFormData = {
		personalInfo: {
			firstName,
			lastName,
			personalId: employee.idNumber || "1985-05-05-1010",
			workEmail: employee.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@byggbolaget.se`,
			phone: employee.phone || "070-560 50 60",
			privateEmail: `${firstName.toLowerCase()}@gmail.com`,
			address: "Stengatan 10",
			city: employee.location || "Solna",
			postalCode: "171 63",
		},
		bankInfo: {
			bankName: "Swedbank",
			clearingNumber: "6185",
			accountNumber: "4563 5000",
			swishNumber: employee.phone || "070-560 50 60",
			iban: "456390056111",
			bic: "ESBVGSSB",
		},
		taxUnion: {
			taxTable: "32",
			collectiveAgreement: "Yes",
			unionAffiliation: "Unionen",
		},
		workDuties: {
			role: employee.role || "Projektledare",
			category: "Tjänsteman / Kollektiv",
			startDate: employee.startDate || "2026-01-01",
			department: employee.department || "Contract",
			location: employee.location || "Stockholm",
		},
		emergencyContacts: [
			{
				id: `c_${employee.id}_1`,
				firstName: "Scarlett",
				lastName: lastName,
				mobileNumber: "070-5560 80 80",
				privateEmail: "scarlett@gmail.com",
				relation: "Fru",
				comment: "Hon är min primära kontaktperson vid eventuella nödsituationer.",
			},
			{
				id: `c_${employee.id}_2`,
				firstName: "Martin",
				lastName: lastName,
				mobileNumber: "070-560 600",
				privateEmail: "martin@gmail.com",
				relation: "Father",
				comment: "Han är min bästa vän. Vänligen kontakta honom vid akuta situationer.",
			},
		],
		workInfo: {
			workingHours: employee.employmentType === "part_time" ? "20" : "40",
			employmentForm: employee.status === "probation" ? "Provanställning" : "Fast",
			annualVacationDays: "30",
		},
		salaryCompensation: {
			paymentDay: "25:e varje månad",
			hourlyRate: "225",
			grossSalary: `${employee.monthlyCost || 35000} kr`,
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
			coverageStartDate: employee.startDate || "2026-01-01",
			mandatoryMedicalCheckRequired: true,
			wellnessAllowance: true,
			wellnessAmount: "500",
		},
		uploadedCompetenceTags: ["Document 1.pdf", "Document 2.doc"],
		competenceDocs: [
			{
				id: `cmp_${employee.id}_1`,
				date: "2024-05-10",
				name: "Arbetsbeskrivning",
				validity: "Tillsvidare",
				fileName: "Arbetsbeskrivning.doc",
				fileType: "doc",
			},
			{
				id: `cmp_${employee.id}_2`,
				date: "2024-05-10",
				name: "Policy",
				validity: "Tillsvidare",
				fileName: "Policy.pdf",
				fileType: "pdf",
			},
		],
		documentsConfig: {
			employeeHandbook: "Personal bok 1",
			policy: "Bil-policy",
			jobDescription: employee.role || "Projektledare",
		},
		uploadedDocumentTags: ["Document 1.pdf", "Document 2.doc"],
		attachedDocs: [
			{
				id: `doc_${employee.id}_1`,
				date: "2024-05-10",
				name: "Arbetsbeskrivning",
				fileFormat: "doc",
			},
			{
				id: `doc_${employee.id}_2`,
				date: "2024-05-10",
				name: "Policly",
				fileFormat: "pdf",
			},
		],
	};

	const signedContract: ContractInfo = {
		signedDate: "2025-10-05",
		fileName: `${employee.name.replace(/\s+/g, "-")}-Kontrakt.pdf`,
		fileSize: "1.4 MB",
	};

	return { formData, signedContract };
}
