export type CreateEmployeeStep = 1 | 2 | 3 | 4 | 5;

export interface PersonalInfoForm {
	firstName: string;
	lastName: string;
	personalId: string;
	workEmail: string;
	phone: string;
	privateEmail: string;
	address: string;
	city: string;
	postalCode: string;
}

export interface BankInfoForm {
	bankName: string;
	clearingNumber: string;
	accountNumber: string;
	swishNumber: string;
	iban: string;
	bic: string;
}

export interface TaxUnionForm {
	taxTable: string;
	collectiveAgreement: string;
	unionAffiliation: string;
}

export interface WorkDutiesForm {
	role: string;
	category: string;
	startDate: string;
	department: string;
	location: string;
}

export interface EmergencyContactItem {
	id: string;
	firstName: string;
	lastName: string;
	mobileNumber: string;
	privateEmail: string;
	relation: string;
	comment: string;
}

export interface WorkInfoForm {
	workingHours: string;
	employmentForm: string;
	annualVacationDays: string;
}

export interface SalaryCompensationForm {
	paymentDay: string;
	hourlyRate: string;
	grossSalary: string;
	overtimeCompensation: boolean;
	travelCompensation: boolean;
}

export interface WorkingHoursForm {
	startWorkDay: string;
	endWorkDay: string;
	startFlexTime: string;
	endFlexTime: string;
}

export interface HealthSupportForm {
	workEnvironmentProvider: string;
	coverageStartDate: string;
	mandatoryMedicalCheckRequired: boolean;
	wellnessAllowance: boolean;
	wellnessAmount: string;
}

export interface CompetenceDocItem {
	id: string;
	date: string;
	name: string;
	validity: string;
	fileName: string;
	fileType: string;
}

export interface EmployeeDocumentsForm {
	employeeHandbook: string;
	policy: string;
	jobDescription: string;
}

export interface AttachedDocItem {
	id: string;
	date: string;
	name: string;
	fileFormat: string;
	fileUrl?: string;
}

export interface CreateEmployeeFormData {
	// Step 1
	personalInfo: PersonalInfoForm;
	bankInfo: BankInfoForm;
	taxUnion: TaxUnionForm;
	workDuties: WorkDutiesForm;
	// Step 2
	emergencyContacts: EmergencyContactItem[];
	// Step 3
	workInfo: WorkInfoForm;
	salaryCompensation: SalaryCompensationForm;
	workingHours: WorkingHoursForm;
	healthSupport: HealthSupportForm;
	// Step 4
	uploadedCompetenceTags: string[];
	competenceDocs: CompetenceDocItem[];
	// Step 5
	documentsConfig: EmployeeDocumentsForm;
	uploadedDocumentTags: string[];
	attachedDocs: AttachedDocItem[];
}
