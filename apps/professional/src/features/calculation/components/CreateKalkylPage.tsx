"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { DUMMY_OFFER_SEND } from "@/features/offer/constants/offerSend";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";

function getOfferFallback(offerId: string) {
	const reqMatch = DUMMY_OFFER_REQUESTS.find((r) => r.id === offerId);
	if (reqMatch) {
		return {
			...DUMMY_OFFER_SEND,
			id: reqMatch.id,
			title: reqMatch.job,
			type: reqMatch.type,
			badges: [reqMatch.type, reqMatch.category, reqMatch.municipality],
			customer: {
				name: reqMatch.customerName,
				email: "",
				phone: "",
				address: reqMatch.municipality || "",
			},
			preliminaryBudgetPrice: reqMatch.price ? reqMatch.price.toLocaleString("en-US") : "",
			offerDateLatest: "",
		};
	}

	const quotedMatch = DUMMY_QUOTED_ITEMS.find((q) => q.id === offerId);
	if (quotedMatch) {
		return {
			...DUMMY_OFFER_SEND,
			id: quotedMatch.id,
			title: quotedMatch.job,
			type: quotedMatch.type,
			badges: [quotedMatch.type, quotedMatch.category, quotedMatch.municipality],
			customer: {
				name: quotedMatch.customerName,
				email: quotedMatch.contactPerson.email || "",
				phone: quotedMatch.contactPerson.phone || "",
				address: quotedMatch.municipality || "",
			},
			preliminaryBudgetPrice: quotedMatch.price ? quotedMatch.price.toLocaleString("en-US") : "",
			offerDateLatest: "",
		};
	}

	return {
		...DUMMY_OFFER_SEND,
		id: offerId,
		customer: {
			name: "",
			email: "",
			phone: "",
			address: "",
		},
		preliminaryBudgetPrice: "",
		offerDateLatest: "",
	};
}

function mapOfferToState(
	offer: Partial<typeof DUMMY_OFFER_SEND> | null,
	offerId: string,
	setKontakt: React.Dispatch<React.SetStateAction<KalkylKontaktData>>,
	setProjekt: React.Dispatch<React.SetStateAction<KalkylProjektData>>,
) {
	if (!offer) return;

	const customerName = offer.customer?.name || "";
	const nameParts = customerName.trim().split(" ");
	const fornamn = nameParts[0] || "";
	const efternamn = nameParts.slice(1).join(" ") || "";
	const id = offer.id || offerId;
	const address = offer.customer?.address || "";
	const ort = offer.badges?.[1] || offer.badges?.[2] || "";
	const email = offer.customer?.email || "";
	const phone = offer.customer?.phone || "";

	setKontakt((prev) => ({
		...prev,
		offert: id,
		foretag: customerName,
		address,
		ort,
		mail: email,
		telefon: phone,
		fornamn,
		efternamn,
		kontaktMail: email,
		mobil: phone,
		// Beställare
		bestellareFoetag: customerName,
		bestellareAddress: address,
		bestellareOrt: ort,
		bestellareMail: email,
		bestellareTelefon: phone,
		bestellareFornamn: fornamn,
		bestellareEfternamn: efternamn,
		bestellareKontaktMail: email,
		bestellareMobil: phone,
	}));

	setProjekt((prev) => ({
		...prev,
		projektNr: id,
		projektNamn: offer.title || "",
		projektAdress: address,
		ort,
		type: offer.type || "",
		offertNr: id,
		kontraktsumma: offer.preliminaryBudgetPrice || "",
		senatsDatum: offer.offerDateLatest || prev.senatsDatum,
	}));
}
import type { KalkylDocItem, KalkylKontaktData, KalkylProjektData } from "../types/kalkyl";
import { KalkylKontaktStep } from "./steps/KalkylKontaktStep";
import { KalkylProjektStep } from "./steps/KalkylProjektStep";
import { KalkylDokumentStep } from "./steps/KalkylDokumentStep";

// ── Constants ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const TABS = [
	{ key: 1, labelKey: localizationConstants.calcNewStep1Tab },
	{ key: 2, labelKey: localizationConstants.calcNewStep2Tab },
	{ key: 3, labelKey: localizationConstants.calcNewStep3Tab },
];

const DEFAULT_KONTAKT: KalkylKontaktData = {
	mode: "eigen",
	offert: "",
	kunduppgifter: false,
	foretag: "",
	address: "",
	postNr: "",
	ort: "",
	mail: "",
	telefon: "",
	orgNr: "",
	kontaktperson: "",
	fornamn: "",
	efternamn: "",
	kontaktMail: "",
	mobil: "",
	roll: "",
	bestellareKunduppgifter: false,
	bestellareFoetag: "",
	bestellareAddress: "",
	bestellarePostNr: "",
	bestellareOrt: "",
	bestellareMail: "",
	bestellareTelefon: "",
	bestellareFornamn: "",
	bestellareEfternamn: "",
	bestellareKontaktMail: "",
	bestellareMobil: "",
};

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

export function CreateKalkylPage() {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const offerId = searchParams.get("offerId");

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	// Form state lifted to parent so steps don't lose state on navigation
	const [kontakt, setKontakt] = useState<KalkylKontaktData>(DEFAULT_KONTAKT);
	const [projekt, setProjekt] = useState<KalkylProjektData>(DEFAULT_PROJEKT);
	const [documents, setDocuments] = useState<KalkylDocItem[]>([]);
	const [datumFran, setDatumFran] = useState("");
	const [datumTill, setDatumTill] = useState("");
	const [gdprAccepted, setGdprAccepted] = useState(false);

	useEffect(() => {
		if (!offerId) return;

		async function loadOfferData() {
			try {
				const res = await getOfferDetailByIdAPIAction(offerId as string);
				if (res.success && res.data) {
					mapOfferToState(res.data, offerId as string, setKontakt, setProjekt);
				} else {
					const fallbackOffer = getOfferFallback(offerId as string);
					mapOfferToState(fallbackOffer, offerId as string, setKontakt, setProjekt);
				}
			} catch {
				const fallbackOffer = getOfferFallback(offerId as string);
				mapOfferToState(fallbackOffer, offerId as string, setKontakt, setProjekt);
			}
		}

		loadOfferData();
	}, [offerId]);

	const handleKontaktChange = useCallback(
		(patch: Partial<KalkylKontaktData>) => setKontakt((prev) => ({ ...prev, ...patch })),
		[],
	);
	const handleProjektChange = useCallback(
		(patch: Partial<KalkylProjektData>) => setProjekt((prev) => ({ ...prev, ...patch })),
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
		if (currentStep === 2 && !projekt.projektNamn.trim()) {
			setShowErrors(true);
			showToast("error", t(localizationConstants.agreementCreateValidationFailed));
			return false;
		}
		setShowErrors(false);
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

	async function handleSubmit() {
		setIsSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 800));
		showToast("success", t(localizationConstants.agreementCreateSuccess));
		setIsSubmitting(false);
		router.push("/module/business/calculation/overview");
	}

	function handleCancel() {
		router.push("/module/business/calculation/overview");
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
							<Translate text={localizationConstants.stepLabel} /> {currentStep}/{TOTAL_STEPS}
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

				{/* Progress card (small screens) */}
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
							<KalkylKontaktStep data={kontakt} onChange={handleKontaktChange} />
						)}
						{currentStep === 2 && (
							<KalkylProjektStep
								data={projekt}
								onChange={handleProjektChange}
								showErrors={showErrors}
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
					</div>

					{/* Right sidebar — large screens only */}
					<div className="hidden w-64 shrink-0 lg:block xl:w-72">
						<div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-4">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.stepLabel} /> {currentStep}/
									{TOTAL_STEPS}
								</p>
								<span className="text-xs font-semibold text-slate-600">{progressPercent}%</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full bg-[#111721] transition-all duration-300"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>

							{/* Step list */}
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

							{/* Sidebar actions */}
							<div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleCancel}
									className="h-8 cursor-pointer border border-slate-200 text-xs text-slate-700 hover:bg-slate-100"
								>
									<Translate text={localizationConstants.cancelButton} />
								</Button>
								{currentStep < TOTAL_STEPS ? (
									<Button
										type="button"
										size="sm"
										onClick={handleNext}
										className="h-8 cursor-pointer gap-1.5 bg-[#111721] text-xs text-white hover:bg-slate-800"
									>
										<Translate text={localizationConstants.nextButton} />
										<ArrowRight className="h-3.5 w-3.5" />
									</Button>
								) : (
									<Button
										type="button"
										size="sm"
										onClick={handleSubmit}
										disabled={isSubmitting}
										className="h-8 cursor-pointer gap-1.5 bg-[#111721] text-xs text-white hover:bg-slate-800"
									>
										{isSubmitting ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<Save className="h-3.5 w-3.5" />
										)}
										<Translate text={localizationConstants.calcNewCreateBtn} />
									</Button>
								)}
							</div>
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
							<Translate text={localizationConstants.calcNewCreateBtn} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
