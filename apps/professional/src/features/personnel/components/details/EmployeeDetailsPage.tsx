"use client";

import React, { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";
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
		handleAddAttachedDoc,
		handleDeleteAttachedDoc,
		handleArchiveContract,
		handleDeleteContract,
	} = useEmployeeDetails();

	const [personalInfoSubTab, setPersonalInfoSubTab] = React.useState<
		"grundinfo" | "kontaktperson" | "anstallningsvillkor"
	>("grundinfo");

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

				{/* 7 Personalkort Tabs matching Jira TFS-972 Epic tickets */}
				{activeTab === "information" && (
					<div className="space-y-6">
						{/* Sub-Tabs within Personal Information (TFS-976) */}
						<div className="flex items-center gap-2 border-b border-slate-200 pb-3">
							<Button
								type="button"
								variant={personalInfoSubTab === "grundinfo" ? "default" : "outline"}
								size="sm"
								onClick={() => setPersonalInfoSubTab("grundinfo")}
								className={cn(
									"text-xs h-8 font-medium cursor-pointer rounded-lg",
									personalInfoSubTab === "grundinfo"
										? "bg-[#111721] text-white hover:bg-slate-800"
										: "text-slate-600 hover:text-slate-900 bg-white border-slate-200"
								)}
							>
								<Translate text={localizationConstants.personnelProfileTabBasicInfo} />
							</Button>
							<Button
								type="button"
								variant={personalInfoSubTab === "kontaktperson" ? "default" : "outline"}
								size="sm"
								onClick={() => setPersonalInfoSubTab("kontaktperson")}
								className={cn(
									"text-xs h-8 font-medium cursor-pointer rounded-lg",
									personalInfoSubTab === "kontaktperson"
										? "bg-[#111721] text-white hover:bg-slate-800"
										: "text-slate-600 hover:text-slate-900 bg-white border-slate-200"
								)}
							>
								<Translate text={localizationConstants.personnelProfileTabContactPerson} />
							</Button>
							<Button
								type="button"
								variant={personalInfoSubTab === "anstallningsvillkor" ? "default" : "outline"}
								size="sm"
								onClick={() => setPersonalInfoSubTab("anstallningsvillkor")}
								className={cn(
									"text-xs h-8 font-medium cursor-pointer rounded-lg",
									personalInfoSubTab === "anstallningsvillkor"
										? "bg-[#111721] text-white hover:bg-slate-800"
										: "text-slate-600 hover:text-slate-900 bg-white border-slate-200"
								)}
							>
								<Translate text={localizationConstants.personnelProfileTabEmploymentTerms} />
							</Button>
						</div>

						{personalInfoSubTab === "grundinfo" && (
							<GrundinformationTab
								profileData={profileData}
								onEditSection={(section) => setActiveEditModal(section)}
							/>
						)}

						{personalInfoSubTab === "kontaktperson" && (
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

						{personalInfoSubTab === "anstallningsvillkor" && (
							<AnstallningsvillkorTab
								profileData={profileData}
								signedContract={signedContract}
								onPreviewContract={(name: string) => setPreviewDocumentName(name)}
								onDownloadContract={(name: string) => setPreviewDocumentName(name)}
								onArchiveContract={handleArchiveContract}
								onDeleteContract={handleDeleteContract}
								onUploadContract={(tags: string[]) =>
									handleAddAttachedDoc({
										name: tags[0] || "Anställningsavtal",
										date: new Date().toISOString().split("T")[0],
										fileFormat: "pdf",
									})
								}
								onEditSection={(section: string) => setActiveEditModal(section)}
							/>
						)}
					</div>
				)}

				{activeTab === "kompetens" && (
					<KompetensTab
						onPreviewDoc={(name) => setPreviewDocumentName(name)}
					/>
				)}

				{activeTab === "utrustning_fordon" && (
					<EquipmentCardsGrid employeeName={employeeName} />
				)}

				{(activeTab === "arbetstid" ||
					activeTab === "halsa" ||
					activeTab === "friskvard" ||
					activeTab === "personal_process" ||
					activeTab === "lon" ||
					activeTab === "arende") && (
					<div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.emptyTabUpcomingTitle} />
						</h3>
						<p className="text-xs text-slate-500 max-w-md mx-auto">
							<Translate text={localizationConstants.emptyTabUpcomingDesc} />
						</p>
					</div>
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
