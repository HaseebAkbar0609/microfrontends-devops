"use client";

import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CALCULATION_DASHBOARD_QUERY_KEY, CALCULATION_OVERVIEW_QUERY_KEY } from "../api/calculationDashboard";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { parseCalculationContractSum } from "../utils/calculationAmount";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import {
	createCalculationAPIAction,
	getOffersForKalkylAction,
	type OfferDropdownOption,
} from "../api/createCalculation";
import type {
	CreateCalculationPayload,
	KalkylDocItem,
	KalkylKontaktData,
	KalkylProjektData,
} from "../types/kalkyl";

export const TOTAL_STEPS = 4;

export const DEFAULT_KONTAKT: KalkylKontaktData = {
	mode: "extend", // Defaults to Extern Kund as per Figma screen 1
	offert: "",
	// Entreprenör
	kunduppgifter: false,
	foretag: "",
	address: "",
	postNr: "",
	ort: "",
	mail: "",
	telefon: "",
	orgNr: "",
	// Kalkylansvarig
	kontaktperson: "",
	fornamn: "",
	efternamn: "",
	kontaktMail: "",
	mobil: "",
	roll: "",
	// Beställare (extend mode)
	bestellareKunduppgifter: false,
	bestellareForetag: "",
	bestellareAddress: "",
	bestellarePostNr: "",
	bestellareOrt: "",
	bestellareMail: "",
	bestellareTelefon: "",
	bestellareOrgNr: "",
	// Beställare Kontaktperson
	bestellareKontaktperson: "",
	bestellareFornamn: "",
	bestellareEfternamn: "",
	bestellareKontaktAddress: "",
	bestellareKontaktPostnummer: "",
	bestellareKontaktMail: "",
	bestellareTelefonDirect: "",
	bestellareKontaktOrt: "",
	bestellareRoll: "",
};

export const DEFAULT_PROJEKT: KalkylProjektData = {
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
	senasteDatum: "",
};

export function useCreateKalkylForm() {
    const queryClient = useQueryClient();
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const offerIdParam = searchParams.get("offerId");

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingOffers, setIsLoadingOffers] = useState(false);
	const [offerOptions, setOfferOptions] = useState<OfferDropdownOption[]>([]);
	const [showErrors, setShowErrors] = useState(false);

	const [kontakt, setKontakt] = useState<KalkylKontaktData>(DEFAULT_KONTAKT);
	const [projekt, setProjekt] = useState<KalkylProjektData>(DEFAULT_PROJEKT);
	const [documents, setDocuments] = useState<KalkylDocItem[]>([]);
	const [datumFran, setDatumFran] = useState("");
	const [datumTill, setDatumTill] = useState("");
	const [gdprAccepted, setGdprAccepted] = useState(false);

	// Load available offers on mount
	useEffect(() => {
		let isMounted = true;
		async function fetchOffers() {
			setIsLoadingOffers(true);
			try {
				const offers = await getOffersForKalkylAction();
				if (isMounted) {
					setOfferOptions(offers);
				}
			} catch {
				if (isMounted) setOfferOptions([]);
			} finally {
				if (isMounted) setIsLoadingOffers(false);
			}
		}
		fetchOffers();
		return () => {
			isMounted = false;
		};
	}, []);

	// Handle prefill if query param offerId is passed
	useEffect(() => {
		if (!offerIdParam) return;
		async function prefillFromOffer() {
			try {
				const res = await getOfferDetailByIdAPIAction(offerIdParam as string);
				if (res.success && res.data) {
					const o = res.data;
					const clientName = o.customer?.name || "";
					const nameParts = clientName.trim().split(" ");
					setKontakt((prev) => ({
						...prev,
						offert: offerIdParam as string,
						bestellareForetag: clientName,
						bestellareAddress: o.customer?.address || prev.bestellareAddress,
						bestellareMail: o.customer?.email || prev.bestellareMail,
						bestellareTelefon: o.customer?.phone || prev.bestellareTelefon,
						bestellareFornamn: nameParts[0] || prev.bestellareFornamn,
						bestellareEfternamn: nameParts.slice(1).join(" ") || prev.bestellareEfternamn,
					}));
					setProjekt((prev) => ({
						...prev,
						projektNr: offerIdParam as string,
						projektNamn: o.title || prev.projektNamn,
						projektAdress: o.customer?.address || prev.projektAdress,
						kontraktsumma: o.preliminaryBudgetPrice || prev.kontraktsumma,
						offertNr: offerIdParam as string,
					}));
				}
			} catch {
				// Silent fallback
			}
		}
		prefillFromOffer();
	}, [offerIdParam]);

	const handleKontaktChange = useCallback(
		(patch: Partial<KalkylKontaktData>) => setKontakt((prev) => ({ ...prev, ...patch })),
		[],
	);

	const handleProjektChange = useCallback(
		(patch: Partial<KalkylProjektData>) => setProjekt((prev) => ({ ...prev, ...patch })),
		[],
	);

	const handleKopplaOffert = useCallback(() => {
		if (!kontakt.offert) {
			showToast("error", t(localizationConstants.calcNewValjOffert));
			return;
		}
		const found = offerOptions.find((o) => o.id === kontakt.offert || o.code === kontakt.offert);
		if (found) {
			const nameParts = found.clientName.trim().split(" ");
			setKontakt((prev) => ({
				...prev,
				bestellareForetag: found.clientName || prev.bestellareForetag,
				bestellareAddress: found.address || prev.bestellareAddress,
				bestellareOrt: found.city || prev.bestellareOrt,
				bestellareMail: found.email || prev.bestellareMail,
				bestellareTelefon: found.phone || prev.bestellareTelefon,
				bestellareFornamn: nameParts[0] || prev.bestellareFornamn,
				bestellareEfternamn: nameParts.slice(1).join(" ") || prev.bestellareEfternamn,
			}));
			setProjekt((prev) => ({
				...prev,
				projektNr: found.code || prev.projektNr,
				projektNamn: found.title || prev.projektNamn,
				projektAdress: found.address || prev.projektAdress,
				ort: found.city || prev.ort,
				kontraktsumma: found.budget || prev.kontraktsumma,
				offertNr: found.code || prev.offertNr,
				senasteDatum: found.date || prev.senasteDatum,
			}));
			showToast("success", `${t(localizationConstants.calcNewKopplaOffert)}: ${found.title}`);
		}
	}, [kontakt.offert, offerOptions, t]);

	const handleAddDocument = useCallback(
		(doc: KalkylDocItem) => setDocuments((prev) => [...prev, doc]),
		[],
	);

	const handleRemoveDocument = useCallback(
		(id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id)),
		[],
	);

	function validateStep(step: number): boolean {
		if (step === 1) {
			if (kontakt.mode === "extend" && !kontakt.bestellareFornamn.trim()) {
				setShowErrors(true);
				showToast("error", t(localizationConstants.calcNewValidationNameRequired));
				return false;
			}
		}
		if (step === 2) {
			if (!projekt.projektNamn.trim()) {
				setShowErrors(true);
				showToast("error", t(localizationConstants.calcNewValidationNameRequired));
				return false;
			}
		}
		setShowErrors(false);
		return true;
	}

	function handleNext() {
		if (currentStep >= TOTAL_STEPS) return;
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => prev + 1);
		}
	}

	function handleBack() {
		if (currentStep <= 1) return;
		setCurrentStep((prev) => prev - 1);
	}

	function handleTabClick(step: number) {
		if (step < currentStep) {
			setCurrentStep(step);
		} else if (step > currentStep) {
			if (validateStep(currentStep)) {
				setCurrentStep(step);
			}
		}
	}

	async function handleSubmit() {
		if (![1, 2, 3, 4].every(validateStep)) return;
		if (documents.length || kontakt.offert) {
			showToast("error", t(localizationConstants.calcDashboardUnsupportedCreate));
			return;
		}
		setIsSubmitting(true);
		try {
			const payload: CreateCalculationPayload = {
				mode: kontakt.mode,
				offer_id: kontakt.offert || undefined,
				project_name: projekt.projektNamn.trim(),
				contract_sum: parseCalculationContractSum(projekt.kontraktsumma),
				project_number: projekt.projektNr || undefined,
				block_name: projekt.kvartersNamn || undefined,
				project_address: projekt.projektAdress || undefined,
				postal_code: projekt.postNr || undefined,
				city: projekt.ort || undefined,
				type: projekt.type || undefined,
				category: projekt.kategori || undefined,
				department: projekt.avdelning || undefined,
				offer_number: projekt.offertNr || undefined,
				start_date: projekt.startDatum || undefined,
				end_date: projekt.slutDatum || undefined,
				latest_offer_date: projekt.senasteDatum || undefined,
				contractor: {
					company_name: kontakt.foretag || undefined,
					address: kontakt.address || undefined,
					postal_code: kontakt.postNr || undefined,
					city: kontakt.ort || undefined,
					email: kontakt.mail || undefined,
					phone: kontakt.telefon || undefined,
					org_number: kontakt.orgNr || undefined,
					responsible: {
						contact_person: kontakt.kontaktperson || undefined,
						first_name: kontakt.fornamn || undefined,
						last_name: kontakt.efternamn || undefined,
						email: kontakt.kontaktMail || undefined,
						mobile: kontakt.mobil || undefined,
						role: kontakt.roll || undefined,
					},
				},
				client:
					kontakt.mode === "extend"
						? {
								company_name: kontakt.bestellareForetag || undefined,
								address: kontakt.bestellareAddress || undefined,
								postal_code: kontakt.bestellarePostNr || undefined,
								city: kontakt.bestellareOrt || undefined,
								email: kontakt.bestellareMail || undefined,
								phone: kontakt.bestellareTelefon || undefined,
								org_number: kontakt.bestellareOrgNr || undefined,
								contact: {
									contact_person: kontakt.bestellareKontaktperson || undefined,
									first_name: kontakt.bestellareFornamn || undefined,
									last_name: kontakt.bestellareEfternamn || undefined,
									address: kontakt.bestellareKontaktAddress || undefined,
									postal_code: kontakt.bestellareKontaktPostnummer || undefined,
									city: kontakt.bestellareKontaktOrt || undefined,
									email: kontakt.bestellareKontaktMail || undefined,
									phone: kontakt.bestellareTelefonDirect || undefined,
									role: kontakt.bestellareRoll || undefined,
								},
							}
						: undefined,
			};

			const res = await createCalculationAPIAction(payload);
			if (res.success) {
				await queryClient.invalidateQueries({ queryKey: [CALCULATION_DASHBOARD_QUERY_KEY] });
				await queryClient.invalidateQueries({ queryKey: [CALCULATION_OVERVIEW_QUERY_KEY] });
				showToast("success", t(localizationConstants.calcNewSuccessCreate));
				router.push("/module/business/calculation/overview");
			} else {
				showToast(
					"error",
					res.error && res.error !== "CALCULATION_CREATE_FAILED" && res.error !== "INVALID_RESPONSE"
						? res.error
						: t(localizationConstants.calcNewCreateError),
				);
			}
		} catch {
			showToast("error", t(localizationConstants.calcNewGenericError));
		} finally {
			setIsSubmitting(false);
		}
	}

	function handleCancel() {
		router.push("/module/business/calculation/overview");
	}

	return {
		currentStep,
		totalSteps: TOTAL_STEPS,
		isSubmitting,
		isLoadingOffers,
		showErrors,
		offerOptions,
		kontakt,
		projekt,
		documents,
		datumFran,
		datumTill,
		gdprAccepted,
		setDatumFran,
		setDatumTill,
		setGdprAccepted,
		handleKontaktChange,
		handleProjektChange,
		handleKopplaOffert,
		handleAddDocument,
		handleRemoveDocument,
		handleNext,
		handleBack,
		handleTabClick,
		handleSubmit,
		handleCancel,
	};
}
