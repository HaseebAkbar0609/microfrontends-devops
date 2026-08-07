"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AgreementInformationStep } from "./steps/AgreementInformationStep";
import { ContactInformationStep } from "./steps/ContactInformationStep";
import { DocumentStep } from "./steps/DocumentStep";
import { cn } from "@/lib/utils";
import type { AgreementContact, AgreementDocument } from "../types/agreementCreate";
import {
	createAgreementSchema,
	type CreateAgreementFormData,
	type CreateAgreementFullData,
} from "../types/agreementCreate";
import { AGREEMENT_ROUTES } from "../constants/agreementDashboard";

const TABS = [
	{ key: 1, labelKey: localizationConstants.agreementCreateStep1Tab },
	{ key: 2, labelKey: localizationConstants.agreementCreateStep2Tab },
	{ key: 3, labelKey: localizationConstants.agreementCreateStep3Tab },
];

export function CreateAgreementPage() {
	const t = useTranslate();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [contacts, setContacts] = useState<AgreementContact[]>([]);
	const [documents, setDocuments] = useState<AgreementDocument[]>([]);

	const methods = useForm<CreateAgreementFormData>({
		resolver: zodResolver(createAgreementSchema),
		defaultValues: {
			avdelning: "",
			objekt: "",
			ansvarig: "",
			anteckning: "",
			startdatum: "",
			slutdatum: "",
			aktionsdatum: "",
			paminnelseDatum: "",
			paminnelseText: "",
			avtalsprioritet: "",
			fornamn: "",
			efternamn: "",
			mail: "",
			mobil: "",
			roll: "",
		},
	});

	const control = methods.control;

	const handleAddContact = useCallback((contact: AgreementContact) => {
		setContacts((prev) => [...prev, contact]);
	}, []);

	const handleRemoveContact = useCallback((id: string) => {
		setContacts((prev) => prev.filter((c) => c.id !== id));
	}, []);

	const handleAddDocument = useCallback((doc: AgreementDocument) => {
		setDocuments((prev) => [...prev, doc]);
	}, []);

	const handleRemoveDocument = useCallback((id: string) => {
		setDocuments((prev) => prev.filter((d) => d.id !== id));
	}, []);

	const validateCurrentStep = async (): Promise<boolean> => {
		if (currentStep === 1) {
			const result = await methods.trigger(["avdelning", "objekt", "startdatum"]);
			if (!result) {
				showToast("error", t(localizationConstants.agreementCreateValidationFailed));
			}
			return result;
		}
		if (currentStep === 2) {
			if (contacts.length === 0) {
				showToast("error", t(localizationConstants.agreementCreateValidationFailed));
				return false;
			}
			return true;
		}
		return true;
	};

	const handleNext = async () => {
		if (currentStep >= 3) return;
		const valid = await validateCurrentStep();
		if (valid) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (currentStep <= 1) return;
		setCurrentStep((prev) => prev - 1);
	};

	const handleTabClick = async (step: number) => {
		if (step < currentStep) {
			setCurrentStep(step);
		} else if (step > currentStep) {
			const valid = await validateCurrentStep();
			if (valid) {
				setCurrentStep(step);
			}
		}
	};

	const handleSubmit = methods.handleSubmit(async (data) => {
		setIsSubmitting(true);
		try {
			const fullData: CreateAgreementFullData = {
				...data,
				contacts,
				documents,
			};
			const response = await fetch("/api/agreement/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(fullData),
			});
			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.message || t(localizationConstants.agreementCreateSubmitError));
			}
			showToast("success", t(localizationConstants.agreementCreateSuccess));
			router.push(AGREEMENT_ROUTES.overview);
		} catch (error) {
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				showToast("error", t(localizationConstants.agreementCreateNetworkError));
			} else {
				showToast("error", error instanceof Error ? error.message : t(localizationConstants.agreementCreateSubmitError));
			}
		} finally {
			setIsSubmitting(false);
		}
	});

	const handleCancel = () => {
		router.push(AGREEMENT_ROUTES.overview);
	};

	return (
		<div className="flex h-full flex-col overflow-hidden bg-slate-50">
			<div className="flex-1 overflow-y-auto px-4 py-4">
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.backButton)}
						onClick={handleCancel}
						className="rounded-md p-1.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.agreementCreateTitle} />
					</h1>
				</div>

				<p className="mb-3 ml-7 text-xs text-slate-500 sm:ml-9 sm:text-sm">
					<Translate text={localizationConstants.stepLabel} /> {currentStep}/3
				</p>

				<div className="mb-4 ml-7 overflow-x-auto border-b border-slate-200 sm:ml-9">
					<div className="flex gap-4 sm:gap-6">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => handleTabClick(tab.key)}
								className={cn(
									"whitespace-nowrap pb-3 text-xs font-medium transition-colors border-b-2 sm:text-sm cursor-pointer",
									currentStep === tab.key
										? "border-slate-900 text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-700",
								)}
							>
								<Translate text={tab.labelKey} />
							</button>
						))}
					</div>
				</div>

				<div className="mb-4 ml-7 rounded-lg border border-slate-200 bg-white p-3 sm:ml-9 sm:p-4 xl:hidden">
					<div className="mb-2 flex items-center justify-between">
						<p className="text-xs font-medium text-slate-900 sm:text-sm">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/3
						</p>
						<span className="text-[10px] font-semibold text-slate-600 sm:text-xs">
							{Math.round((currentStep / 3) * 100)}%
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 sm:h-2">
						<div
							className="h-full bg-[#111721] transition-all duration-300"
							style={{ width: `${(currentStep / 3) * 100}%` }}
						/>
					</div>
				</div>

				<div className="ml-7 flex flex-col items-start gap-4 sm:ml-9 sm:gap-6 xl:flex-row">
					<div className="w-full flex-1 overflow-hidden">
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit}>
								{currentStep === 1 && <AgreementInformationStep control={control} />}
								{currentStep === 2 && (
									<ContactInformationStep
										control={control}
										contacts={contacts}
										onAddContact={handleAddContact}
										onRemoveContact={handleRemoveContact}
									/>
								)}
								{currentStep === 3 && (
									<DocumentStep
										documents={documents}
										onAddDocument={handleAddDocument}
										onRemoveDocument={handleRemoveDocument}
									/>
								)}
							</form>
						</FormProvider>
					</div>

					<div className="hidden w-64 shrink-0 lg:block xl:w-72">
						<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} /> {currentStep}/3
								</p>
								<span className="text-xs font-semibold text-slate-600">
									{Math.round((currentStep / 3) * 100)}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${(currentStep / 3) * 100}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4 sm:pt-6">
				<div className="flex flex-wrap items-center justify-end gap-2 px-3 pb-3 sm:gap-3 sm:px-4 sm:pb-4">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={handleCancel}
						className="h-8 min-w-20 bg-transparent border border-slate-300 px-3 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none sm:h-9 sm:min-w-25 sm:px-5 sm:text-sm cursor-pointer"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					{currentStep > 1 && (
						<Button
							type="button"
							variant="ghost"
							size="default"
							onClick={handleBack}
							className="h-8 min-w-20 gap-1 bg-slate-100 border border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-none sm:h-9 sm:min-w-25 sm:gap-2 sm:px-5 sm:text-sm cursor-pointer"
						>
							<ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
							<Translate text={localizationConstants.backButton} />
						</Button>
					)}

					{currentStep < 3 ? (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleNext}
							className="h-8 min-w-20 gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-25 sm:gap-2 sm:text-sm cursor-pointer"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>
					) : (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="h-8 min-w-30 gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-35 sm:gap-2 sm:text-sm cursor-pointer"
						>
							{isSubmitting ? (
								<Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
							) : (
								<Save className="h-3 w-3 sm:h-4 sm:w-4" />
							)}
							<Translate text={localizationConstants.agreementCreateCreateAgreement} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
