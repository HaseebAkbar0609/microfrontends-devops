"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useCases } from "../../../hooks/useCases";
import { CASES_BASE_ROUTE } from "../../../constants/cases.constants";
import type { CaseFormData } from "../../../types/cases.types";
import { CreateCaseHeader } from "./CreateCaseHeader";
import { CreateCaseTabs, type CreateCaseTab } from "./CreateCaseTabs";
import { BasicInfoCard } from "./BasicInfoCard";
import { MessageCard } from "./MessageCard";
import { DocumentsTab } from "./DocumentsTab";
import { FormActions } from "./FormActions";

export function CreateCasePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editId = searchParams.get("edit") || searchParams.get("id");
	const { t } = useTranslation();
	const { addCase, updateCase, getCaseById, getNextCaseNumber } = useCases();

	const [activeTab, setActiveTab] = useState<CreateCaseTab>("basic_info");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({});
	const [documentsError, setDocumentsError] = useState<string>("");

	// Initialize clean blank form data for new cases, or load existing for edit
	const [formData, setFormData] = useState<CaseFormData>(() => {
		if (editId) {
			const existing = getCaseById(editId);
			if (existing) {
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
		}

		return {
			id: getNextCaseNumber(),
			title: "",
			category: "info",
			createdBy: "",
			date: new Date().toISOString().split("T")[0],
			description: "",
			initialMessage: "",
			documents: [],
			images: [],
		};
	});

	useEffect(() => {
		if (editId) {
			const existing = getCaseById(editId);
			if (existing) {
				setFormData({
					id: existing.caseNumber || existing.id,
					title: existing.title,
					category: existing.category,
					createdBy: existing.createdBy,
					date: existing.date,
					description: existing.description || "",
					initialMessage: existing.messages[0]?.content || "",
					documents: existing.documents || [],
					images: existing.images || [],
				});
			}
		}
	}, [editId, getCaseById]);

	const handleFieldChange = <K extends keyof CaseFormData>(
		field: K,
		value: CaseFormData[K]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateBasicInfo = useCallback((): boolean => {
		const errs: Partial<Record<keyof CaseFormData, string>> = {};
		if (!formData.title.trim()) {
			errs.title = t(localizationConstants.casesValidationTitle);
		}
		if (!formData.category) {
			errs.category = t(localizationConstants.casesValidationCategory);
		}
		if (!formData.createdBy.trim()) {
			errs.createdBy = t(localizationConstants.casesValidationCreatedBy);
		}
		if (!formData.description.trim()) {
			errs.description = t(localizationConstants.casesValidationDescription);
		}
		if (!formData.initialMessage?.trim()) {
			errs.initialMessage = t(localizationConstants.casesValidationMessage);
		}
		setErrors(errs);
		return Object.keys(errs).length === 0;
	}, [formData, t]);

	const validateDocuments = useCallback((): boolean => {
		const hasAttachments =
			formData.documents.length > 0 || formData.images.length > 0;
		if (!hasAttachments) {
			const msg = t(localizationConstants.casesValidationDocuments);
			setDocumentsError(msg);
			return false;
		}
		setDocumentsError("");
		return true;
	}, [formData.documents.length, formData.images.length, t]);

	const validateBothTabs = useCallback((): boolean => {
		const basicValid = validateBasicInfo();
		const docsValid = validateDocuments();

		if (!basicValid) {
			setActiveTab("basic_info");
			showToast("error", t(localizationConstants.casesValidationFillBothTabs));
			return false;
		}

		if (!docsValid) {
			setActiveTab("documents");
			showToast("error", t(localizationConstants.casesValidationDocuments));
			return false;
		}

		return true;
	}, [validateBasicInfo, validateDocuments, t]);

	const handleBack = () => {
		if (editId) {
			router.push(`${CASES_BASE_ROUTE}/${editId}`);
		} else {
			router.push(CASES_BASE_ROUTE);
		}
	};

	const handleSave = () => {
		if (!validateBothTabs()) {
			return;
		}

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
				router.push(`${CASES_BASE_ROUTE}/${editId}`);
			} else {
				const newCase = addCase({
					id: formData.id.replace("#", ""),
					title: formData.title,
					category: formData.category,
					createdBy: formData.createdBy,
					date: formData.date,
					description: formData.description,
					initialMessage: formData.initialMessage,
					documents: formData.documents,
					images: formData.images,
				});
				showToast("success", t(localizationConstants.casesToastCreated));
				router.push(`${CASES_BASE_ROUTE}/${newCase.id}`);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleNext = () => {
		if (activeTab === "basic_info") {
			if (validateBasicInfo()) {
				setActiveTab("documents");
			} else {
				showToast("error", t(localizationConstants.casesValidationFillBothTabs));
			}
		} else {
			handleSave();
		}
	};

	const pageTitle = editId
		? t(localizationConstants.casesEditTitle)
		: t(localizationConstants.casesCreateTitle);

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Header with consistent back navigation */}
			<CreateCaseHeader title={pageTitle} onBack={handleBack} />

			{/* Sub Tabs matching Figma */}
			<CreateCaseTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab Body */}
			{activeTab === "basic_info" ? (
				<div className="space-y-6">
					<BasicInfoCard
						formData={formData}
						errors={errors}
						onChange={handleFieldChange}
					/>
					<MessageCard
						message={formData.initialMessage || ""}
						error={errors.initialMessage}
						onChange={(val) => handleFieldChange("initialMessage", val)}
					/>
				</div>
			) : (
				<DocumentsTab
					documents={formData.documents}
					images={formData.images}
					error={documentsError}
					onAddDocument={(doc) => {
						setDocumentsError("");
						setFormData((prev) => ({
							...prev,
							documents: [...prev.documents, doc],
						}));
					}}
					onRemoveDocument={(id) =>
						setFormData((prev) => ({
							...prev,
							documents: prev.documents.filter((d) => d.id !== id),
						}))
					}
					onAddImage={(img) => {
						setDocumentsError("");
						setFormData((prev) => ({
							...prev,
							images: [...prev.images, img],
						}));
					}}
					onRemoveImage={(id) =>
						setFormData((prev) => ({
							...prev,
							images: prev.images.filter((i) => i.id !== id),
						}))
					}
				/>
			)}

			{/* Bottom Action Buttons with consistent cancel handler */}
			<FormActions
				activeTab={activeTab}
				isSubmitting={isSubmitting}
				isEditMode={Boolean(editId)}
				onCancel={handleBack}
				onPrevious={() => setActiveTab("basic_info")}
				onSave={handleSave}
				onNext={handleNext}
			/>
		</div>
	);
}

export default CreateCasePage;
