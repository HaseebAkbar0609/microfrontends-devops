"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { authoritiesRepository } from "../../utils/authoritiesRepository";
import { ECONOMY_AUTHORITIES_BASE_URL } from "../../constants/authorities.constants";
import { AuthorityBasicStep } from "./AuthorityBasicStep";
import { AuthorityDocumentStep } from "./AuthorityDocumentStep";
import { AuthorityStepProgressBar } from "./AuthorityStepProgressBar";
import type { AuthorityFormData } from "../../types/authorities.types";

export function CreateAuthorityWizard() {
	const router = useRouter();
	const { t } = useTranslation();
	const [currentStep, setCurrentStep] = useState<1 | 2>(1);
	const [formData, setFormData] = useState<AuthorityFormData>({
		caseNr: "",
		authorityName: "Skatteverket",
		category: "Govt Docs",
		documentName: "",
		subject: "",
		date: new Date().toISOString().split("T")[0],
		status: "pending",
		responsiblePerson: "",
		referenceNumber: "",
		dueDate: "",
		attachments: [],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateStep1 = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.authorityName?.trim()) {
			newErrors.authorityName = t(localizationConstants.validationAuthorityRequired);
		}
		if (!formData.category) {
			newErrors.category = t(localizationConstants.validationCategoryRequired);
		}
		if (!formData.documentName?.trim()) {
			newErrors.documentName = t(localizationConstants.validationDocumentNameRequired);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (currentStep === 1) {
			if (!validateStep1()) return;
			setCurrentStep(2);
		}
	};

	const handlePrev = () => {
		if (currentStep === 2) {
			setCurrentStep(1);
		}
	};

	const handleSubmit = () => {
		if (!validateStep1()) {
			setCurrentStep(1);
			return;
		}

		setIsSubmitting(true);
		try {
			authoritiesRepository.create(formData);
			router.push(ECONOMY_AUTHORITIES_BASE_URL);
		} catch (err) {
			console.error("Failed to create authority case:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumbs & Header */}
			<div className="flex items-center justify-between">
				<div>
					<div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
						<span>Hem</span>
						<span>/</span>
						<span>Ekonomi</span>
						<span>/</span>
						<button
							onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
							className="hover:text-slate-800 underline"
						>
							<Translate text={localizationConstants.authoritiesTitle} />
						</button>
						<span>/</span>
						<span className="text-slate-800 font-medium">
							<Translate text={localizationConstants.createAuthorityTitle} />
						</span>
					</div>
					<h1 className="text-xl font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.createAuthorityTitle} />
					</h1>
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
					className="h-9 gap-1.5 border-slate-200 text-xs"
				>
					<X className="h-4 w-4" />
					<Translate text={localizationConstants.actionCancel} />
				</Button>
			</div>

			{/* Main Form Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Step Content */}
				<div className="lg:col-span-8 space-y-6">
					{/* Tab Navigation */}
					<div className="flex border-b border-slate-200">
						<button
							type="button"
							onClick={() => setCurrentStep(1)}
							className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
								currentStep === 1
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-400 hover:text-slate-700"
							}`}
						>
							<span
								className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
									currentStep === 1
										? "bg-slate-900 text-white"
										: "bg-slate-100 text-slate-600"
								}`}
							>
								1
							</span>
							<Translate text={localizationConstants.tabGrundlaggandeInfo} />
						</button>
						<button
							type="button"
							onClick={() => {
								if (validateStep1()) setCurrentStep(2);
							}}
							className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
								currentStep === 2
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-400 hover:text-slate-700"
							}`}
						>
							<span
								className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
									currentStep === 2
										? "bg-slate-900 text-white"
										: "bg-slate-100 text-slate-600"
								}`}
							>
								2
							</span>
							<Translate text={localizationConstants.tabDokument} />
						</button>
					</div>

					{/* Step 1 or Step 2 View */}
					{currentStep === 1 ? (
						<AuthorityBasicStep
							formData={formData}
							errors={errors}
							onChange={setFormData}
							onClearError={(key) => {
								const next = { ...errors };
								delete next[key];
								setErrors(next);
							}}
						/>
					) : (
						<AuthorityDocumentStep
							formData={formData}
							onChange={setFormData}
						/>
					)}

					{/* Step Actions */}
					<div className="flex items-center justify-between pt-2">
						{currentStep > 1 ? (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handlePrev}
								className="h-9 px-4 text-xs gap-1.5 border-slate-200"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								<Translate text={localizationConstants.actionPrevious} />
							</Button>
						) : (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
								className="h-9 px-4 text-xs border-slate-200"
							>
								<Translate text={localizationConstants.actionCancel} />
							</Button>
						)}

						<div className="flex items-center gap-2">
							{currentStep < 2 ? (
								<Button
									type="button"
									size="sm"
									onClick={handleNext}
									className="h-9 px-4 text-xs bg-slate-900 text-white hover:bg-slate-800 gap-1.5"
								>
									<Translate text={localizationConstants.actionNext} />
									<ArrowRight className="h-3.5 w-3.5" />
								</Button>
							) : (
								<Button
									type="button"
									size="sm"
									onClick={handleSubmit}
									disabled={isSubmitting}
									className="h-9 px-5 text-xs bg-slate-900 text-white hover:bg-slate-800 gap-1.5"
								>
									<Save className="h-3.5 w-3.5" />
									<Translate text={localizationConstants.actionSave} />
								</Button>
							)}
						</div>
					</div>
				</div>

				{/* Right Sidebar Progress */}
				<div className="lg:col-span-4">
					<AuthorityStepProgressBar currentStep={currentStep} totalSteps={2} />
				</div>
			</div>
		</div>
	);
}

export default CreateAuthorityWizard;
