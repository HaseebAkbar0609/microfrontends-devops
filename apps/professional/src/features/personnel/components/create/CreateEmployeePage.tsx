"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Layers, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { EmployeeStepProgressCard } from "./EmployeeStepProgressCard";
import { CancelConfirmationDialog } from "./modals/CancelConfirmationDialog";
import { Step1Grundinformation } from "./steps/Step1Grundinformation";
import { Step2Kontaktperson } from "./steps/Step2Kontaktperson";
import { Step3Anstallningsvillkor } from "./steps/Step3Anstallningsvillkor";
import { Step4Kompetens } from "./steps/Step4Kompetens";
import { Step5Dokument } from "./steps/Step5Dokument";
import { Wrench } from "lucide-react";

const TAB_ICON_MAP: Record<string, React.ElementType> = {
	dashboard: Layers,
	overview: Users,
	equipment: Wrench,
	worktime: Clock,
};

export function CreateEmployeePage() {
	const { t } = useTranslation();
	const {
		activeStep,
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
	} = useCreateEmployee();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Page Header */}
			<PageHeader
				title={localizationConstants.personnel}
				breadcrumbs={personnelBreadcrumbs(localizationConstants.createEmployeeTitle)}
				className="border-b-0 px-4 sm:px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col px-4 sm:px-6 pt-2 pb-8 overflow-y-auto space-y-6">
				{/* Level 1 Navigation Tabs: Personnel Overview is active */}
				<div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg h-[44px] shadow-2xs">
					<Tabs defaultValue="overview" className="w-full">
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

				{/* Title Header with Back Button (Matching Figma Image 2) */}
				<div className="flex items-center gap-3.5 pt-1">
					<button
						type="button"
						onClick={handleCancel}
						className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
						aria-label={t(localizationConstants.btnPrevious)}
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
							{t(localizationConstants.createEmployeeTitle)}
						</h1>
						<p className="text-xs text-slate-500 mt-1.5">
							{t(localizationConstants.createEmployeeSubtitle)}
						</p>
					</div>
				</div>

				{/* Stepper Sub-navigation Tabs (Matching Figma Image 2) */}
				<CreateEmployeeStepper
					activeStep={activeStep}
					onStepClick={handleStepClick}
				/>

				{/* Mobile Step Card (< lg): Displays above cards on small viewports */}
				<div className="lg:hidden">
					<EmployeeStepProgressCard activeStep={activeStep} />
				</div>

				{/* 2-Column Responsive Layout Matching Figma Image 2 */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Left Main Column: Form Cards stacked with full visibility */}
					<div className="lg:col-span-8 xl:col-span-9 space-y-6">
						{activeStep === 1 && (
							<Step1Grundinformation
								personalInfo={formData.personalInfo}
								bankInfo={formData.bankInfo}
								taxUnion={formData.taxUnion}
								workDuties={formData.workDuties}
								validationError={validationError}
								fieldErrors={fieldErrors}
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

					{/* Right Column: Step Progress Card Matching Figma Image 2 */}
					<div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-4">
						<EmployeeStepProgressCard activeStep={activeStep} />
					</div>
				</div>

				{/* Persistent Bottom Actions Matching Figma Image 4 */}
				<CreateEmployeeActions
					activeStep={activeStep}
					isSubmitting={isSubmitting}
					onCancel={handleCancel}
					onSave={handleSave}
					onPrev={handlePrevStep}
					onNext={handleNextStep}
				/>
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
