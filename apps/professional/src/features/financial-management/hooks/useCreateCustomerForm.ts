"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createCustomerSchema } from "../schemas/createCustomer.schema";
import type {
	CreateCustomerFormData,
	CustomerRatingField,
	CustomerRatings,
	CustomerAttachedDocument,
	CustomerContactPerson,
	AssociatedPerson,
} from "../types/createCustomer.types";
import {
	DEFAULT_INITIAL_CUSTOMER_FORM_VALUES,
	STORAGE_KEY_CUSTOMER_DRAFT,
} from "../constants/createCustomer.constants";
import { customerOverviewRepository } from "../utils/customerOverviewRepository";
import { CUSTOMER_OVERVIEW_BASE_ROUTE } from "../constants/customerOverview.constants";

export const TOTAL_CUSTOMER_WIZARD_STEPS = 4;

export function useCreateCustomerForm() {
	const t = useTranslate();
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSavingDraft, setIsSavingDraft] = useState(false);

	const form = useForm<CreateCustomerFormData>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(createCustomerSchema) as any,
		defaultValues: DEFAULT_INITIAL_CUSTOMER_FORM_VALUES,
		mode: "onBlur",
	});

	const { trigger, getValues, setValue, watch } = form;
	const entityType = watch("entityType");
	const ratings = watch("ratings");
	const documents = watch("documents") || [];
	const contactPersons = watch("contactPersons") || [];
	const isRotRutEnabled = watch("isRotRutEnabled");
	const associatedPersons = watch("associatedPersons") || [];

	const validateStep = useCallback(
		async (step: number): Promise<boolean> => {
			if (step === 1) {
				const basicFields: (keyof CreateCustomerFormData)[] = [
					"visitingAddress",
					"visitingPostalCode",
					"visitingCity",
				];
				if (entityType === "company") {
					basicFields.push("companyName", "orgNo");
				} else {
					basicFields.push("firstName", "lastName", "personnummer");
				}
				return await trigger(basicFields);
			}

			if (step === 2) {
				return await trigger(["phone", "email"]);
			}

			return true;
		},
		[entityType, trigger],
	);

	const handleNext = useCallback(async () => {
		if (currentStep >= TOTAL_CUSTOMER_WIZARD_STEPS) return;

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
		(field: CustomerRatingField, score: number) => {
			const current = getValues("ratings") || {};
			setValue("ratings", { ...current, [field]: score } as CustomerRatings, {
				shouldDirty: true,
			});
		},
		[getValues, setValue],
	);

	const handleAddDocument = useCallback(
		(file: File) => {
			const newDoc: CustomerAttachedDocument = {
				id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				name: file.name,
				size: `${(file.size / 1024).toFixed(1)} KB`,
				type: file.type || "application/octet-stream",
				dateAdded: new Date().toISOString().slice(0, 10),
			};
			const currentDocs = getValues("documents") || [];
			setValue("documents", [...currentDocs, newDoc], { shouldDirty: true });
		},
		[getValues, setValue],
	);

	const handleRemoveDocument = useCallback(
		(id: string) => {
			const currentDocs = getValues("documents") || [];
			setValue(
				"documents",
				currentDocs.filter((d) => d.id !== id),
				{ shouldDirty: true },
			);
		},
		[getValues, setValue],
	);

	const handleAddContactPerson = useCallback(() => {
		const current = getValues("contactPersons") || [];
		const newPerson: CustomerContactPerson = {
			id: `contact-${Date.now()}`,
			firstName: "",
			lastName: "",
			mobilePhone: "",
			email: "",
			role: "Beställare",
			personalNo: "",
		};
		setValue("contactPersons", [...current, newPerson], { shouldDirty: true });
	}, [getValues, setValue],);

	const handleRemoveContactPerson = useCallback(
		(id: string) => {
			const current = getValues("contactPersons") || [];
			if (current.length <= 1) return;
			setValue(
				"contactPersons",
				current.filter((p) => p.id !== id),
				{ shouldDirty: true },
			);
		},
		[getValues, setValue],
	);

	const handleAddAssociatedPerson = useCallback(() => {
		const current = getValues("associatedPersons") || [];
		const newPerson: AssociatedPerson = {
			id: `assoc-${Date.now()}`,
			name: "",
			personalId: "",
			ownershipShare: 50,
		};
		setValue("associatedPersons", [...current, newPerson], { shouldDirty: true });
	}, [getValues, setValue]);

	const handleRemoveAssociatedPerson = useCallback(
		(id: string) => {
			const current = getValues("associatedPersons") || [];
			setValue(
				"associatedPersons",
				current.filter((p) => p.id !== id),
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
				localStorage.setItem(STORAGE_KEY_CUSTOMER_DRAFT, JSON.stringify(values));
			}
			showToast("info", t(localizationConstants.draftSaved));
		} catch {
			showToast("error", t(localizationConstants.customerCreateError));
		} finally {
			setIsSavingDraft(false);
		}
	}, [getValues, t]);

	const handleCancel = useCallback(() => {
		router.push(CUSTOMER_OVERVIEW_BASE_ROUTE);
	}, [router]);

	const onSubmit = useCallback(
		async (formData: CreateCustomerFormData) => {
			setIsSubmitting(true);
			try {
				const displayName =
					formData.entityType === "company"
						? formData.companyName || "Företag"
						: `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Privatperson";

				const regNumber =
					formData.entityType === "company"
						? formData.orgNo || ""
						: formData.personnummer || "";

				customerOverviewRepository.add({
					customerNo: formData.customerNo || `#M${Math.floor(100 + Math.random() * 900)}`,
					name: displayName,
					orgNo: regNumber,
					address: formData.visitingAddress,
					postNr: formData.visitingPostalCode,
					city: formData.visitingCity,
					country: "Sverige",
					phone: formData.phone,
					email: formData.email,
					status: formData.status === "inactive" ? "inactive" : "active",
					dateAdded: new Date().toISOString().slice(0, 10),
				});

				if (typeof window !== "undefined") {
					localStorage.removeItem(STORAGE_KEY_CUSTOMER_DRAFT);
				}

				showToast("success", t(localizationConstants.customerCreatedSuccess));
				router.push(CUSTOMER_OVERVIEW_BASE_ROUTE);
			} catch {
				showToast("error", t(localizationConstants.customerCreateError));
			} finally {
				setIsSubmitting(false);
			}
		},
		[router, t],
	);

	const submitForm = useCallback(() => {
		form.handleSubmit(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onSubmit as any,
			(errors) => {
				showToast("error", t(localizationConstants.validationFailedError));
				const errorKeys = Object.keys(errors);
				if (
					errorKeys.some((k) =>
						["companyName", "orgNo", "firstName", "lastName", "personnummer", "visitingAddress"].includes(k),
					)
				) {
					setCurrentStep(1);
				} else if (errorKeys.some((k) => ["phone", "email"].includes(k))) {
					setCurrentStep(2);
				}
			},
		)();
	}, [form, onSubmit, t]);

	return {
		form,
		currentStep,
		totalSteps: TOTAL_CUSTOMER_WIZARD_STEPS,
		isSubmitting,
		isSavingDraft,
		entityType,
		ratings,
		documents,
		contactPersons,
		isRotRutEnabled,
		associatedPersons,
		handleNext,
		handlePrevious,
		handleStepClick,
		handleRatingChange,
		handleAddDocument,
		handleRemoveDocument,
		handleAddContactPerson,
		handleRemoveContactPerson,
		handleAddAssociatedPerson,
		handleRemoveAssociatedPerson,
		handleSaveDraft,
		handleCancel,
		submitForm,
	};
}
