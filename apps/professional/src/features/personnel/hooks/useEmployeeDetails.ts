"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { EmployeeOverviewItem } from "../types/personnelOverview.types";
import {
	PersonalInfoForm,
	BankInfoForm,
	TaxUnionForm,
	WorkDutiesForm,
	EmergencyContactItem,
	WorkInfoForm,
	SalaryCompensationForm,
	WorkingHoursForm,
	HealthSupportForm,
	CompetenceDocItem,
	AttachedDocItem,
} from "../types/createEmployee.types";
import { PersonalkortTabType } from "../types/equipment.types";
import { personnelRepository } from "../utils/personnelRepository";
import { getOrCreateEmployeeProfile } from "../utils/employeeProfileDefaults";

export function useEmployeeDetails(employeeIdProp?: string) {
	const { t } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryId = searchParams.get("id");
	const tabParam = searchParams.get("tab") as PersonalkortTabType | null;

	const targetId = employeeIdProp || queryId || "emp-001";

	const [allEmployees, setAllEmployees] = useState<EmployeeOverviewItem[]>(() =>
		personnelRepository.getAllEmployees()
	);

	useEffect(() => {
		setAllEmployees(personnelRepository.getAllEmployees());
		const unsubscribe = personnelRepository.subscribe((items: EmployeeOverviewItem[]) => {
			setAllEmployees(items);
		});
		return unsubscribe;
	}, []);

	const currentEmployee = useMemo(() => {
		return allEmployees.find((e) => e.id === targetId) || allEmployees[0] || null;
	}, [allEmployees, targetId]);

	const { formData: profileData, signedContract } = useMemo(() => {
		if (!currentEmployee) {
			return getOrCreateEmployeeProfile({
				id: "emp-fallback",
				contractNumber: "A001",
				name: "Johan Andersson",
				role: "Projektledare",
				idNumber: "1985-05-05-1010",
				status: "active",
				employmentType: "full_time",
				startDate: "2026-01-01",
				location: "Stockholm",
				email: "johan.andersson@byggbolaget.se",
				phone: "070-560 50 60",
				department: "Contract",
				level: "manager",
				monthlyCost: 35000,
			});
		}
		return getOrCreateEmployeeProfile(currentEmployee);
	}, [currentEmployee]);

	const [activeTab, setActiveTab] = useState<PersonalkortTabType>(
		tabParam &&
			[
				"information",
				"kontaktperson",
				"anstallningsvillkor",
				"kompetens",
				"dokument",
				"utrustning_fordon",
			].includes(tabParam)
			? tabParam
			: "information"
	);

	// Modal states
	const [activeEditModal, setActiveEditModal] = useState<string | null>(null);
	const [selectedContactForEdit, setSelectedContactForEdit] =
		useState<EmergencyContactItem | null>(null);
	const [previewDocumentName, setPreviewDocumentName] = useState<string | null>(null);

	// Tab change handler
	const handleTabChange = useCallback(
		(newTab: PersonalkortTabType) => {
			setActiveTab(newTab);
			if (currentEmployee) {
				const params = new URLSearchParams(searchParams.toString());
				params.set("id", currentEmployee.id);
				params.set("tab", newTab);
				router.replace(`?${params.toString()}`, { scroll: false });
			}
		},
		[currentEmployee, router, searchParams]
	);

	// Update individual profile sections
	const handleSavePersonalInfo = useCallback(
		async (personalInfo: PersonalInfoForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { personalInfo });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveBankInfo = useCallback(
		async (bankInfo: BankInfoForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { bankInfo });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveTaxUnion = useCallback(
		async (taxUnion: TaxUnionForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { taxUnion });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveWorkDuties = useCallback(
		async (workDuties: WorkDutiesForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { workDuties });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveWorkInfo = useCallback(
		async (workInfo: WorkInfoForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { workInfo });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveSalaryCompensation = useCallback(
		async (salaryCompensation: SalaryCompensationForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { salaryCompensation });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveWorkingHours = useCallback(
		async (workingHours: WorkingHoursForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { workingHours });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	const handleSaveHealthSupport = useCallback(
		async (healthSupport: HealthSupportForm) => {
			if (!currentEmployee) return;
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, { healthSupport });
			toast.success(t(localizationConstants.toastProfileUpdated));
			setActiveEditModal(null);
		},
		[currentEmployee, t]
	);

	// Emergency contact operations
	const handleAddEmergencyContact = useCallback(
		async (contact: Omit<EmergencyContactItem, "id">) => {
			if (!currentEmployee) return;
			const newContact: EmergencyContactItem = {
				...contact,
				id: `c_${Date.now()}`,
			};
			const updatedContacts = [...profileData.emergencyContacts, newContact];
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				emergencyContacts: updatedContacts,
			});
			toast.success(t(localizationConstants.toastContactAdded));
			setActiveEditModal(null);
		},
		[currentEmployee, profileData.emergencyContacts, t]
	);

	const handleUpdateEmergencyContact = useCallback(
		async (contact: EmergencyContactItem) => {
			if (!currentEmployee) return;
			const updatedContacts = profileData.emergencyContacts.map((c: EmergencyContactItem) =>
				c.id === contact.id ? contact : c
			);
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				emergencyContacts: updatedContacts,
			});
			toast.success(t(localizationConstants.toastContactUpdated));
			setActiveEditModal(null);
			setSelectedContactForEdit(null);
		},
		[currentEmployee, profileData.emergencyContacts, t]
	);

	const handleDeleteEmergencyContact = useCallback(
		async (id: string) => {
			if (!currentEmployee) return;
			const updatedContacts = profileData.emergencyContacts.filter(
				(c: EmergencyContactItem) => c.id !== id
			);
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				emergencyContacts: updatedContacts,
			});
			toast.success(t(localizationConstants.toastContactDeleted));
		},
		[currentEmployee, profileData.emergencyContacts, t]
	);

	// Competence operations
	const handleAddCompetenceDoc = useCallback(
		async (doc: Omit<CompetenceDocItem, "id">) => {
			if (!currentEmployee) return;
			const newDoc: CompetenceDocItem = {
				...doc,
				id: `cmp_${Date.now()}`,
			};
			const updatedDocs = [...profileData.competenceDocs, newDoc];
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				competenceDocs: updatedDocs,
			});
			toast.success(t(localizationConstants.toastCompetenceAdded));
			setActiveEditModal(null);
		},
		[currentEmployee, profileData.competenceDocs, t]
	);

	const handleDeleteCompetenceDoc = useCallback(
		async (id: string) => {
			if (!currentEmployee) return;
			const updatedDocs = profileData.competenceDocs.filter(
				(d: CompetenceDocItem) => d.id !== id
			);
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				competenceDocs: updatedDocs,
			});
			toast.success(t(localizationConstants.toastCompetenceDeleted));
		},
		[currentEmployee, profileData.competenceDocs, t]
	);

	// Documents operations
	const handleAddAttachedDoc = useCallback(
		async (doc: Omit<AttachedDocItem, "id">) => {
			if (!currentEmployee) return;
			const newDoc: AttachedDocItem = {
				...doc,
				id: `doc_${Date.now()}`,
			};
			const updatedDocs = [...profileData.attachedDocs, newDoc];
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				attachedDocs: updatedDocs,
			});
			toast.success(t(localizationConstants.toastDocumentUploaded));
			setActiveEditModal(null);
		},
		[currentEmployee, profileData.attachedDocs, t]
	);

	const handleDeleteAttachedDoc = useCallback(
		async (id: string) => {
			if (!currentEmployee) return;
			const updatedDocs = profileData.attachedDocs.filter(
				(d: AttachedDocItem) => d.id !== id
			);
			await personnelRepository.updateEmployeeProfile(currentEmployee.id, {
				attachedDocs: updatedDocs,
			});
			toast.success(t(localizationConstants.toastDocumentUploaded));
		},
		[currentEmployee, profileData.attachedDocs, t]
	);

	// Contract actions
	const handleArchiveContract = useCallback(async () => {
		toast.success(t(localizationConstants.toastContractArchived));
	}, [t]);

	const handleDeleteContract = useCallback(async () => {
		toast.success(t(localizationConstants.toastContractDeleted));
	}, [t]);

	return {
		currentEmployee,
		profileData,
		signedContract,
		activeTab,
		handleTabChange,
		activeEditModal,
		setActiveEditModal,
		selectedContactForEdit,
		setSelectedContactForEdit,
		previewDocumentName,
		setPreviewDocumentName,
		handleSavePersonalInfo,
		handleSaveBankInfo,
		handleSaveTaxUnion,
		handleSaveWorkDuties,
		handleSaveWorkInfo,
		handleSaveSalaryCompensation,
		handleSaveWorkingHours,
		handleSaveHealthSupport,
		handleAddEmergencyContact,
		handleUpdateEmergencyContact,
		handleDeleteEmergencyContact,
		handleAddCompetenceDoc,
		handleDeleteCompetenceDoc,
		handleAddAttachedDoc,
		handleDeleteAttachedDoc,
		handleArchiveContract,
		handleDeleteContract,
	};
}
