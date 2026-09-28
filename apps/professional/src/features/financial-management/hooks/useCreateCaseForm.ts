"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { revokeUrls } from "@/features/project/shared/recordFiles";
import { showToast } from "@/lib/toast";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { casesRoutes } from "../constants/cases.constants";
import type { CaseDocument, CaseFormData, CaseItem } from "../types/cases.types";
import { useCases } from "./useCases";

type CaseTab = "basic_info" | "documents";
type CaseErrors = Partial<Record<keyof CaseFormData, TranslationKeys>>;

/** The case being edited as the form holds it, or a blank one. */
function formValues(existing: CaseItem | undefined, nextNumber: string): CaseFormData {
	if (!existing) {
		return {
			id: nextNumber,
			title: "",
			category: "info",
			createdBy: "",
			date: new Date().toISOString().split("T")[0],
			description: "",
			initialMessage: "",
			documents: [],
			images: [],
		};
	}

	return {
		id: existing.caseNumber || existing.id,
		title: existing.title,
		category: existing.category,
		createdBy: existing.createdBy,
		date: existing.date,
		description: existing.description || "",
		initialMessage: existing.messages[0]?.content || "",
		documents: existing.documents || [],
		images: existing.images || [],
	};
}

/**
 * Skapa Ärende: the form's fields, which tab is open, what is missing, and
 * filing it.
 *
 * Attachments are not required — a case is what it says it is, and the
 * documents that support it may arrive later.
 */
export function useCreateCaseForm(basePath?: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslate();
	const routes = casesRoutes(basePath);
	const { getCaseById, addCase, updateCase, getNextCaseNumber } = useCases();

	const editId = searchParams.get("edit") || searchParams.get("id");
	const [activeTab, setActiveTab] = useState<CaseTab>("basic_info");
	const [errors, setErrors] = useState<CaseErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	/* Saving navigates, so a second press must not file a second case. */
	const savedRef = useRef(false);
	/* Files minted here belong to the case once it is filed; if the reader
	   walks away instead, this is what releases them. */
	const mintedRef = useRef<string[]>([]);
	useEffect(() => {
		const minted = mintedRef.current;
		return () => {
			if (!savedRef.current) revokeUrls(minted.map((url) => ({ url })));
		};
	}, []);

	const [formData, setFormData] = useState<CaseFormData>(() =>
		formValues(editId ? getCaseById(editId) : undefined, getNextCaseNumber()),
	);

	const setField = useCallback(<K extends keyof CaseFormData>(field: K, value: CaseFormData[K]) => {
		setFormData((previous) => ({ ...previous, [field]: value }));
		setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
	}, []);

	const addDocument = useCallback((document: CaseDocument) => {
		if (document.url) mintedRef.current.push(document.url);
		setFormData((previous) => ({ ...previous, documents: [...previous.documents, document] }));
	}, []);

	const removeDocument = useCallback((id: string) => {
		setFormData((previous) => ({ ...previous, documents: previous.documents.filter((doc) => doc.id !== id) }));
	}, []);

	const addImage = useCallback((image: CaseDocument) => {
		if (image.url) mintedRef.current.push(image.url);
		setFormData((previous) => ({ ...previous, images: [...previous.images, image] }));
	}, []);

	const removeImage = useCallback((id: string) => {
		setFormData((previous) => ({ ...previous, images: previous.images.filter((img) => img.id !== id) }));
	}, []);

	const validate = useCallback((): boolean => {
		const found: CaseErrors = {};
		if (!formData.title.trim()) found.title = localizationConstants.casesValidationTitle;
		if (!formData.category) found.category = localizationConstants.casesValidationCategory;
		if (!formData.createdBy.trim()) found.createdBy = localizationConstants.casesValidationCreatedBy;
		if (!formData.description.trim()) found.description = localizationConstants.casesValidationDescription;
		if (!formData.initialMessage?.trim()) found.initialMessage = localizationConstants.casesValidationMessage;

		setErrors(found);
		if (Object.keys(found).length === 0) return true;

		/* Everything required lives on the first tab, so that is where to look. */
		setActiveTab("basic_info");
		showToast("error", t(localizationConstants.casesValidationRequiredFields));
		return false;
	}, [formData, t]);

	const leave = useCallback(
		() => router.push(editId ? routes.detail(editId) : routes.list),
		[editId, router, routes],
	);

	const save = useCallback(() => {
		if (savedRef.current || !validate()) return;

		savedRef.current = true;
		setIsSubmitting(true);
		try {
			if (editId) {
				updateCase(editId, {
					title: formData.title,
					category: formData.category,
					createdBy: formData.createdBy,
					date: formData.date,
					description: formData.description,
					documents: formData.documents,
					images: formData.images,
				});
				showToast("success", t(localizationConstants.casesToastUpdated));
				router.push(routes.detail(editId));
				return;
			}

			const created = addCase({ ...formData, id: formData.id.replace("#", "") });
			showToast("success", t(localizationConstants.casesToastCreated));
			router.push(routes.detail(created.id));
		} catch {
			/* Nothing was filed, so let the reader try again. */
			savedRef.current = false;
			setIsSubmitting(false);
			showToast("error", t(localizationConstants.genericError));
		}
	}, [addCase, editId, formData, router, routes, t, updateCase, validate]);

	const next = useCallback(() => {
		if (activeTab === "basic_info") {
			if (validate()) setActiveTab("documents");
			return;
		}
		save();
	}, [activeTab, save, validate]);

	const pageTitle = useMemo(
		() => t(editId ? localizationConstants.casesEditTitle : localizationConstants.casesCreateTitle),
		[editId, t],
	);

	return {
		formData,
		errors,
		activeTab,
		setActiveTab,
		setField,
		addDocument,
		removeDocument,
		addImage,
		removeImage,
		isSubmitting,
		isEditMode: Boolean(editId),
		pageTitle,
		save,
		next,
		leave,
	};
}

export type CreateCaseFormState = ReturnType<typeof useCreateCaseForm>;
