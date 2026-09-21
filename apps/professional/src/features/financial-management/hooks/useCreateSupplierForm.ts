"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createSupplierSchema } from "../schemas/createSupplier.schema";
import type {
	CreateSupplierFormData,
	SupplierRatingField,
	SupplierRatings,
	SupplierAttachedDocument,
	SupplierContactPerson,
} from "../types/createSupplier.types";
import {
	DEFAULT_INITIAL_SUPPLIER_FORM_VALUES,
	STORAGE_KEY_SUPPLIER_DRAFT,
} from "../constants/createSupplier.constants";
import { supplierOverviewRepository } from "../utils/supplierOverviewRepository";
import { supplierDetailRepository } from "../utils/supplierDetailRepository";
import type { SupplierDetailData } from "../types/supplierDetail.types";
import { SUPPLIER_OVERVIEW_BASE_ROUTE } from "../constants/supplierOverview.constants";

export const TOTAL_SUPPLIER_WIZARD_STEPS = 3;

export function useCreateSupplierForm() {
	const t = useTranslate();
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSavingDraft, setIsSavingDraft] = useState(false);

	const form = useForm<CreateSupplierFormData>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(createSupplierSchema) as any,
		defaultValues: DEFAULT_INITIAL_SUPPLIER_FORM_VALUES,
		mode: "onBlur",
	});

	const { trigger, getValues, setValue, watch } = form;
	const ratings = watch("ratings");
	const documents = watch("documents") || [];
	const contactPersons = watch("contactPersons") || [];

	const validateStep = useCallback(
		async (step: number): Promise<boolean> => {
			if (step === 1) {
				const basicFields: (keyof CreateSupplierFormData)[] = [
					"companyName",
					"orgNo",
					"visitingAddress",
					"visitingPostalCode",
					"visitingCity",
				];
				return await trigger(basicFields);
			}

			if (step === 2) {
				return await trigger(["phone", "email"]);
			}

			return true;
		},
		[trigger],
	);

	const handleNext = useCallback(async () => {
		if (currentStep >= TOTAL_SUPPLIER_WIZARD_STEPS) return;

		const isValid = await validateStep(currentStep);
		if (!isValid) {
			showToast("error", t(localizationConstants.validationFailedError));
			return;
		}

		setCurrentStep((prev) => prev + 1);
	}, [currentStep, validateStep, t]);

	const handlePrevious = useCallback(() => {
		setCurrentStep((prev) => Math.max(1, prev - 1));
	}, []);

	const handleStepClick = useCallback(
		async (targetStep: number) => {
			if (targetStep <= currentStep) {
				setCurrentStep(targetStep);
				return;
			}

			for (let s = currentStep; s < targetStep; s++) {
				const isValid = await validateStep(s);
				if (!isValid) {
					showToast("error", t(localizationConstants.validationFailedError));
					return;
				}
			}

			setCurrentStep(targetStep);
		},
		[currentStep, validateStep, t],
	);

	const handleRatingChange = useCallback(
		(field: SupplierRatingField, score: number) => {
			const current = getValues("ratings") || {};
			setValue("ratings", { ...current, [field]: score } as SupplierRatings, {
				shouldDirty: true,
			});
		},
		[getValues, setValue],
	);

	const handleAddDocument = useCallback(
		(doc: SupplierAttachedDocument) => {
			const currentDocs = getValues("documents") || [];
			setValue("documents", [...currentDocs, doc], { shouldDirty: true });
		},
		[getValues, setValue],
	);

	const handleDeleteDocument = useCallback(
		(docId: string) => {
			const currentDocs = getValues("documents") || [];
			setValue(
				"documents",
				currentDocs.filter((d) => d.id !== docId),
				{ shouldDirty: true },
			);
		},
		[getValues, setValue],
	);

	const handleAddContactPerson = useCallback(() => {
		const current = getValues("contactPersons") || [];
		const newPerson: SupplierContactPerson = {
			id: `contact-${Date.now()}`,
			firstName: "",
			lastName: "",
			mobilePhone: "",
			email: "",
			role: "Säljare",
			personalNo: "",
		};
		setValue("contactPersons", [...current, newPerson], { shouldDirty: true });
	}, [getValues, setValue]);

	const handleUpdateContactPerson = useCallback(
		(index: number, field: keyof SupplierContactPerson, value: string) => {
			const current = [...(getValues("contactPersons") || [])];
			if (current[index]) {
				current[index] = { ...current[index], [field]: value };
				setValue("contactPersons", current, { shouldDirty: true });
			}
		},
		[getValues, setValue],
	);

	const handleDeleteContactPerson = useCallback(
		(index: number) => {
			const current = getValues("contactPersons") || [];
			setValue(
				"contactPersons",
				current.filter((_, i) => i !== index),
				{ shouldDirty: true },
			);
		},
		[getValues, setValue],
	);

	const handleSaveDraft = useCallback(() => {
		setIsSavingDraft(true);
		try {
			const values = getValues();
			if (typeof window !== "undefined") {
				localStorage.setItem(STORAGE_KEY_SUPPLIER_DRAFT, JSON.stringify(values));
			}
			showToast("success", t(localizationConstants.supplierToastDraftSaved));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSavingDraft(false);
		}
	}, [getValues, t]);

	const handleCancel = useCallback(() => {
		router.push(SUPPLIER_OVERVIEW_BASE_ROUTE);
	}, [router]);

	const handleSubmit = useCallback(
		async (data: CreateSupplierFormData) => {
			setIsSubmitting(true);
			try {
				const generatedLevNr =
					data.levNr && data.levNr.trim().length > 0
						? data.levNr
						: `#L${Math.floor(100 + Math.random() * 900)}`;

				// 1. Add to overview repository
				const newOverviewItem = supplierOverviewRepository.add({
					levNr: generatedLevNr,
					name: data.companyName,
					orgNo: data.orgNo,
					address: data.visitingAddress,
					postNr: data.visitingPostalCode,
					city: data.visitingCity,
					country: "Sverige",
					phone: data.phone,
					email: data.email,
					status: (data.status as "active" | "inactive" | "prospect") || "active",
					dateAdded: new Date().toISOString().split("T")[0],
				});

				// 2. Add to detail repository
				const fullDetail: SupplierDetailData = {
					id: newOverviewItem.id,
					levNr: generatedLevNr,
					name: data.companyName,
					status: data.status || "active",
					mainCategory: data.mainCategory || "Byggmaterial",
					department: data.department || "",
					region: data.region || "",
					orgNo: data.orgNo,
					vatRegNo: data.vatRegNo || "",
					visitingAddress: data.visitingAddress,
					visitingPostalCode: data.visitingPostalCode,
					visitingCity: data.visitingCity,
					visitingCountry: "Sverige",
					invoiceAddress: data.sameAsVisitingAddress
						? data.visitingAddress
						: data.invoiceAddress || data.visitingAddress,
					invoicePostalCode: data.sameAsVisitingAddress
						? data.visitingPostalCode
						: data.invoicePostalCode || data.visitingPostalCode,
					invoiceCity: data.sameAsVisitingAddress
						? data.visitingCity
						: data.invoiceCity || data.visitingCity,
					invoiceCountry: "Sverige",
					bankName: data.bankName || "",
					bankAccount: data.bankAccount || "",
					bankgiro: data.bankgiro || "",
					plusgiro: data.plusgiro || "",
					iban: data.iban || "",
					bic: data.bic || "",
					paymentDays: data.paymentDays || "30",
					interestRate: data.interestRate || "8",
					invoiceFee: data.invoiceFee || "0",
					collectionFee: data.collectionFee || "180",
					phone: data.phone,
					email: data.email,
					website: data.website || "",
					contactNotes: data.contactNotes || "",
					contactPersons: data.contactPersons.filter(
						(p) => p.firstName || p.lastName || p.email || p.mobilePhone,
					),
					ratings: data.ratings || {
						economy: 0,
						environment: 0,
						quality: 0,
						collaboration: 0,
						timeliness: 0,
					},
					documents: data.documents || [],
					additionalNotes: data.additionalNotes || "",
				};

				supplierDetailRepository.save(fullDetail);

				// Clean draft
				if (typeof window !== "undefined") {
					localStorage.removeItem(STORAGE_KEY_SUPPLIER_DRAFT);
				}

				showToast("success", t(localizationConstants.supplierToastCreated));
				router.push(SUPPLIER_OVERVIEW_BASE_ROUTE);
			} catch {
				showToast("error", t(localizationConstants.genericError));
			} finally {
				setIsSubmitting(false);
			}
		},
		[router, t],
	);

	return {
		form,
		currentStep,
		totalSteps: TOTAL_SUPPLIER_WIZARD_STEPS,
		isSubmitting,
		isSavingDraft,
		ratings,
		documents,
		contactPersons,
		handleNext,
		handlePrevious,
		handleStepClick,
		handleRatingChange,
		handleAddDocument,
		handleDeleteDocument,
		handleAddContactPerson,
		handleUpdateContactPerson,
		handleDeleteContactPerson,
		handleSaveDraft,
		handleCancel,
		handleSubmit: form.handleSubmit(handleSubmit),
	};
}
