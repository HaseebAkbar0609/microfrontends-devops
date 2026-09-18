"use client";

import React from "react";
import { ArrowLeft, Save, Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateCustomerForm } from "../../../hooks/useCreateCustomerForm";
import { StepProgressBar } from "./StepProgressBar";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Contact } from "./steps/Step2Contact";
import { Step3Assessment } from "./steps/Step3Assessment";
import { Step4Invoice } from "./steps/Step4Invoice";

export function CreateCustomerWizard() {
	const t = useTranslate();
	const {
		form,
		currentStep,
		totalSteps,
		isSubmitting,
		isSavingDraft,
		entityType,
		ratings,
		documents,
		contactPersons,
		isRotRutEnabled,
		associatedPersons,
		handleNext,
		handlePrevious,
		handleStepClick,
		handleRatingChange,
		handleAddDocument,
		handleRemoveDocument,
		handleAddContactPerson,
		handleRemoveContactPerson,
		handleAddAssociatedPerson,
		handleRemoveAssociatedPerson,
		handleSaveDraft,
		handleCancel,
		submitForm,
	} = useCreateCustomerForm();

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen">
			{/* Top Bar / Header */}
			<div className="border-b border-slate-200 bg-white px-6 py-4">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleCancel}
							className="h-9 w-9 p-0 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="sr-only">Tillbaka</span>
						</Button>
						<div>
							<h1 className="text-lg font-bold text-slate-900 tracking-tight">
								{t(localizationConstants.customerRegisterRegisterNew)}
							</h1>
							<p className="text-xs text-slate-500">
								Fyll i uppgifter för att registrera en ny kund i ekonomisystemet
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleSaveDraft}
							disabled={isSavingDraft}
							className="h-9 gap-1.5 text-xs font-semibold border-slate-200 hover:bg-slate-50 cursor-pointer"
						>
							<Save className="h-3.5 w-3.5 text-slate-500" />
							<span>{t(localizationConstants.saveDraft)}</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="mx-auto w-full max-w-5xl px-6 py-8 flex-1 space-y-8">
				{/* Step Progress Bar */}
				<StepProgressBar
					currentStep={currentStep}
					totalSteps={totalSteps}
					onStepClick={handleStepClick}
				/>

				{/* Step Content */}
				<div className="transition-all duration-200">
					{currentStep === 1 && (
						<Step1BasicInfo
							form={form}
							entityType={entityType}
							onEntityTypeChange={(type) =>
								form.setValue("entityType", type, { shouldDirty: true })
							}
						/>
					)}

					{currentStep === 2 && (
						<Step2Contact
							form={form}
							contactPersons={contactPersons}
							onAddContactPerson={handleAddContactPerson}
							onRemoveContactPerson={handleRemoveContactPerson}
							onUpdateContactPerson={(id, updates) => {
								const updated = contactPersons.map((p) =>
									p.id === id ? { ...p, ...updates } : p,
								);
								form.setValue("contactPersons", updated, { shouldDirty: true });
							}}
						/>
					)}

					{currentStep === 3 && (
						<Step3Assessment
							form={form}
							ratings={ratings}
							documents={documents}
							onRatingChange={handleRatingChange}
							onAddDocument={handleAddDocument}
							onRemoveDocument={handleRemoveDocument}
						/>
					)}

					{currentStep === 4 && (
						<Step4Invoice
							form={form}
							isRotRutEnabled={isRotRutEnabled}
							onRotRutToggle={(val) =>
								form.setValue("isRotRutEnabled", val, { shouldDirty: true })
							}
							associatedPersons={associatedPersons}
							onAddAssociatedPerson={handleAddAssociatedPerson}
							onRemoveAssociatedPerson={handleRemoveAssociatedPerson}
							onUpdateAssociatedPerson={(id, updates) => {
								const updated = associatedPersons.map((p) =>
									p.id === id ? { ...p, ...updates } : p,
								);
								form.setValue("associatedPersons", updated, { shouldDirty: true });
							}}
						/>
					)}
				</div>

				{/* Wizard Navigation Footer */}
				<div className="flex items-center justify-between border-t border-slate-200 bg-white p-4 rounded-xl shadow-2xs">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleCancel}
							className="h-9 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
						>
							{t(localizationConstants.cancel)}
						</Button>
					</div>

					<div className="flex items-center gap-2">
						{currentStep > 1 && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handlePrevious}
								className="h-9 gap-1 text-xs font-semibold border-slate-200 hover:bg-slate-50 cursor-pointer"
							>
								<ChevronLeft className="h-4 w-4" />
								<span>{t(localizationConstants.btnPrevious)}</span>
							</Button>
						)}

						{currentStep < totalSteps ? (
							<Button
								type="button"
								variant="primary"
								size="sm"
								onClick={handleNext}
								className="h-9 gap-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer px-4"
							>
								<span>{t(localizationConstants.btnNextStep)}</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
						) : (
							<Button
								type="button"
								variant="primary"
								size="sm"
								onClick={submitForm}
								disabled={isSubmitting}
								className="h-9 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-5"
							>
								{isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Check className="h-4 w-4" />
								)}
								<span>{t(localizationConstants.customerRegisterRegisterNew)}</span>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
