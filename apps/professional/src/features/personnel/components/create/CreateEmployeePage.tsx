"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Layers, UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PERSONNEL_NAV_ITEMS,
	PERSONNEL_MODULE_BASE_URL,
	personnelBreadcrumbs,
} from "../../constants/personnelNav.config";
import { useCreateEmployee } from "../../hooks/useCreateEmployee";
import { CreateEmployeeStepper } from "./CreateEmployeeStepper";
import { CreateEmployeeActions } from "./CreateEmployeeActions";
import { CancelConfirmationDialog } from "./modals/CancelConfirmationDialog";
import { Step1Grundinformation } from "./steps/Step1Grundinformation";
import { Step2Kontaktperson } from "./steps/Step2Kontaktperson";
import { Step3Anstallningsvillkor } from "./steps/Step3Anstallningsvillkor";
import { Step4Kompetens } from "./steps/Step4Kompetens";
import { Step5Dokument } from "./steps/Step5Dokument";

const TAB_ICON_MAP: Record<string, React.ElementType> = {
	dashboard: Layers,
	overview: Users,
	create: UserPlus,
	worktime: Clock,
};

export function CreateEmployeePage() {
	const { t } = useTranslation();
	const {
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
	} = useCreateEmployee();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header */}
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.createEmployeeTab)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto space-y-4">
				{/* Level 1 Tabs matching Figma */}
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-xs">
					<Tabs defaultValue="create" className="w-full">
						<TabsList variant="line" className="h-[36px] overflow-x-auto">
							{PERSONNEL_NAV_ITEMS.map((item) => {
								const Icon = TAB_ICON_MAP[item.id] || Users;
								return (
									<TabsTrigger key={item.id} value={item.id} className="cursor-pointer gap-1.5" asChild>
										<Link href={item.href || PERSONNEL_MODULE_BASE_URL}>
											<Icon className="w-3.5 h-3.5 shrink-0" />
											<Translate text={item.labelKey || ""} />
										</Link>
									</TabsTrigger>
								);
							})}
						</TabsList>
					</Tabs>
				</div>

				{/* Main Form Container */}
				<div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
					{/* Title Header with Back Button */}
					<div className="flex items-center gap-4 px-6 py-5 border-b border-slate-200">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleCancel}
							className="h-9 w-9 p-0 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
							aria-label={t(localizationConstants.btnPrevious)}
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<div>
							<h1 className="text-lg font-semibold text-slate-900 leading-tight">
								{t(localizationConstants.createEmployeeTitle)}
							</h1>
							<p className="text-xs text-slate-500 mt-0.5">
								{t(localizationConstants.createEmployeeSubtitle)}
							</p>
						</div>
					</div>

					{/* Stepper Tabs */}
					<CreateEmployeeStepper
						activeStep={activeStep}
						onStepClick={setActiveStep}
					/>

					{/* Active Step Content */}
					<div className="flex-1 p-6 bg-slate-50/40">
						{activeStep === 1 && (
							<Step1Grundinformation
								personalInfo={formData.personalInfo}
								bankInfo={formData.bankInfo}
								taxUnion={formData.taxUnion}
								workDuties={formData.workDuties}
								validationError={validationError}
								onUpdatePersonalInfo={updatePersonalInfo}
								onUpdateBankInfo={updateBankInfo}
								onUpdateTaxUnion={updateTaxUnion}
								onUpdateWorkDuties={updateWorkDuties}
							/>
						)}

						{activeStep === 2 && (
							<Step2Kontaktperson
								contacts={formData.emergencyContacts}
								onAddContact={addEmergencyContact}
								onRemoveContact={removeEmergencyContact}
								onUpdateContact={updateEmergencyContact}
							/>
						)}

						{activeStep === 3 && (
							<Step3Anstallningsvillkor
								workInfo={formData.workInfo}
								salaryCompensation={formData.salaryCompensation}
								workingHours={formData.workingHours}
								healthSupport={formData.healthSupport}
								onUpdateWorkInfo={updateWorkInfo}
								onUpdateSalaryCompensation={updateSalaryCompensation}
								onUpdateWorkingHours={updateWorkingHours}
								onUpdateHealthSupport={updateHealthSupport}
							/>
						)}

						{activeStep === 4 && (
							<Step4Kompetens
								uploadedTags={formData.uploadedCompetenceTags}
								competenceDocs={formData.competenceDocs}
								onRemoveTag={removeCompetenceTag}
								onAddDoc={addCompetenceDoc}
								onRemoveDoc={removeCompetenceDoc}
							/>
						)}

						{activeStep === 5 && (
							<Step5Dokument
								config={formData.documentsConfig}
								uploadedTags={formData.uploadedDocumentTags}
								attachedDocs={formData.attachedDocs}
								onUpdateConfig={updateDocumentsConfig}
								onRemoveTag={removeDocumentTag}
								onAddDoc={addAttachedDoc}
								onRemoveDoc={removeAttachedDoc}
							/>
						)}
					</div>

					{/* Persistent Bottom Actions */}
					<CreateEmployeeActions
						activeStep={activeStep}
						onCancel={handleCancel}
						onSave={handleSave}
						onPrev={handlePrevStep}
						onNext={handleNextStep}
					/>
				</div>
			</div>

			{/* Cancel Confirmation Dialog */}
			<CancelConfirmationDialog
				isOpen={isCancelDialogOpen}
				onConfirm={confirmCancel}
				onClose={closeCancelDialog}
			/>
		</div>
	);
}
