"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankAccountFormData, BankDocumentItem } from "../../types/bank.types";
import { BankAccountBasicStep } from "./BankAccountBasicStep";
import { BankDocumentUploadStep } from "./BankDocumentUploadStep";
import { BankStepProgressBar } from "./BankStepProgressBar";

export interface CreateBankAccountWizardProps {
	onBack: () => void;
	onSave: (data: BankAccountFormData) => void;
	initialData?: BankAccountFormData;
	initialStep?: 1 | 2;
}

export function CreateBankAccountWizard({
	onBack,
	onSave,
	initialData,
	initialStep = 1,
}: CreateBankAccountWizardProps) {
	const { t } = useTranslation();
	const [activeStep, setActiveStep] = useState<1 | 2>(initialStep);

	const [formData, setFormData] = useState<BankAccountFormData>(
		initialData || {
			id: "B005",
			title: "",
			bankName: "SEB (Skandinaviska Enskilda Banken)",
			accountType: "Företagskonto",
			accountNumber: "",
			iban: "",
			swiftBic: "",
			currency: "SEK",
			balance: 0,
			autoDailySync: true,
			contactPerson: {
				name: "",
				role: "",
				email: "",
				phone: "",
			},
			documents: [],
		},
	);

	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateStep1 = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.accountNumber?.trim()) {
			newErrors.accountNumber = t(localizationConstants.valAccountNumberRequired);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (activeStep === 1) {
			if (!validateStep1()) return;
			setActiveStep(2);
		}
	};

	const handleSave = () => {
		if (activeStep === 1 && !validateStep1()) return;
		onSave(formData);
	};

	const handleAddDocument = (doc: Omit<BankDocumentItem, "id">) => {
		const newDoc: BankDocumentItem = {
			...doc,
			id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		};
		setFormData((prev) => ({
			...prev,
			documents: [newDoc, ...(prev.documents || [])],
		}));
	};

	const handleRemoveDocument = (index: number) => {
		setFormData((prev) => ({
			...prev,
			documents: (prev.documents || []).filter((_, i) => i !== index),
		}));
	};

	return (
		<div className="flex flex-1 flex-col bg-[#F8FAFC] min-h-screen px-6 pt-4 pb-16">
			{/* Top Header */}
			<div className="mb-6 space-y-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onBack}
						className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.titleCreateAccountPage} />
						</h1>
						<p className="text-xs text-slate-500 font-medium">
							<Translate
								text={
									activeStep === 1
										? localizationConstants.step1Of2
										: localizationConstants.step2Of2
								}
							/>
						</p>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="flex items-center gap-6 border-b border-slate-200">
					<button
						type="button"
						onClick={() => setActiveStep(1)}
						className={`pb-3 text-xs font-semibold tracking-wide transition-all border-b-2 -mb-px cursor-pointer ${
							activeStep === 1
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.tabGrundlaggandeInfo} />
					</button>
					<button
						type="button"
						onClick={() => {
							if (validateStep1()) setActiveStep(2);
						}}
						className={`pb-3 text-xs font-semibold tracking-wide transition-all border-b-2 -mb-px cursor-pointer ${
							activeStep === 2
								? "border-slate-900 text-slate-900"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						<Translate text={localizationConstants.tabDokument} />
					</button>
				</div>
			</div>

			{/* Main Content Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
				{/* Main Left Section */}
				<div className="lg:col-span-3">
					{activeStep === 1 ? (
						<BankAccountBasicStep
							formData={formData}
							errors={errors}
							onChange={setFormData}
							onClearError={(field) => setErrors({ ...errors, [field]: "" })}
						/>
					) : (
						<BankDocumentUploadStep
							documents={formData.documents || []}
							onAddDocument={handleAddDocument}
							onRemoveDocument={handleRemoveDocument}
						/>
					)}
				</div>

				{/* Right Column Step Progress */}
				<div className="lg:col-span-1">
					<BankStepProgressBar currentStep={activeStep} totalSteps={2} />
				</div>
			</div>

			{/* Bottom Action Footer */}
			<div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xs border-t border-slate-200 px-8 py-3.5 flex items-center justify-end gap-3 z-30 shadow-lg">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="h-9 px-5 bg-white border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
				>
					<Translate text={localizationConstants.btnCancel} />
				</Button>

				<Button
					type="button"
					onClick={handleSave}
					className="h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg gap-1.5 cursor-pointer shadow-sm"
				>
					<Save className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.btnSave} />
				</Button>

				{activeStep === 1 && (
					<Button
						type="button"
						onClick={handleNext}
						className="h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg gap-1.5 cursor-pointer shadow-sm"
					>
						<Translate text={localizationConstants.btnNextStep} />
						<ArrowRight className="w-3.5 h-3.5" />
					</Button>
				)}
			</div>
		</div>
	);
}

export default CreateBankAccountWizard;
