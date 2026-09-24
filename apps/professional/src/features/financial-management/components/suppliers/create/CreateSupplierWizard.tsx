"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateSupplierForm } from "../../../hooks/useCreateSupplierForm";
import { CreateSupplierTabs, type SupplierWizardTab } from "./CreateSupplierTabs";
import { StepProgressBar } from "./StepProgressBar";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Contact } from "./steps/Step2Contact";
import { Step3Assessment } from "./steps/Step3Assessment";

export function CreateSupplierWizard() {
	const {
		form,
		currentStep,
		totalSteps,
		isSubmitting,
		ratings,
		documents,
		contactPersons,
		handleNext,
		handleStepClick,
		handleRatingChange,
		handleAddDocument,
		handleDeleteDocument,
		handleAddContactPerson,
		handleUpdateContactPerson,
		handleDeleteContactPerson,
		handleCancel,
		handleSubmit,
	} = useCreateSupplierForm();

	const handleTabChange = (tab: SupplierWizardTab) => {
		const stepMap: Record<SupplierWizardTab, number> = {
			basic_info: 1,
			contact: 2,
			assessment: 3,
		};
		handleStepClick(stepMap[tab]);
	};

	const currentTab: SupplierWizardTab =
		currentStep === 1
			? "basic_info"
			: currentStep === 2
				? "contact"
				: "assessment";

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Header matching Figma */}
			<div className="space-y-4">
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
							<Translate text={localizationConstants.supplierCreateTitle} />
						</h1>
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.supplierStepPrefix} /> {currentStep}/{totalSteps}
						</p>
					</div>
				</div>

				{/* Clean Horizontal Tabs matching Figma */}
				<CreateSupplierTabs
					activeTab={currentTab}
					onTabChange={handleTabChange}
				/>
			</div>

			{/* Main Content Area in 2-Column Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
				{/* Left Main Form Column */}
				<div className="lg:col-span-8 xl:col-span-9 space-y-6">
					{currentStep === 1 && <Step1BasicInfo form={form} />}

					{currentStep === 2 && (
						<Step2Contact
							form={form}
							contactPersons={contactPersons}
							onAddContactPerson={handleAddContactPerson}
							onRemoveContactPerson={handleDeleteContactPerson}
							onUpdateContactPerson={handleUpdateContactPerson}
						/>
					)}

					{currentStep === 3 && (
						<Step3Assessment
							form={form}
							ratings={ratings}
							documents={documents}
							onRatingChange={handleRatingChange}
							onAddDocument={handleAddDocument}
							onRemoveDocument={handleDeleteDocument}
						/>
					)}
				</div>

				{/* Right Sidebar Column with Step Progress Card */}
				<div className="lg:col-span-4 xl:col-span-3">
					<StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
				</div>
			</div>

			{/* Wizard Navigation Footer matching Figma */}
			<div className="flex items-center justify-end gap-3 pt-4 pb-12">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleCancel}
					className="h-10 px-5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-lg shadow-2xs"
				>
					<Translate text={localizationConstants.supplierBtnCancel} />
				</Button>

				{currentStep < totalSteps ? (
					<Button
						type="button"
						size="sm"
						onClick={handleNext}
						className="h-10 px-6 text-xs font-semibold gap-2 bg-[#111827] hover:bg-slate-800 text-white cursor-pointer rounded-lg shadow-2xs"
					>
						<Translate text={localizationConstants.supplierBtnNext} />
						<ArrowRight className="h-4 w-4" />
					</Button>
				) : (
					<Button
						type="button"
						size="sm"
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="h-10 px-6 text-xs font-semibold gap-2 bg-[#111827] hover:bg-slate-800 text-white cursor-pointer rounded-lg shadow-2xs"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						<Translate text={localizationConstants.supplierBtnSave} />
					</Button>
				)}
			</div>
		</div>
	);
}

export default CreateSupplierWizard;
