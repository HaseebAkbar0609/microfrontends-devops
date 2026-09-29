"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { employeeLevelOf } from "../constants/personnelOverview.constants";
import {
	CreateEmployeeStep,
	CreateEmployeeFormData,
	PersonalInfoForm,
	BankInfoForm,
	TaxUnionForm,
	WorkDutiesForm,
	EmergencyContactItem,
	WorkInfoForm,
	SalaryCompensationForm,
	WorkingHoursForm,
	HealthSupportForm,
	EmployeeDocumentsForm,
	CompetenceDocItem,
	AttachedDocItem,
} from "../types/createEmployee.types";
import { EmployeeOverviewItem } from "../types/personnelOverview.types";
import { DEFAULT_CREATE_EMPLOYEE_DATA } from "../constants/createEmployee.constants";
import { personnelRepository } from "../utils/personnelRepository";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useCreateEmployee() {
	const { t } = useTranslation();
	const router = useRouter();

	const [activeStep, setActiveStep] = useState<CreateEmployeeStep>(1);
	const [formData, setFormData] = useState<CreateEmployeeFormData>(DEFAULT_CREATE_EMPLOYEE_DATA);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Field Updaters
	const updatePersonalInfo = useCallback((field: keyof PersonalInfoForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			personalInfo: { ...prev.personalInfo, [field]: value },
		}));
		setValidationError(null);
		setFieldErrors((prev) => {
			if (!prev[field]) return prev;
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}, []);

	const updateBankInfo = useCallback((field: keyof BankInfoForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			bankInfo: { ...prev.bankInfo, [field]: value },
		}));
	}, []);

	const updateTaxUnion = useCallback((field: keyof TaxUnionForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			taxUnion: { ...prev.taxUnion, [field]: value },
		}));
	}, []);

	const updateWorkDuties = useCallback((field: keyof WorkDutiesForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			workDuties: { ...prev.workDuties, [field]: value },
		}));
		setValidationError(null);
		setFieldErrors((prev) => {
			if (!prev[field]) return prev;
			const next = { ...prev };
			delete next[field];
			return next;
		});
	}, []);

	// Emergency Contacts
	const updateEmergencyContact = useCallback((id: string, field: keyof EmergencyContactItem, value: string) => {
		setFormData((prev) => ({
			...prev,
			emergencyContacts: prev.emergencyContacts.map((c) =>
				c.id === id ? { ...c, [field]: value } : c
			),
		}));
	}, []);

	const addEmergencyContact = useCallback(() => {
		const newContact: EmergencyContactItem = {
			id: `contact-${Date.now()}`,
			firstName: "",
			lastName: "",
			mobileNumber: "",
			privateEmail: "",
			relation: "Fru",
			comment: "",
		};
		setFormData((prev) => ({
			...prev,
			emergencyContacts: [...prev.emergencyContacts, newContact],
		}));
	}, []);

	const removeEmergencyContact = useCallback((id: string) => {
		setFormData((prev) => {
			if (prev.emergencyContacts.length <= 1) return prev;
			return {
				...prev,
				emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
			};
		});
	}, []);

	// Step 3 Updaters
	const updateWorkInfo = useCallback((field: keyof WorkInfoForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			workInfo: { ...prev.workInfo, [field]: value },
		}));
	}, []);

	const updateSalaryCompensation = useCallback(
		<K extends keyof SalaryCompensationForm>(field: K, value: SalaryCompensationForm[K]) => {
			setFormData((prev) => ({
				...prev,
				salaryCompensation: { ...prev.salaryCompensation, [field]: value },
			}));
		},
		[]
	);

	const updateWorkingHours = useCallback((field: keyof WorkingHoursForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			workingHours: { ...prev.workingHours, [field]: value },
		}));
	}, []);

	const updateHealthSupport = useCallback(
		<K extends keyof HealthSupportForm>(field: K, value: HealthSupportForm[K]) => {
			setFormData((prev) => ({
				...prev,
				healthSupport: { ...prev.healthSupport, [field]: value },
			}));
		},
		[]
	);

	// Step 4: Competence
	const removeCompetenceTag = useCallback((tag: string) => {
		setFormData((prev) => ({
			...prev,
			uploadedCompetenceTags: prev.uploadedCompetenceTags.filter((t) => t !== tag),
		}));
	}, []);

	const addCompetenceDoc = useCallback((doc: Omit<CompetenceDocItem, "id">) => {
		const newDoc: CompetenceDocItem = {
			...doc,
			id: `cmp-${Date.now()}`,
		};
		setFormData((prev) => ({
			...prev,
			competenceDocs: [...prev.competenceDocs, newDoc],
		}));
	}, []);

	const removeCompetenceDoc = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			competenceDocs: prev.competenceDocs.filter((d) => d.id !== id),
		}));
	}, []);

	// Step 5: Documents
	const updateDocumentsConfig = useCallback((field: keyof EmployeeDocumentsForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			documentsConfig: { ...prev.documentsConfig, [field]: value },
		}));
	}, []);

	const removeDocumentTag = useCallback((tag: string) => {
		setFormData((prev) => ({
			...prev,
			uploadedDocumentTags: prev.uploadedDocumentTags.filter((t) => t !== tag),
		}));
	}, []);

	const addAttachedDoc = useCallback((doc: Omit<AttachedDocItem, "id">) => {
		const newDoc: AttachedDocItem = {
			...doc,
			id: `doc-${Date.now()}`,
		};
		setFormData((prev) => ({
			...prev,
			attachedDocs: [...prev.attachedDocs, newDoc],
		}));
	}, []);

	const removeAttachedDoc = useCallback((id: string) => {
		setFormData((prev) => ({
			...prev,
			attachedDocs: prev.attachedDocs.filter((d) => d.id !== id),
		}));
	}, []);

	// Validation
	const validateStep = useCallback(
		(step: CreateEmployeeStep): boolean => {
			if (step === 1) {
				const errors: Record<string, string> = {};
				const { firstName, lastName, personalId, workEmail, privateEmail } = formData.personalInfo;
				const { role } = formData.workDuties;

				if (!firstName.trim()) {
					errors.firstName = t(localizationConstants.validationErrorRequiredField);
				}
				if (!lastName.trim()) {
					errors.lastName = t(localizationConstants.validationErrorRequiredField);
				}
				if (!personalId.trim()) {
					errors.personalId = t(localizationConstants.validationErrorRequiredField);
				}
				if (!workEmail.trim()) {
					errors.workEmail = t(localizationConstants.validationErrorRequiredField);
				} else if (!EMAIL_REGEX.test(workEmail.trim())) {
					errors.workEmail = t(localizationConstants.validationErrorEmailInvalid);
				}
				if (privateEmail && privateEmail.trim() && !EMAIL_REGEX.test(privateEmail.trim())) {
					errors.privateEmail = t(localizationConstants.validationErrorEmailInvalid);
				}
				if (!role.trim()) {
					errors.role = t(localizationConstants.validationErrorRequiredField);
				}

				if (Object.keys(errors).length > 0) {
					setFieldErrors(errors);
					setValidationError(t(localizationConstants.validationErrorRequired));
					return false;
				}
			}
			setFieldErrors({});
			setValidationError(null);
			return true;
		},
		[formData.personalInfo, formData.workDuties, t]
	);

	const handleStepClick = useCallback(
		(targetStep: CreateEmployeeStep) => {
			if (targetStep === activeStep) return;

			// If moving away from step 1 to any other step, step 1 mandatory fields must be valid
			if (targetStep > 1) {
				const isStep1Valid = validateStep(1);
				if (!isStep1Valid) {
					setActiveStep(1);
					toast.error(t(localizationConstants.validationErrorRequired));
					return;
				}
			}

			setActiveStep(targetStep);
		},
		[activeStep, validateStep, t]
	);

	const handleNextStep = useCallback(() => {
		if (activeStep === 1 && !validateStep(1)) {
			toast.error(t(localizationConstants.validationErrorRequired));
			return;
		}
		if (activeStep < 5) {
			setActiveStep((prev) => (prev + 1) as CreateEmployeeStep);
		}
	}, [activeStep, validateStep, t]);

	const handlePrevStep = useCallback(() => {
		if (activeStep > 1) {
			setActiveStep((prev) => (prev - 1) as CreateEmployeeStep);
		}
	}, [activeStep]);

	const handleSave = useCallback(async () => {
		if (!validateStep(1)) {
			setActiveStep(1);
			toast.error(t(localizationConstants.validationErrorRequired));
			return;
		}

		setIsSubmitting(true);
		try {
			const { firstName, lastName, personalId, workEmail, phone, city } = formData.personalInfo;
			const { role, department, location, startDate } = formData.workDuties;

			const newEmployee: EmployeeOverviewItem = {
				id: `emp-${Date.now()}`,
				contractNumber: personnelRepository.getNextContractNumber(),
				name: `${firstName.trim()} ${lastName.trim()}`,
				role: role.trim() || "Projektledare",
				idNumber: personalId.trim(),
				status: "active",
				employmentType:
					formData.workInfo.employmentForm === "Timanställning" ||
					formData.workInfo.workingHours !== "40"
						? "part_time"
						: "full_time",
				startDate: startDate || new Date().toISOString().split("T")[0],
				location: location || city || "Stockholm",
				email: workEmail.trim(),
				phone: phone.trim() || "070-123 45 67",
				department: department || "Allmänt",
				level: employeeLevelOf(role),
				/* Step 3 collects the gross salary; it is what the employee costs. */
				monthlyCost: Number(formData.salaryCompensation.grossSalary.replace(/\D/g, "")) || 0,
				details: JSON.parse(JSON.stringify(formData)),
				signedContract: {
					signedDate: startDate || new Date().toISOString().split("T")[0],
					fileName: `${firstName.trim()}-${lastName.trim()}-Kontrakt.pdf`,
					fileSize: "1.2 MB",
				},
			};

			await personnelRepository.addEmployee(newEmployee);
			toast.success(t(localizationConstants.toastEmployeeCreated));
			router.push("/module/financial-management/personnel/overview");
		} catch (e) {
			console.error("Failed to save employee", e);
		} finally {
			setIsSubmitting(false);
		}
	}, [validateStep, formData, t, router]);

	const isDirty = useMemo(() => {
		const { firstName, lastName, personalId, workEmail, phone, privateEmail, address } = formData.personalInfo;
		return Boolean(
			firstName.trim() ||
			lastName.trim() ||
			personalId.trim() ||
			workEmail.trim() ||
			phone.trim() ||
			privateEmail.trim() ||
			address.trim() ||
			formData.workDuties.role.trim()
		);
	}, [formData.personalInfo, formData.workDuties]);

	const handleCancel = useCallback(() => {
		if (isDirty) {
			setIsCancelDialogOpen(true);
		} else {
			router.push("/module/financial-management/personnel/overview");
		}
	}, [isDirty, router]);

	const confirmCancel = useCallback(() => {
		setIsCancelDialogOpen(false);
		router.push("/module/financial-management/personnel/overview");
	}, [router]);

	const closeCancelDialog = useCallback(() => {
		setIsCancelDialogOpen(false);
	}, []);

	return {
		activeStep,
		setActiveStep: handleStepClick,
		handleStepClick,
		formData,
		validationError,
		fieldErrors,
		isSubmitting,
		isCancelDialogOpen,
		updatePersonalInfo,
		updateBankInfo,
		updateTaxUnion,
		updateWorkDuties,
		updateEmergencyContact,
		addEmergencyContact,
		removeEmergencyContact,
		updateWorkInfo,
		updateSalaryCompensation,
		updateWorkingHours,
		updateHealthSupport,
		removeCompetenceTag,
		addCompetenceDoc,
		removeCompetenceDoc,
		updateDocumentsConfig,
		removeDocumentTag,
		addAttachedDoc,
		removeAttachedDoc,
		handleNextStep,
		handlePrevStep,
		handleSave,
		handleCancel,
		confirmCancel,
		closeCancelDialog,
	};
}
