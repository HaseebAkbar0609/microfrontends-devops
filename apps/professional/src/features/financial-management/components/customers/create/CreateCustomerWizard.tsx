"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateCustomerForm } from "../../../hooks/useCreateCustomerForm";
import { CreateCustomerTabs, type CustomerWizardTab } from "./CreateCustomerTabs";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Contact } from "./steps/Step2Contact";
import { Step3Assessment } from "./steps/Step3Assessment";
import { Step4Invoice } from "./steps/Step4Invoice";

export function CreateCustomerWizard() {
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

	const handleTabChange = (tab: CustomerWizardTab) => {
		const stepMap: Record<CustomerWizardTab, number> = {
			basic_info: 1,
			contact: 2,
			assessment: 3,
			invoice: 4,
		};
		handleStepClick(stepMap[tab]);
	};

	// Keep activeTab synced with currentStep
	const currentTab: CustomerWizardTab =
		currentStep === 1
			? "basic_info"
			: currentStep === 2
				? "contact"
				: currentStep === 3
					? "assessment"
					: "invoice";

	return (
		<div className="flex flex-1 flex-col bg-slate-50 min-h-screen">
			{/* Header matching Figma Image 4 */}
			<div className="bg-white border-b border-slate-200 px-8 pt-6 pb-0">
				<div className="mx-auto max-w-5xl space-y-4">
					{/* Title + Back button */}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={handleCancel}
							className="text-slate-600 hover:text-slate-900 transition-colors p-1 -ml-1 cursor-pointer"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<div>
							<h1 className="text-xl font-bold text-slate-900 tracking-tight">
								Create New Customer
							</h1>
							<p className="text-xs text-slate-500 font-medium">
								Step {currentStep}/{totalSteps}
							</p>
						</div>
					</div>

					{/* Clean Horizontal Tabs matching Figma Image 4 */}
					<CreateCustomerTabs
						activeTab={currentTab}
						onTabChange={handleTabChange}
					/>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="mx-auto w-full max-w-5xl px-8 py-8 flex-1 space-y-6">
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

				{/* Wizard Navigation Footer matching Figma Image 4 */}
				<div className="flex items-center justify-end gap-3 pt-6 pb-12">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleCancel}
						className="h-10 px-5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-lg shadow-2xs"
					>
						Cancel
					</Button>

					<Button
						type="button"
						size="sm"
						onClick={handleSaveDraft}
						disabled={isSavingDraft}
						className="h-10 px-6 text-xs font-semibold bg-[#111827] hover:bg-slate-800 text-white cursor-pointer rounded-lg shadow-2xs"
					>
						Save
					</Button>

					{currentStep < totalSteps ? (
						<Button
							type="button"
							size="sm"
							onClick={handleNext}
							className="h-10 px-6 text-xs font-semibold gap-2 bg-[#111827] hover:bg-slate-800 text-white cursor-pointer rounded-lg shadow-2xs"
						>
							<span>Next</span>
							<ArrowRight className="h-4 w-4" />
						</Button>
					) : (
						<Button
							type="button"
							size="sm"
							onClick={submitForm}
							disabled={isSubmitting}
							className="h-10 px-6 text-xs font-semibold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-lg shadow-2xs"
						>
							{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
							<span>Save & Create</span>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
