"use client";

import { useState, useMemo, useCallback } from "react";
import { ATA_CONSTANTS } from "../constants/ata.constants";
import type {
	CreateAtaFormData,
	DetailedLineItem,
	AttachedDocument,
	CreateAtaSummary,
} from "../types/ata.types";
import {
	INITIAL_CREATE_ATA_FORM_DATA,
	MOCK_CREATE_ATA_SUMMARY,
	MOCK_STAFF_LINE_ITEMS,
	MOCK_MATERIAL_LINE_ITEMS,
	MOCK_MACHINE_LINE_ITEMS,
	MOCK_UE_LINE_ITEMS,
	MOCK_SUPPLIER_ATA_LINE_ITEMS,
	MOCK_ATTACHED_DOCUMENTS,
} from "../data/createAta.mock";
import {
	createAtaAction,
	sendAtaAction,
	uploadAtaDocumentAction,
} from "@/api-actions/orders/ata";
import { validateCreateAtaForm } from "../validation/createAta.schema";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";

export interface UseCreateAtaProps {
	orderId?: string;
	onSuccess?: (actionType: "draft" | "send") => void;
	onCancel?: () => void;
}

export function useCreateAta({
	orderId = ATA_CONSTANTS.DEFAULT_ORDER_ID,
	onSuccess,
	onCancel,
}: UseCreateAtaProps = {}) {
	const t = useTranslate();
	const [currentStep, setCurrentStep] = useState<number>(ATA_CONSTANTS.STEPS.STEP_1);
	const [formData, setFormData] = useState<CreateAtaFormData>(() => ({
		...INITIAL_CREATE_ATA_FORM_DATA,
		orderId,
	}));
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	// Detailed line items
	const [staffItems, setStaffItems] = useState<DetailedLineItem[]>(MOCK_STAFF_LINE_ITEMS);
	const [materialItems, setMaterialItems] = useState<DetailedLineItem[]>(MOCK_MATERIAL_LINE_ITEMS);
	const [machineItems, setMachineItems] = useState<DetailedLineItem[]>(MOCK_MACHINE_LINE_ITEMS);
	const [ueItems, setUeItems] = useState<DetailedLineItem[]>(MOCK_UE_LINE_ITEMS);
	const [supplierAtaItems, setSupplierAtaItems] = useState<DetailedLineItem[]>(MOCK_SUPPLIER_ATA_LINE_ITEMS);

	// Attached documents
	const [attachedDocs, setAttachedDocs] = useState<AttachedDocument[]>(MOCK_ATTACHED_DOCUMENTS);

	// Accordion expand/collapse states for Step 2
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
		orderer: true,
		orderInfo: true,
		staff: true,
		material: true,
		machine: true,
		ue: true,
		supplierAta: true,
		documents: true,
	});

	const toggleSection = useCallback((sectionKey: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionKey]: !prev[sectionKey],
		}));
	}, []);

	const updateField = useCallback(<K extends keyof CreateAtaFormData>(
		key: K,
		value: CreateAtaFormData[K]
	) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		setErrors((prev) => {
			if (prev[key]) {
				const next = { ...prev };
				delete next[key];
				return next;
			}
			return prev;
		});
	}, []);

	const summary: CreateAtaSummary = useMemo(() => {
		const totalMaterial = materialItems.reduce((acc, item) => acc + (item.amount || 0), 0) || MOCK_CREATE_ATA_SUMMARY.totalMaterial;
		const totalMachines = machineItems.reduce((acc, item) => acc + (item.amount || 0), 0) || MOCK_CREATE_ATA_SUMMARY.totalMachines;
		const totalUe = ueItems.reduce((acc, item) => acc + (item.amount || 0), 0) || MOCK_CREATE_ATA_SUMMARY.totalUe;
		const totalAtaSupplier = supplierAtaItems.reduce((acc, item) => acc + (item.amount || 0), 0) || MOCK_CREATE_ATA_SUMMARY.totalAtaSupplier;
		const ownStaffCount = staffItems.length || MOCK_CREATE_ATA_SUMMARY.ownStaffCount;

		return {
			ataNr: formData.eatingNumber.replace(/\D/g, "") || MOCK_CREATE_ATA_SUMMARY.ataNr,
			projectCode: MOCK_CREATE_ATA_SUMMARY.projectCode,
			locations: MOCK_CREATE_ATA_SUMMARY.locations,
			ownStaffCount,
			totalMaterial,
			totalMachines,
			totalUe,
			totalAtaSupplier,
		};
	}, [materialItems, machineItems, ueItems, supplierAtaItems, staffItems.length, formData.eatingNumber]);

	const validateStep1 = useCallback((): boolean => {
		const validation = validateCreateAtaForm(formData);
		if (!validation.isValid) {
			const localizedErrors: Record<string, string> = {};
			for (const [key, msgKey] of Object.entries(validation.errors)) {
				const localizedMsg = localizationConstants[msgKey as keyof typeof localizationConstants];
				localizedErrors[key] = localizedMsg ? t(localizedMsg) : msgKey;
			}
			setErrors(localizedErrors);
			return false;
		}
		setErrors({});
		return true;
	}, [formData, t]);

	const handleNextStep = useCallback(() => {
		if (validateStep1()) {
			setCurrentStep(ATA_CONSTANTS.STEPS.STEP_2);
			if (typeof window !== "undefined") {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	}, [validateStep1]);

	const handlePrevStep = useCallback(() => {
		setCurrentStep(ATA_CONSTANTS.STEPS.STEP_1);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, []);

	const handleSaveDraft = useCallback(async (): Promise<boolean> => {
		if (!validateStep1()) {
			return false;
		}
		setIsSubmitting(true);
		try {
			const res = await createAtaAction(orderId, {
				...formData,
				orderId,
				status: ATA_CONSTANTS.STATUSES.DRAFT,
				staffItems,
				materialItems,
				machineItems,
				ueItems,
				supplierAtaItems,
				attachedDocs,
			});
			if (res.success) {
				onSuccess?.("draft");
				return true;
			}
			showToast("error", res.error || t(localizationConstants.createAtaSaveFailed));
			return false;
		} catch (error) {
			console.error("[useCreateAta.handleSaveDraft] Error:", error);
			showToast("error", t(localizationConstants.createAtaSaveFailed));
			return false;
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, orderId, staffItems, materialItems, machineItems, ueItems, supplierAtaItems, attachedDocs, onSuccess, t, validateStep1]);

	const handleSendApproval = useCallback(async (): Promise<boolean> => {
		if (!validateStep1()) {
			return false;
		}
		setIsSubmitting(true);
		try {
			const res = await createAtaAction(orderId, {
				...formData,
				orderId,
				status: ATA_CONSTANTS.STATUSES.PENDING,
				staffItems,
				materialItems,
				machineItems,
				ueItems,
				supplierAtaItems,
				attachedDocs,
			});
			if (res.success && res.data) {
				const sendRes = await sendAtaAction(orderId, res.data.id);
				if (sendRes.success) {
					onSuccess?.("send");
					return true;
				}
				showToast("error", sendRes.error || t(localizationConstants.createAtaSendFailed));
				return false;
			}
			showToast("error", res.error || t(localizationConstants.createAtaSendFailed));
			return false;
		} catch (error) {
			console.error("[useCreateAta.handleSendApproval] Error:", error);
			showToast("error", t(localizationConstants.createAtaSendFailed));
			return false;
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, orderId, staffItems, materialItems, machineItems, ueItems, supplierAtaItems, attachedDocs, onSuccess, t, validateStep1]);

	const handleAddDocument = useCallback(async (files: FileList | File[]) => {
		const fileArray = Array.from(files);
		for (const [idx, file] of fileArray.entries()) {
			const isPdf = file.name.endsWith(".pdf");
			const isDoc = file.name.endsWith(".doc") || file.name.endsWith(".docx");
			const isPpt = file.name.endsWith(".ppt") || file.name.endsWith(".pptx");
			const fileType: AttachedDocument["fileType"] = isPdf ? "pdf" : isDoc ? "doc" : isPpt ? "ppt" : "image";
			const sizeKb = Math.round(file.size / 1024);
			const fileSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

			let uploadedUrl = "";
			try {
				const uploadRes = await uploadAtaDocumentAction(orderId, file);
				if (uploadRes.success && uploadRes.data?.fileUrl) {
					uploadedUrl = uploadRes.data.fileUrl;
				}
			} catch (err) {
				console.warn("[useCreateAta.handleAddDocument] Upload warning:", err);
			}

			const newDoc: AttachedDocument = {
				id: `doc-${Date.now()}-${idx}`,
				date: new Date().toISOString().split("T")[0],
				referenceNumber: file.name.split(".")[0],
				fileName: file.name,
				fileType,
				fileSize,
				fileUrl: uploadedUrl,
			};

			setAttachedDocs((prev) => [...prev, newDoc]);
		}
	}, [orderId]);

	const handleDeleteDocument = useCallback((id: string) => {
		setAttachedDocs((prev) => prev.filter((doc) => doc.id !== id));
	}, []);

	return {
		currentStep,
		formData,
		errors,
		isSubmitting,
		summary,
		staffItems,
		setStaffItems,
		materialItems,
		setMaterialItems,
		machineItems,
		setMachineItems,
		ueItems,
		setUeItems,
		supplierAtaItems,
		setSupplierAtaItems,
		attachedDocs,
		expandedSections,
		toggleSection,
		updateField,
		handleNextStep,
		handlePrevStep,
		handleSaveDraft,
		handleSendApproval,
		handleAddDocument,
		handleDeleteDocument,
		handleCancel: onCancel,
	};
}
