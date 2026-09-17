"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useCases } from "../../../hooks/useCases";
import { CASES_BASE_ROUTE } from "../../../constants/cases.constants";
import type { CaseCategory, CaseFormData, CaseDocument } from "../../../types/cases.types";
import { CreateCaseHeader } from "./CreateCaseHeader";
import { CreateCaseTabs, type CreateCaseTab } from "./CreateCaseTabs";
import { BasicInfoCard } from "./BasicInfoCard";
import { MessageCard } from "./MessageCard";
import { DocumentsTab } from "./DocumentsTab";
import { FormActions } from "./FormActions";

export function CreateCasePage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { addCase } = useCases();

	const [activeTab, setActiveTab] = useState<CreateCaseTab>("basic_info");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({});

	// Generate auto ID matching Figma e.g. #M105
	const [formData, setFormData] = useState<CaseFormData>(() => {
		const autoId = `M${Math.floor(100 + Math.random() * 900)}`;
		return {
			id: autoId,
			title: "",
			category: "info",
			createdBy: "Stefan Eriksson",
			date: new Date().toISOString().split("T")[0],
			description: "",
			initialMessage: "",
			documents: [
				{
					id: "doc-init-1",
					name: "filename.pdf",
					date: "2024-05-10",
					fileType: "application/pdf",
					fileSize: "PDF",
					category: "document",
				},
				{
					id: "doc-init-2",
					name: "filename.pdf",
					date: "2024-05-10",
					fileType: "application/pdf",
					fileSize: "PDF",
					category: "document",
				},
			],
			images: [
				{
					id: "img-init-1",
					name: "17066.jpeg",
					date: "2024-05-10",
					fileType: "image/jpeg",
					fileSize: "520 KB",
					category: "image",
				},
			],
		};
	});

	const handleFieldChange = (field: keyof CaseFormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateBasicInfo = (): boolean => {
		const errs: Partial<Record<keyof CaseFormData, string>> = {};
		if (!formData.title.trim()) {
			errs.title = t(localizationConstants.casesValidationTitle);
		}
		if (!formData.description.trim()) {
			errs.description = t(localizationConstants.casesValidationDescription);
		}
		if (!formData.createdBy.trim()) {
			errs.createdBy = t(localizationConstants.casesValidationCreatedBy);
		}
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSave = () => {
		if (!validateBasicInfo()) {
			setActiveTab("basic_info");
			return;
		}

		setIsSubmitting(true);
		try {
			const newCase = addCase({
				caseNumber: formData.id.replace("#", ""),
				title: formData.title,
				category: formData.category,
				createdBy: formData.createdBy,
				createdRole: "Kund",
				date: formData.date,
				status: "not_started",
				description: formData.description,
				messages: formData.initialMessage?.trim()
					? [
							{
								id: `msg-${Date.now()}`,
								caseId: formData.id,
								author: formData.createdBy,
								content: formData.initialMessage,
								createdAt: `${formData.date} | 12:00 pm`,
							},
					  ]
					: [],
				documents: formData.documents,
				images: formData.images,
			});

			showToast("success", t(localizationConstants.casesToastCreated));
			router.push(`${CASES_BASE_ROUTE}/${newCase.id}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleNext = () => {
		if (activeTab === "basic_info") {
			if (validateBasicInfo()) {
				setActiveTab("documents");
			}
		} else {
			handleSave();
		}
	};

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			{/* Top Header */}
			<CreateCaseHeader />

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
						onChange={(val) => handleFieldChange("initialMessage", val)}
					/>
				</div>
			) : (
				<DocumentsTab
					documents={formData.documents}
					images={formData.images}
					onAddDocument={(doc) =>
						setFormData((prev) => ({
							...prev,
							documents: [...prev.documents, doc],
						}))
					}
					onRemoveDocument={(id) =>
						setFormData((prev) => ({
							...prev,
							documents: prev.documents.filter((d) => d.id !== id),
						}))
					}
					onAddImage={(img) =>
						setFormData((prev) => ({
							...prev,
							images: [...prev.images, img],
						}))
					}
					onRemoveImage={(id) =>
						setFormData((prev) => ({
							...prev,
							images: prev.images.filter((i) => i.id !== id),
						}))
					}
				/>
			)}

			{/* Bottom Action Buttons */}
			<FormActions
				activeTab={activeTab}
				isSubmitting={isSubmitting}
				onCancel={() => router.push(CASES_BASE_ROUTE)}
				onSave={handleSave}
				onNext={handleNext}
			/>
		</div>
	);
}

export default CreateCasePage;
