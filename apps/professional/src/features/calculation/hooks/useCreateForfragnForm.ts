"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createEnquiryAPIAction, type CreateEnquiryPayload } from "../api/createEnquiryApi";
import type {
	KalkylDocItem,
	KalkylLeverantorData,
	KalkylProjektData,
} from "../types/kalkyl";
import type { ForfragnKontaktData } from "../components/steps/ForfragnKontaktStep";

export const TOTAL_ENQUIRY_STEPS = 4;

export const DEFAULT_ENQUIRY_PROJEKT: KalkylProjektData = {
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

export const DEFAULT_ENQUIRY_KONTAKT: ForfragnKontaktData = {
	kontaktperson: "",
	fornamn: "",
	efternamn: "",
	address: "",
	postnummer: "",
	email: "",
	telefon: "",
	ort: "",
	roll: "",
};

export const DEFAULT_ENQUIRY_LEVERANTOR: KalkylLeverantorData = {
	suppliers: [],
};

export const DEFAULT_ENQUIRY_DOCUMENTS: KalkylDocItem[] = [];

export function useCreateForfragnForm(calcId?: string) {
	const t = useTranslate();
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const [createdId, setCreatedId] = useState<string>("");

	const [projekt, setProjekt] = useState<KalkylProjektData>(DEFAULT_ENQUIRY_PROJEKT);
	const [kontakt, setKontakt] = useState<ForfragnKontaktData>(DEFAULT_ENQUIRY_KONTAKT);
	const [leverantor, setLeverantor] = useState<KalkylLeverantorData>(DEFAULT_ENQUIRY_LEVERANTOR);
	const [documents, setDocuments] = useState<KalkylDocItem[]>(DEFAULT_ENQUIRY_DOCUMENTS);
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
		(patch: Partial<KalkylLeverantorData>) => setLeverantor((prev) => ({ ...prev, ...patch })),
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

	function validateStep(step: number): boolean {
		if (step === 1) {
			if (!projekt.projektNamn.trim()) {
				setShowErrors(true);
				showToast("error", t(localizationConstants.calcNewValidationNameRequired));
				return false;
			}
		}
		if (step === 2) {
			if (!kontakt.fornamn.trim()) {
				setShowErrors(true);
				showToast("error", t(localizationConstants.calcInquiryWizRequiredErr));
				return false;
			}
			if (kontakt.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kontakt.email.trim())) {
				showToast("error", t(localizationConstants.calcInquiryWizEmailErr));
				return false;
			}
		}
		setShowErrors(false);
		return true;
	}

	function handleNext() {
		if (currentStep >= TOTAL_ENQUIRY_STEPS) return;
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

	function handleSaveDraft() {
		showToast("success", t(localizationConstants.calcInquiryWizSaved));
	}

	async function handleSubmit() {
		if (!validateStep(1) || !validateStep(2)) {
			setCurrentStep(!projekt.projektNamn.trim() ? 1 : 2);
			return;
		}

		setIsSubmitting(true);
		try {
			const payload: CreateEnquiryPayload = {
				calc_id: calcId,
				project_name: projekt.projektNamn || "Ny Förfrågan",
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
				customer: {
					company_name: "Fastighetsbolaget AB",
					contact_person: kontakt.kontaktperson || undefined,
					first_name: kontakt.fornamn || undefined,
					last_name: kontakt.efternamn || undefined,
					address: kontakt.address || undefined,
					postal_code: kontakt.postnummer || undefined,
					city: kontakt.ort || undefined,
					email: kontakt.email || undefined,
					phone: kontakt.telefon || undefined,
					role: kontakt.roll || undefined,
				},
				documents: documents.map((d) => ({
					id: d.id,
					filename: d.namn,
					typ: d.typ,
					fileType: d.fileType,
				})),
				gdpr_accepted: gdprAccepted,
				suppliers: leverantor.suppliers || [],
			};

			const res = await createEnquiryAPIAction(payload);
			const newId = res.data?.id || calcId || `inquiry_${Date.now()}`;
			setCreatedId(newId);
			setIsSuccessOpen(true);
		} catch {
			showToast("error", t(localizationConstants.calcNewGenericError));
		} finally {
			setIsSubmitting(false);
		}
	}

	function handleViewEnquiry() {
		setIsSuccessOpen(false);
		if (calcId) {
			router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
		} else {
			router.push("/module/business/calculation/overview");
		}
	}

	function handleReturnDashboard() {
		setIsSuccessOpen(false);
		if (calcId) {
			router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
		} else {
			router.push("/module/business/calculation/overview");
		}
	}

	function handleCancel() {
		if (calcId) {
			router.push(`/module/business/calculation/overview/${calcId}/inquiry`);
		} else {
			router.push("/module/business/calculation/overview");
		}
	}

	return {
		currentStep,
		totalSteps: TOTAL_ENQUIRY_STEPS,
		isSubmitting,
		showErrors,
		isSuccessOpen,
		createdId,
		projekt,
		kontakt,
		leverantor,
		documents,
		gdprAccepted,
		setGdprAccepted,
		handleProjektChange,
		handleKontaktChange,
		handleLeverantorChange,
		handleAddDocument,
		handleRemoveDocument,
		handleNext,
		handleBack,
		handleTabClick,
		handleSaveDraft,
		handleSubmit,
		handleCancel,
		handleViewEnquiry,
		handleReturnDashboard,
	};
}
