"use client";

import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateAccountForm } from "@/features/financial-management/hooks/useCreateAccountForm";
import { CreateAccountGrundInfoCard } from "./cards/CreateAccountGrundInfoCard";
import { CreateAccountAdditionalInfoCard } from "./cards/CreateAccountAdditionalInfoCard";

export function CreateAccountPage() {
	const {
		formData,
		errors,
		isSubmitting,
		isAdditionalInfoOpen,
		updateField,
		handleSubmit,
		handleCancel,
		toggleAdditionalInfo,
	} = useCreateAccountForm();

	return (
		<div className="w-full flex flex-col gap-6 py-4 pb-20">
			{/* Page Header */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={handleCancel}
					className="p-1 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
					aria-label="Back"
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.createAccountHeaderTitle} />
				</h1>
			</div>

			{/* Sub Navigation Tab */}
			<div className="border-b border-slate-200">
				<div className="inline-flex items-center gap-2 border-b-2 border-slate-900 pb-3 px-1 text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.grundInformationSection} />
				</div>
			</div>

			{/* Cards */}
			<div className="flex flex-col gap-6">
				<CreateAccountGrundInfoCard
					formData={formData}
					errors={errors}
					onUpdateField={updateField}
				/>

				<CreateAccountAdditionalInfoCard
					formData={formData}
					isOpen={isAdditionalInfoOpen}
					onToggle={toggleAdditionalInfo}
					onUpdateField={updateField}
				/>
			</div>

			{/* Sticky Bottom Actions Bar */}
			<div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur-md px-6 py-3.5 z-20 flex justify-end items-center gap-3 shadow-lg">
				<Button
					type="button"
					variant="outline"
					onClick={handleCancel}
					className="h-10 px-6 border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					type="button"
					disabled={isSubmitting}
					onClick={handleSubmit}
					className="h-10 px-6 gap-2 rounded-lg bg-[#111721] text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
				>
					<Translate text={localizationConstants.save} />
					<Save className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
