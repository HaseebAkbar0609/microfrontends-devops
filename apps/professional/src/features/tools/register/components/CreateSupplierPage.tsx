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
import { SupplierBasicInfoStep } from "./steps/SupplierBasicInfoStep";
import { SupplierContactStep } from "./steps/SupplierContactStep";
import { SupplierAssessmentStep } from "./steps/SupplierAssessmentStep";
import { cn } from "@/lib/utils";
import {
	createSupplierSchema,
	type CreateSupplierFormData,
	type RatingField,
	type Ratings,
	type CreateSupplierFullData,
} from "../types";
import {
	createSupplierAPIAction,
	saveSupplierDraftAPIAction,
} from "../api/supplierRegister";

const TABS = [
	{ key: 1, labelKey: localizationConstants.createSupplierBasicInfoTab },
	{ key: 2, labelKey: localizationConstants.createSupplierContactTab },
	{ key: 3, labelKey: localizationConstants.createSupplierAssessmentTab },
];

const TOTAL_STEPS = 3;

const STEP_FIELDS: Record<number, (keyof CreateSupplierFormData)[]> = {
	1: ["companyName", "orgNo", "status", "visitingAddress", "visitingPostalCode", "visitingCity", "invoiceAddress", "invoicePostalCode", "invoiceCity"],
	2: [],
	3: [],
};

export function CreateSupplierPage() {
	const t = useTranslate();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSavingDraft, setIsSavingDraft] = useState(false);
	const [supplierId, setSupplierId] = useState<string | null>(null);

	const [ratings, setRatings] = useState<Ratings>({
		economy: 0,
		environment: 0,
		quality: 0,
		collaboration: 0,
		punctuality: 0,
		service: 0,
	});

	const methods = useForm<CreateSupplierFormData>({
		resolver: zodResolver(createSupplierSchema),
		defaultValues: {
			supplierNo: "",
			status: "",
			companyName: "",
			mainCategory: "",
			department: "",
			region: "",
			orgNo: "",
			vatRegNo: "",
			visitingAddress: "",
			visitingPostalCode: "",
			visitingCity: "",
			invoiceAddress: "",
			invoicePostalCode: "",
			invoiceCity: "",
			bankName: "",
			bankAccount: "",
			bankgiro: "",
			plusgiro: "",
			iban: "",
			bic: "",
			betalningsdagar: "",
			ranta: "",
			fakturaavgift: "",
			inkasso: "",
			phone: "",
			email: "",
			website: "",
			contactNotes: "",
			contactPerson1FirstName: "",
			contactPerson1LastName: "",
			contactPerson1Mobile: "",
			contactPerson1Email: "",
			contactPerson1Role: "",
			contactPerson1PersonalNo: "",
			contactPerson2FirstName: "",
			contactPerson2LastName: "",
			contactPerson2Mobile: "",
			contactPerson2Email: "",
			contactPerson2Role: "",
			contactPerson2PersonalNo: "",
			contactPerson3FirstName: "",
			contactPerson3LastName: "",
			contactPerson3Mobile: "",
			contactPerson3Email: "",
			contactPerson3Role: "",
			contactPerson3PersonalNo: "",
			contactPerson4FirstName: "",
			contactPerson4LastName: "",
			contactPerson4Mobile: "",
			contactPerson4Email: "",
			contactPerson4Role: "",
			contactPerson4PersonalNo: "",
			contactPerson5FirstName: "",
			contactPerson5LastName: "",
			contactPerson5Mobile: "",
			contactPerson5Email: "",
			contactPerson5Role: "",
			contactPerson5PersonalNo: "",
			notes: "",
		},
	});

	const control = methods.control;

	const handleRatingChange = useCallback(
		(field: RatingField, value: number) => {
			setRatings((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	const validateStep = async (step: number): Promise<boolean> => {
		const fields = STEP_FIELDS[step];
		if (!fields || fields.length === 0) return true;
		const result = await methods.trigger(fields);
		return result;
	};

	const handleNext = async () => {
		if (currentStep >= TOTAL_STEPS) return;

		const isValid = await validateStep(currentStep);
		if (!isValid) return;

		setCurrentStep((prev) => prev + 1);
	};

	const handleTabClick = async (step: number) => {
		if (step <= currentStep) {
			setCurrentStep(step);
			return;
		}

		for (let s = currentStep; s < step; s++) {
			const isValid = await validateStep(s);
			if (!isValid) return;
		}

		setCurrentStep(step);
	};

	const handleSubmit = methods.handleSubmit(async (data) => {
		setIsSubmitting(true);
		try {
			const fullData = { ...data, ratings, id: supplierId } as CreateSupplierFullData;
			const result = await createSupplierAPIAction(fullData);
			setSupplierId(result.id);
			showToast("success", t(localizationConstants.supplierCreatedSuccess));
			router.push("/tools/register");
		} catch {
			showToast("error", t(localizationConstants.supplierCreateError));
		} finally {
			setIsSubmitting(false);
		}
	});

	const handleCancel = () => {
		router.push("/tools/register");
	};

	const handleSaveDraft = async () => {
		setIsSavingDraft(true);
		try {
			const data = methods.getValues();
			const fullData: CreateSupplierFullData = { ...data, ratings, id: supplierId };
			const result = await saveSupplierDraftAPIAction(fullData);
			setSupplierId(result.id);
			showToast("info", t(localizationConstants.draftSaved));
		} catch {
			showToast("error", t(localizationConstants.supplierCreateError));
		} finally {
			setIsSavingDraft(false);
		}
	};

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			<div className="flex-1 px-3 py-3">
				{/* Title with Back Arrow */}
				<div className="mb-2 flex items-center gap-2">
					<button
						type="button"
						onClick={() => router.back()}
						className="rounded-md p-1 hover:bg-slate-100"
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-xl font-semibold text-slate-900">
						<Translate text={localizationConstants.createSupplierTitle} />
					</h1>
				</div>

				{/* Step Counter */}
				<p className="mb-4 ml-9 text-sm text-slate-500">
					<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
				</p>

				{/* Clickable Tabs */}
				<div className="mb-6 ml-9 flex gap-6 border-b border-slate-200">
					{TABS.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => handleTabClick(tab.key)}
							className={cn(
								"pb-3 text-sm font-medium transition-colors border-b-2",
								currentStep === tab.key
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<Translate text={tab.labelKey} />
						</button>
					))}
				</div>

				{/* Step Progress Card ABOVE Form on < xl screens */}
				<div className="mb-6 ml-9 rounded-lg border border-slate-200 bg-white p-4 xl:hidden">
					<div className="mb-2 flex items-center justify-between">
						<p className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
						</p>
						<span className="text-xs font-semibold text-slate-600">
							{Math.round((currentStep / TOTAL_STEPS) * 100)}%
						</span>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full bg-[#111721] transition-all duration-300"
							style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
						/>
					</div>
				</div>

				{/* Form Content + Right Sidebar for xl screens */}
				<div className="ml-9 flex flex-col items-start gap-8 xl:flex-row">
					{/* Form Content */}
					<div className="w-full flex-1">
						<FormProvider {...methods}>
							<form onSubmit={handleSubmit}>
								{currentStep === 1 && <SupplierBasicInfoStep control={control} />}
								{currentStep === 2 && <SupplierContactStep control={control} />}
								{currentStep === 3 && (
									<SupplierAssessmentStep
										control={control}
										ratings={ratings}
										onRatingChange={handleRatingChange}
									/>
								)}
							</form>
						</FormProvider>
					</div>

					{/* Step Progress Card on RIGHT side for xl screens */}
					<div className="hidden w-72 shrink-0 xl:block">
						<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
								</p>
								<span className="text-xs font-semibold text-slate-600">
									{Math.round((currentStep / TOTAL_STEPS) * 100)}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Action Bar */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-6">
				<div className="flex items-center justify-end gap-3 px-4 pb-4">
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={handleCancel}
						className="h-9 min-w-[120px] bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						variant="default"
						size="default"
						onClick={handleSaveDraft}
						disabled={isSavingDraft}
						className="h-9 min-w-[120px] gap-2 bg-[#111721] text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.saveDraftButton} />
						{isSavingDraft ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
					</Button>

					{currentStep < TOTAL_STEPS && (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleNext}
							className="h-9 min-w-[120px] gap-2 bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-4 w-4" />
						</Button>
					)}

					{currentStep === TOTAL_STEPS && (
						<Button
							type="button"
							variant="default"
							size="default"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="h-9 min-w-[160px] gap-2 bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.createSupplierButton} />
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
