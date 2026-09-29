"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { personnelBreadcrumbs } from "../../constants/personnelNav.config";
import { PersonalkortHeader } from "../equipment/PersonalkortHeader";
import { EquipmentCardsGrid } from "../equipment/EquipmentCardsGrid";
import { useEmployeeDetails } from "../../hooks/useEmployeeDetails";

// SubTabs
import { GrundinformationTab } from "./tabs/GrundinformationTab";
import { KontaktpersonTab } from "./tabs/KontaktpersonTab";
import { AnstallningsvillkorTab } from "./tabs/AnstallningsvillkorTab";
import { KompetensTab } from "./tabs/KompetensTab";
import { DokumentTab } from "./tabs/DokumentTab";

// Modals
import { EditPersonalInfoModal } from "./modals/EditPersonalInfoModal";
import { EditBankInfoModal } from "./modals/EditBankInfoModal";
import { EditTaxUnionModal } from "./modals/EditTaxUnionModal";
import { EditWorkDutiesModal } from "./modals/EditWorkDutiesModal";
import { EditContactPersonModal } from "./modals/EditContactPersonModal";
import { AddContactPersonModal } from "./modals/AddContactPersonModal";
import { EditWorkInfoModal } from "./modals/EditWorkInfoModal";
import { EditSalaryModal } from "./modals/EditSalaryModal";
import { EditWorkingHoursModal } from "./modals/EditWorkingHoursModal";
import { EditHealthSupportModal } from "./modals/EditHealthSupportModal";
import { AddDetailCompetenceModal } from "./modals/AddDetailCompetenceModal";
import { DocumentPreviewModal } from "./modals/DocumentPreviewModal";

function EmployeeDetailsContent() {
	const {
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
	} = useEmployeeDetails();

	const employeeName = currentEmployee?.name || "Johan Andersson";

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header with breadcrumbs */}
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(employeeName)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 py-4 space-y-6">
				{/* Personalkort Header & Tabs */}
				<PersonalkortHeader
					employeeName={employeeName}
					activeTab={activeTab}
					onTabChange={handleTabChange}
				/>

				{/* 5 View Profile Tabs matching employee creation flow */}
				{activeTab === "information" && (
					<GrundinformationTab
						profileData={profileData}
						onEditSection={(section) => setActiveEditModal(section)}
					/>
				)}

				{activeTab === "kontaktperson" && (
					<KontaktpersonTab
						contacts={profileData.emergencyContacts}
						onAddContact={() => setActiveEditModal("addContact")}
						onEditContact={(contact) => {
							setSelectedContactForEdit(contact);
							setActiveEditModal("editContact");
						}}
						onDeleteContact={handleDeleteEmergencyContact}
					/>
				)}

				{activeTab === "anstallningsvillkor" && (
					<AnstallningsvillkorTab
						profileData={profileData}
						signedContract={signedContract}
						onPreviewContract={(name) => setPreviewDocumentName(name)}
						onDownloadContract={(name) => setPreviewDocumentName(name)}
						onArchiveContract={handleArchiveContract}
						onDeleteContract={handleDeleteContract}
						onUploadContract={(tags) =>
							handleAddAttachedDoc({
								name: tags[0] || "Anställningsavtal",
								date: new Date().toISOString().split("T")[0],
								fileFormat: "pdf",
							})
						}
						onEditSection={(section) => setActiveEditModal(section)}
					/>
				)}

				{activeTab === "kompetens" && (
					<KompetensTab
						profileData={profileData}
						onAddCompetence={() => setActiveEditModal("addCompetence")}
						onDeleteCompetence={handleDeleteCompetenceDoc}
						onUploadJobDescription={(tags) =>
							handleAddCompetenceDoc({
								name: tags[0] || "Arbetsbeskrivning",
								date: new Date().toISOString().split("T")[0],
								validity: "Tillsvidare",
								fileName: `${tags[0] || "Arbetsbeskrivning"}.pdf`,
								fileType: "pdf",
							})
						}
						onPreviewDoc={(name) => setPreviewDocumentName(name)}
					/>
				)}

				{activeTab === "dokument" && (
					<DokumentTab
						profileData={profileData}
						onDeleteDocument={handleDeleteAttachedDoc}
						onUploadDocument={(tags) =>
							handleAddAttachedDoc({
								name: tags[0] || "Dokument",
								date: new Date().toISOString().split("T")[0],
								fileFormat: "pdf",
							})
						}
						onPreviewDoc={(name) => setPreviewDocumentName(name)}
					/>
				)}

				{activeTab === "utrustning_fordon" && (
					<EquipmentCardsGrid employeeName={employeeName} />
				)}
			</div>

			{/* Edit & Action Modals */}
			<EditPersonalInfoModal
				isOpen={activeEditModal === "personalInfo"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.personalInfo}
				onSave={handleSavePersonalInfo}
			/>

			<EditBankInfoModal
				isOpen={activeEditModal === "bankInfo"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.bankInfo}
				onSave={handleSaveBankInfo}
			/>

			<EditTaxUnionModal
				isOpen={activeEditModal === "taxUnion"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.taxUnion}
				onSave={handleSaveTaxUnion}
			/>

			<EditWorkDutiesModal
				isOpen={activeEditModal === "workDuties"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.workDuties}
				onSave={handleSaveWorkDuties}
			/>

			<EditContactPersonModal
				isOpen={activeEditModal === "editContact"}
				onClose={() => {
					setActiveEditModal(null);
					setSelectedContactForEdit(null);
				}}
				contact={selectedContactForEdit}
				onSave={handleUpdateEmergencyContact}
			/>

			<AddContactPersonModal
				isOpen={activeEditModal === "addContact"}
				onClose={() => setActiveEditModal(null)}
				onAdd={handleAddEmergencyContact}
			/>

			<EditWorkInfoModal
				isOpen={activeEditModal === "workInfo"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.workInfo}
				onSave={handleSaveWorkInfo}
			/>

			<EditSalaryModal
				isOpen={activeEditModal === "salaryCompensation"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.salaryCompensation}
				onSave={handleSaveSalaryCompensation}
			/>

			<EditWorkingHoursModal
				isOpen={activeEditModal === "workingHours"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.workingHours}
				onSave={handleSaveWorkingHours}
			/>

			<EditHealthSupportModal
				isOpen={activeEditModal === "healthSupport"}
				onClose={() => setActiveEditModal(null)}
				initialData={profileData.healthSupport}
				onSave={handleSaveHealthSupport}
			/>

			<AddDetailCompetenceModal
				isOpen={activeEditModal === "addCompetence"}
				onClose={() => setActiveEditModal(null)}
				onAdd={handleAddCompetenceDoc}
			/>

			<DocumentPreviewModal
				isOpen={Boolean(previewDocumentName)}
				onClose={() => setPreviewDocumentName(null)}
				documentName={previewDocumentName}
			/>
		</div>
	);
}

export function EmployeeDetailsPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center text-slate-500">Laddar...</div>}>
			<EmployeeDetailsContent />
		</Suspense>
	);
}

export default EmployeeDetailsPage;
