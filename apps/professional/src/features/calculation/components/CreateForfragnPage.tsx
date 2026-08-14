"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDocItem, KalkylProjektData } from "../types/kalkyl";
import { DEFAULT_KONTAKT } from "../types/forfragan";
import type { ForfragnKontaktData } from "../types/forfragan";
import { KalkylProjektStep } from "./steps/KalkylProjektStep";
import { KalkylDokumentStep } from "./steps/KalkylDokumentStep";
import { ForfragnKontaktStep } from "./steps/ForfragnKontaktStep";
import { ForfragnLeverantorStep } from "./steps/ForfragnLeverantorStep";

// ── Constants ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+()]{7,}$/;

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
	senatsDatum: "2026-01-15",
};

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
	const [documents, setDocuments] = useState<KalkylDocItem[]>([]);
	const [datumFran, setDatumFran] = useState("");
	const [datumTill, setDatumTill] = useState("");
	const [gdprAccepted, setGdprAccepted] = useState(false);
	const [suppliers, setSuppliers] = useState<string[]>(["Beijer", "ByggMax"]);

	const TABS = [
		{ key: 1, labelKey: localizationConstants.calcNewStep2Tab },
		{ key: 2, labelKey: localizationConstants.calcNewStep1Tab },
		{ key: 3, labelKey: localizationConstants.calcNewStep3Tab },
		{ key: 4, labelKey: localizationConstants.createForfrgnTabLeverantor },
	];

	const handleProjektChange = useCallback(
		(patch: Partial<KalkylProjektData>) => setProjekt((prev) => ({ ...prev, ...patch })),
		[],
	);
	const handleKontaktChange = useCallback(
		(patch: Partial<ForfragnKontaktData>) => setKontakt((prev) => ({ ...prev, ...patch })),
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

	function validateCurrentStep(): boolean {
		if (currentStep !== 2) return true;

		if (!kontakt.fornamn.trim()) {
			setShowErrors(true);
			showToast("error", t(localizationConstants.agreementCreateValidationFailed));
			return false;
		}
		if (kontakt.mail && !EMAIL_RE.test(kontakt.mail)) {
			setEmailError(true);
			showToast("error", t(localizationConstants.validationRegisterEmailInvalid));
			return false;
		}
		if (kontakt.telefon && !PHONE_RE.test(kontakt.telefon)) {
			setPhoneError(true);
			showToast("error", t(localizationConstants.agreementCreateValidationFailed));
			return false;
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
		if (step < currentStep) setCurrentStep(step);
		else if (step > currentStep && validateCurrentStep()) setCurrentStep(step);
	}

	async function handleSubmit() {
		setIsSubmitting(true);
		// TODO: replace with real API call — POST /api/calculation/${calcId}/inquiry
		await new Promise((resolve) => setTimeout(resolve, 800));
		showToast("success", t(localizationConstants.createForfrgnSuccess));
		setIsSubmitting(false);
		router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
	}

	function handleSave() {
		showToast("success", t(localizationConstants.saveButton));
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
							<Translate text={localizationConstants.calcNewTitle} />
						</h1>
						<p className="text-xs text-slate-500 sm:text-sm">
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/
							{TOTAL_STEPS}
						</p>
					</div>
				</div>

				{/* Tab bar */}
				<div className="mb-4 ml-9 overflow-x-auto border-b border-slate-200">
					<div className="flex gap-4 sm:gap-6">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => handleTabClick(tab.key)}
								className={cn(
									"cursor-pointer whitespace-nowrap border-b-2 pb-3 text-xs font-medium transition-colors sm:text-sm",
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
								showErrors={showErrors}
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
							<ForfragnLeverantorStep
								suppliers={suppliers}
								onAdd={(name) => setSuppliers((prev) => [...prev, name])}
								onRemove={(name) => setSuppliers((prev) => prev.filter((s) => s !== name))}
							/>
						)}
					</div>

					{/* Right sidebar — large screens */}
					<div className="hidden w-64 shrink-0 lg:block xl:w-72">
						<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} />{" "}
									{currentStep}/{TOTAL_STEPS}
								</p>
								<span className="text-xs font-semibold text-slate-600">
									{progressPercent}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>

							<div className="mt-4 flex flex-col gap-2">
								{TABS.map((tab) => (
									<div
										key={tab.key}
										className={cn(
											"flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
											currentStep === tab.key
												? "bg-slate-100 font-semibold text-slate-900"
												: tab.key < currentStep
													? "text-slate-500"
													: "text-slate-400",
										)}
									>
										<span
											className={cn(
												"flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
												currentStep === tab.key
													? "bg-slate-900 text-white"
													: tab.key < currentStep
														? "bg-emerald-100 text-emerald-700"
														: "bg-slate-200 text-slate-500",
											)}
										>
											{tab.key < currentStep ? "✓" : tab.key}
										</span>
										<Translate text={tab.labelKey} />
									</div>
								))}
							</div>

							{currentStep === TOTAL_STEPS && (
								<div className="mt-4 border-t border-slate-100 pt-4">
									<Button
										type="button"
										onClick={handleSubmit}
										disabled={isSubmitting}
										className="w-full cursor-pointer gap-2 bg-[#111721] text-sm text-white hover:bg-slate-800"
									>
										{isSubmitting ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Send className="h-4 w-4" />
										)}
										<Translate text={localizationConstants.createForfrgnSkickaErb} />
									</Button>
								</div>
							)}
						</div>
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
						className="h-8 min-w-20 cursor-pointer gap-1 border border-slate-200 bg-transparent px-3 text-xs text-slate-700 shadow-none hover:bg-slate-100 sm:h-9 sm:min-w-25 sm:gap-2 sm:px-5 sm:text-sm"
					>
						<Save className="h-3 w-3 sm:h-4 sm:w-4" />
						<Translate text={localizationConstants.saveButton} />
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

					{currentStep < TOTAL_STEPS && (
						<Button
							type="button"
							onClick={handleNext}
							className="h-8 min-w-20 cursor-pointer gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-25 sm:gap-2 sm:text-sm"
						>
							<Translate text={localizationConstants.nextButton} />
							<ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>
					)}

					{currentStep === TOTAL_STEPS && (
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="h-8 min-w-20 cursor-pointer gap-1 bg-[#111721] text-xs text-white hover:bg-slate-800 sm:h-9 sm:min-w-25 sm:gap-2 sm:text-sm lg:hidden"
						>
							{isSubmitting ? (
								<Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
							) : (
								<Send className="h-3 w-3 sm:h-4 sm:w-4" />
							)}
							<Translate text={localizationConstants.createForfrgnSkickaErb} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
