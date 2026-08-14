"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDocItem, KalkylProjektData } from "../types/kalkyl";
import { KalkylProjektStep } from "./steps/KalkylProjektStep";
import { KalkylDokumentStep } from "./steps/KalkylDokumentStep";
import { ForfragnKontaktStep, DEFAULT_KONTAKT } from "./steps/ForfragnKontaktStep";
import { ForfragnLeverantorStep } from "./steps/ForfragnLeverantorStep";
import type { ForfragnKontaktData } from "./steps/ForfragnKontaktStep";
import type { ForfragnLeverantorData } from "./steps/ForfragnLeverantorStep";

// ── Constants ──────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+()]{7,}$/;

const TOTAL_STEPS = 4;

const DEFAULT_PROJEKT: KalkylProjektData = {
	projektNr: "",
	projektNamn: "",
	kvartersNamn: "",
	projektAdress: "",
	postNr: "",
	ort: "",
	type: "",
	kategori: "",
	avdelning: "",
	kontraktsumma: "",
	offertNr: "",
	startDatum: "",
	slutDatum: "",
	senatsDatum: "",
};

const DEFAULT_LEVERANTOR: ForfragnLeverantorData = {
	supplier: "",
	message: "",
};

// ── Sub-components ─────────────────────────────────────────────────────────

interface TabBarProps {
	currentStep: number;
	stepLabelKeys: string[];
	onTabClick: (step: number) => void;
}

function TabBar({ currentStep, stepLabelKeys, onTabClick }: TabBarProps) {
	return (
		<div className="mb-4 ml-9 overflow-x-auto border-b border-slate-200">
			<div className="flex gap-4 sm:gap-6">
				{stepLabelKeys.map((labelKey, i) => {
					const step = i + 1;
					return (
						<button
							key={step}
							type="button"
							onClick={() => onTabClick(step)}
							className={cn(
								"cursor-pointer whitespace-nowrap border-b-2 pb-3 text-xs font-medium transition-colors sm:text-sm",
								currentStep === step
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<Translate text={labelKey} />
						</button>
					);
				})}
			</div>
		</div>
	);
}

interface ProgressSidebarProps {
	currentStep: number;
	stepLabelKeys: string[];
	onCancel: () => void;
	onNext: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
}

function ProgressSidebar({
	currentStep,
	stepLabelKeys,
	onCancel,
	onNext,
	onSubmit,
	isSubmitting,
}: ProgressSidebarProps) {
	const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

	return (
		<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
			<div className="mb-2 flex items-center justify-between">
				<p className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
				</p>
				<span className="text-xs font-semibold text-slate-600">{progressPercent}%</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className="h-full bg-[#111721] transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>

			<div className="mt-4 flex flex-col gap-2">
				{stepLabelKeys.map((labelKey, i) => {
					const step = i + 1;
					return (
						<div
							key={step}
							className={cn(
								"flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
								currentStep === step
									? "bg-slate-100 font-semibold text-slate-900"
									: step < currentStep
										? "text-slate-500"
										: "text-slate-400",
							)}
						>
							<span
								className={cn(
									"flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
									currentStep === step
										? "bg-slate-900 text-white"
										: step < currentStep
											? "bg-emerald-100 text-emerald-700"
											: "bg-slate-200 text-slate-500",
								)}
							>
								{step < currentStep ? "✓" : step}
							</span>
							<Translate text={labelKey} />
						</div>
					);
				})}
			</div>

			<div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onCancel}
					className="h-8 cursor-pointer border border-slate-200 text-xs text-slate-700 hover:bg-slate-100"
				>
					<Translate text={localizationConstants.cancelButton} />
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={currentStep < TOTAL_STEPS ? onNext : onSubmit}
					disabled={isSubmitting}
					className="h-8 cursor-pointer gap-1.5 bg-[#111721] text-xs text-white hover:bg-slate-800"
				>
					{isSubmitting ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : currentStep < TOTAL_STEPS ? (
						<>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-3.5 w-3.5" />
						</>
					) : (
						<>
							<Save className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.calcInquiryWizSend} />
						</>
					)}
				</Button>
			</div>
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

interface CreateForfragnPageProps {
	calcId: string;
}

export function CreateForfragnPage({ calcId }: CreateForfragnPageProps) {
	const t = useTranslate();
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [phoneError, setPhoneError] = useState(false);

	const [projekt, setProjekt] = useState<KalkylProjektData>(DEFAULT_PROJEKT);
	const [kontakt, setKontakt] = useState<ForfragnKontaktData>(DEFAULT_KONTAKT);
	const [leverantor, setLeverantor] = useState<ForfragnLeverantorData>(DEFAULT_LEVERANTOR);
	const [documents, setDocuments] = useState<KalkylDocItem[]>([]);
	const [datumFran, setDatumFran] = useState("");
	const [datumTill, setDatumTill] = useState("");
	const [gdprAccepted, setGdprAccepted] = useState(false);

	const handleProjektChange = useCallback(
		(patch: Partial<KalkylProjektData>) => setProjekt((prev) => ({ ...prev, ...patch })),
		[],
	);
	const handleKontaktChange = useCallback(
		(patch: Partial<ForfragnKontaktData>) => setKontakt((prev) => ({ ...prev, ...patch })),
		[],
	);
	const handleLeverantorChange = useCallback(
		(patch: Partial<ForfragnLeverantorData>) => setLeverantor((prev) => ({ ...prev, ...patch })),
		[],
	);
	const handleAddDocument = useCallback(
		(doc: KalkylDocItem) => setDocuments((prev) => [...prev, doc]),
		[],
	);
	const handleRemoveDocument = useCallback(
		(id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id)),
		[],
	);

	const STEP_LABEL_KEYS = [
		localizationConstants.calcInquiryWizStep1,
		localizationConstants.calcInquiryWizStep2,
		localizationConstants.calcInquiryWizStep3,
		localizationConstants.calcInquiryWizStep4,
	];

	function validateCurrentStep(): boolean {
		if (currentStep === 1 && !projekt.projektNamn.trim()) {
			setShowErrors(true);
			showToast("error", t(localizationConstants.calcInquiryWizRequiredErr));
			return false;
		}
		if (currentStep === 2) {
			const hasEmailErr = !EMAIL_RE.test(kontakt.email.trim());
			const hasPhoneErr = kontakt.telefon.trim() !== "" && !PHONE_RE.test(kontakt.telefon.trim());
			setEmailError(hasEmailErr);
			setPhoneError(hasPhoneErr);
			if (hasEmailErr || hasPhoneErr) {
				showToast("error", t(localizationConstants.calcInquiryWizRequiredErr));
				return false;
			}
		}
		setShowErrors(false);
		setEmailError(false);
		setPhoneError(false);
		return true;
	}

	function handleNext() {
		if (currentStep >= TOTAL_STEPS) return;
		if (validateCurrentStep()) setCurrentStep((prev) => prev + 1);
	}

	function handleBack() {
		if (currentStep <= 1) return;
		setCurrentStep((prev) => prev - 1);
	}

	function handleTabClick(step: number) {
		if (step < currentStep) {
			setCurrentStep(step);
		} else if (step > currentStep) {
			if (validateCurrentStep()) setCurrentStep(step);
		}
	}

	function handleSave() {
		showToast("success", t(localizationConstants.calcInquiryWizSaved));
	}

	async function handleSubmit() {
		if (!validateCurrentStep()) return;
		setIsSubmitting(true);
		// TODO: replace with real API call — POST /api/calculation/${calcId}/inquiry
		await new Promise((resolve) => setTimeout(resolve, 800));
		showToast("success", t(localizationConstants.calcInquiryWizSent));
		setIsSubmitting(false);
		router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
	}

	function handleCancel() {
		router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
	}

	const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-slate-50">
			<div className="flex-1 overflow-y-auto px-4 py-4">
				{/* Header */}
				<div className="mb-1 flex items-center gap-2">
					<button
						type="button"
						aria-label={t(localizationConstants.backButton)}
						onClick={handleCancel}
						className="cursor-pointer rounded-md bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200"
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
							<Translate text={localizationConstants.calcInquiryWizTitle} />
						</h1>
						<p className="text-xs text-slate-500 sm:text-sm">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
						</p>
					</div>
				</div>

				<TabBar
					currentStep={currentStep}
					stepLabelKeys={STEP_LABEL_KEYS}
					onTabClick={handleTabClick}
				/>

				{/* Progress card — small screens only */}
				<div className="mb-4 ml-9 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 lg:hidden">
					<div className="mb-2 flex items-center justify-between">
						<p className="text-xs font-medium text-slate-900 sm:text-sm">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
						</p>
						<span className="text-[10px] font-semibold text-slate-600 sm:text-xs">
							{progressPercent}%
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 sm:h-2">
						<div
							className="h-full bg-[#111721] transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>

				{/* Body: form + right sidebar */}
				<div className="ml-9 flex flex-col items-start gap-4 sm:gap-6 lg:flex-row">
					<div className="w-full flex-1 overflow-hidden">
						{currentStep === 1 && (
							<KalkylProjektStep
								data={projekt}
								onChange={handleProjektChange}
								showErrors={showErrors}
							/>
						)}
						{currentStep === 2 && (
							<ForfragnKontaktStep
								data={kontakt}
								onChange={handleKontaktChange}
								emailError={emailError}
								phoneError={phoneError}
							/>
						)}
						{currentStep === 3 && (
							<KalkylDokumentStep
								documents={documents}
								datumFran={datumFran}
								datumTill={datumTill}
								gdprAccepted={gdprAccepted}
								onDatumFranChange={setDatumFran}
								onDatumTillChange={setDatumTill}
								onGdprChange={setGdprAccepted}
								onAddDocument={handleAddDocument}
								onRemoveDocument={handleRemoveDocument}
							/>
						)}
						{currentStep === 4 && (
							<ForfragnLeverantorStep data={leverantor} onChange={handleLeverantorChange} />
						)}
					</div>

					{/* Right sidebar — large screens only */}
					<div className="hidden w-64 shrink-0 lg:block xl:w-72">
						<ProgressSidebar
							currentStep={currentStep}
							stepLabelKeys={STEP_LABEL_KEYS}
							onCancel={handleCancel}
							onNext={handleNext}
							onSubmit={handleSubmit}
							isSubmitting={isSubmitting}
						/>
					</div>
				</div>
			</div>

			{/* Bottom nav bar */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white">
				<div className="flex flex-wrap items-center justify-end gap-2 px-3 py-3 sm:gap-3 sm:px-4">
					<Button
						type="button"
						variant="ghost"
						onClick={handleCancel}
						className="h-8 min-w-20 cursor-pointer border border-slate-300 bg-transparent px-3 text-xs text-slate-700 shadow-none hover:bg-slate-100 sm:h-9 sm:min-w-25 sm:px-5 sm:text-sm"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						variant="ghost"
						onClick={handleSave}
						className="h-8 min-w-20 cursor-pointer border border-slate-200 bg-white px-3 text-xs text-slate-700 shadow-none hover:bg-slate-50 sm:h-9 sm:min-w-25 sm:px-5 sm:text-sm"
					>
						<Save className="h-3 w-3 sm:h-4 sm:w-4" />
						<Translate text={localizationConstants.save} />
					</Button>

					{currentStep > 1 && (
						<Button
							type="button"
							variant="ghost"
							onClick={handleBack}
							className="h-8 min-w-20 cursor-pointer gap-1 border border-slate-200 bg-slate-100 px-3 text-xs text-slate-700 shadow-none hover:bg-slate-200 sm:h-9 sm:min-w-25 sm:gap-2 sm:px-5 sm:text-sm"
						>
							<ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
							<Translate text={localizationConstants.backButton} />
						</Button>
					)}

					{currentStep < TOTAL_STEPS ? (
						<Button
							type="button"
							onClick={handleNext}
							className="h-8 min-w-20 cursor-pointer gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-25 sm:gap-2 sm:text-sm"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>
					) : (
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="h-8 min-w-25 cursor-pointer gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-30 sm:gap-2 sm:text-sm"
						>
							{isSubmitting ? (
								<Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
							) : (
								<Save className="h-3 w-3 sm:h-4 sm:w-4" />
							)}
							<Translate text={localizationConstants.calcInquiryWizSend} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
