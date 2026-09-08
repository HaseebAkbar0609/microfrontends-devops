"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
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
import { DEFAULT_CREATE_EMPLOYEE_DATA } from "../constants/createEmployee.constants";

export function useCreateEmployee() {
	const { t } = useTranslation();
	const router = useRouter();

	const [activeStep, setActiveStep] = useState<CreateEmployeeStep>(1);
	const [formData, setFormData] = useState<CreateEmployeeFormData>(DEFAULT_CREATE_EMPLOYEE_DATA);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);

	// Field Updaters
	const updatePersonalInfo = useCallback((field: keyof PersonalInfoForm, value: string) => {
		setFormData((prev) => ({
			...prev,
			personalInfo: { ...prev.personalInfo, [field]: value },
		}));
		setValidationError(null);
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
				const { firstName, lastName, personalId, workEmail } = formData.personalInfo;
				const { role } = formData.workDuties;
				if (!firstName.trim() || !lastName.trim() || !personalId.trim() || !workEmail.trim() || !role.trim()) {
					setValidationError(t(localizationConstants.validationErrorRequired));
					return false;
				}
			}
			setValidationError(null);
			return true;
		},
		[formData.personalInfo, formData.workDuties, t]
	);

	const handleNextStep = useCallback(() => {
		if (!validateStep(activeStep)) {
			return;
		}
		if (activeStep < 5) {
			setActiveStep((prev) => (prev + 1) as CreateEmployeeStep);
		}
	}, [activeStep, validateStep]);

	const handlePrevStep = useCallback(() => {
		if (activeStep > 1) {
			setActiveStep((prev) => (prev - 1) as CreateEmployeeStep);
		}
	}, [activeStep]);

	const handleSave = useCallback(() => {
		if (!validateStep(1)) {
			setActiveStep(1);
			return;
		}
		toast.success(t(localizationConstants.toastEmployeeCreated));
		router.push("/module/financial-management/personnel/overview");
	}, [validateStep, t, router]);

	const handleCancel = useCallback(() => {
		setIsCancelDialogOpen(true);
	}, []);

	const confirmCancel = useCallback(() => {
		setIsCancelDialogOpen(false);
		router.push("/module/financial-management/personnel/overview");
	}, [router]);

	const closeCancelDialog = useCallback(() => {
		setIsCancelDialogOpen(false);
	}, []);

	return {
		activeStep,
		setActiveStep,
		formData,
		validationError,
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
