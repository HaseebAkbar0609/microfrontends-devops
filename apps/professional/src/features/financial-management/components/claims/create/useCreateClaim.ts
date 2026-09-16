"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { CLAIMS_BASE_ROUTE, DEFAULT_OBJECTS } from "../../../constants/claims.constants";
import { claimsRepository } from "../../../utils/claimsRepository";
import type { ClaimFormData, ClaimDocument } from "../../../types/claims.types";

interface UseCreateClaimProps {
	initialClaimId?: string;
	initialTemplateId?: string;
}

export function useCreateClaim({
	initialClaimId,
	initialTemplateId,
}: UseCreateClaimProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<"basic" | "docs">("basic");
	const [templates] = useState(() => claimsRepository.getTemplates());
	const [isEditMode, setIsEditMode] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [viewingDoc, setViewingDoc] = useState<ClaimDocument | null>(null);

	const [formData, setFormData] = useState<ClaimFormData>(() => ({
		id: claimsRepository.getNextId(),
		supplier: "",
		linkedInvoice: "",
		object: "",
		objectId: "",
		objectName: "",
		responsible: "",
		deficiencyType: "",
		incidentDate: "",
		supplierContact: "",
		responseDeadline: "",
		deficiencyDescription: "",
		disputedAmount: "",
		desiredAction: "",
		templateId: undefined,
		templateName: undefined,
		title: "",
		description: "",
		status: "sent",
		documents: [],
	}));

	useEffect(() => {
		if (initialClaimId) {
			const existing = claimsRepository.getById(initialClaimId);
			if (existing) {
				setIsEditMode(true);
				setFormData({
					id: existing.id,
					supplier: existing.supplier,
					linkedInvoice: existing.linkedInvoice,
					object: existing.object,
					objectId: existing.objectId,
					objectName: existing.objectName,
					responsible: existing.responsible,
					deficiencyType: existing.deficiencyType,
					incidentDate: existing.incidentDate,
					supplierContact: existing.supplierContact,
					responseDeadline: existing.responseDeadline,
					deficiencyDescription: existing.deficiencyDescription,
					disputedAmount: existing.disputedAmount,
					desiredAction: existing.desiredAction,
					templateId: existing.templateId,
					templateName: existing.templateName,
					title: existing.title,
					description: existing.description,
					status: existing.status,
					documents: existing.documents,
				});
			}
		} else if (initialTemplateId) {
			const tpl = claimsRepository.getTemplateById(initialTemplateId);
			if (tpl) {
				setFormData((prev) => ({
					...prev,
					templateId: tpl.id,
					templateName: tpl.name,
					deficiencyType: tpl.deficiencyType,
					desiredAction: tpl.desiredAction,
					title: tpl.title,
					description: tpl.description,
				}));
			}
		}
	}, [initialClaimId, initialTemplateId]);

	const handleFieldChange = (
		field: keyof ClaimFormData,
		val: ClaimFormData[keyof ClaimFormData],
	) => {
		setFormData((prev) => {
			const updated = { ...prev, [field]: val };
			if (field === "object") {
				const matchedObj = DEFAULT_OBJECTS.find((o) => o.id === val);
				if (matchedObj) {
					updated.objectId = matchedObj.objectId;
					updated.objectName = matchedObj.name;
				}
			}
			return updated;
		});

		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const handleTemplateSelect = (templateId: string) => {
		const tpl = templates.find((t) => t.id === templateId);
		if (tpl) {
			setFormData((prev) => ({
				...prev,
				templateId: tpl.id,
				templateName: tpl.name,
				deficiencyType: tpl.deficiencyType,
				desiredAction: tpl.desiredAction,
				title: tpl.title,
				description: tpl.description,
			}));
			setErrors((prev) => {
				const next = { ...prev };
				delete next.deficiencyType;
				delete next.desiredAction;
				delete next.title;
				return next;
			});
		}
	};

	const handleAddDocument = (doc: Omit<ClaimDocument, "id">) => {
		const newDoc: ClaimDocument = {
			...doc,
			id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		};
		setFormData((prev) => ({
			...prev,
			documents: [...(prev.documents || []), newDoc],
		}));
		if (errors.documents) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next.documents;
				return next;
			});
		}
	};

	const handleRemoveDocument = (docId: string) => {
		setFormData((prev) => ({
			...prev,
			documents: (prev.documents || []).filter((d) => d.id !== docId),
		}));
	};

	const handleViewDocument = (doc: ClaimDocument) => {
		setViewingDoc(doc);
	};

	const validateStep1 = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (!formData.supplier) newErrors.supplier = t(localizationConstants.claimsValidationSupplier);
		if (!formData.linkedInvoice) newErrors.linkedInvoice = t(localizationConstants.claimsValidationLinkedInvoice);
		if (!formData.object) newErrors.object = t(localizationConstants.claimsValidationObject);
		if (!formData.deficiencyType) newErrors.deficiencyType = t(localizationConstants.claimsValidationDeficiencyType);
		if (!formData.incidentDate) newErrors.incidentDate = t(localizationConstants.claimsValidationIncidentDate);
		if (!formData.deficiencyDescription) newErrors.deficiencyDescription = t(localizationConstants.claimsValidationDeficiencyDesc);
		if (
			formData.disputedAmount === undefined ||
			formData.disputedAmount === "" ||
			Number(formData.disputedAmount) <= 0
		) {
			newErrors.disputedAmount = t(localizationConstants.claimsValidationAmount);
		}
		if (!formData.desiredAction) newErrors.desiredAction = t(localizationConstants.claimsValidationDesiredAction);
		if (!formData.title) newErrors.title = t(localizationConstants.claimsValidationTitle);

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = (): boolean => {
		const newErrors: Record<string, string> = {};
		if (!formData.documents || formData.documents.length === 0) {
			newErrors.documents = t(localizationConstants.claimsValidationDocsRequired);
		}
		setErrors((prev) => ({ ...prev, ...newErrors }));
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep1()) {
			setActiveTab("docs");
		}
	};

	const handlePrevious = () => {
		setActiveTab("basic");
	};

	const handleTabChange = (targetTab: "basic" | "docs") => {
		if (targetTab === "docs") {
			if (validateStep1()) {
				setActiveTab("docs");
			}
		} else {
			setActiveTab("basic");
		}
	};

	const handleSave = () => {
		const step1Valid = validateStep1();
		if (!step1Valid) {
			setActiveTab("basic");
			return;
		}

		const step2Valid = validateStep2();
		if (!step2Valid) {
			setActiveTab("docs");
			return;
		}

		if (isEditMode && initialClaimId) {
			claimsRepository.update(initialClaimId, formData);
		} else {
			claimsRepository.create(formData);
		}

		router.push(CLAIMS_BASE_ROUTE);
	};

	const handleCancel = () => {
		router.push(CLAIMS_BASE_ROUTE);
	};

	return {
		activeTab,
		setActiveTab: handleTabChange,
		handleNext,
		handlePrevious,
		templates,
		isEditMode,
		errors,
		viewingDoc,
		setViewingDoc,
		formData,
		handleFieldChange,
		handleTemplateSelect,
		handleAddDocument,
		handleRemoveDocument,
		handleViewDocument,
		handleSave,
		handleCancel,
	};
}

export default useCreateClaim;
