"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ClaimTemplateFormData } from "@/features/financial-management/types/claims.types";
import {
	CLAIMS_BASE_ROUTE,
	DEFAULT_TEMPLATE_DATES,
	DEFAULT_TEMPLATE_TITLES,
} from "@/features/financial-management/constants/claims.constants";
import { claimsRepository } from "@/features/financial-management/utils/claimsRepository";

interface UseCreateClaimTemplateOptions {
	templateId?: string;
}

export function useCreateClaimTemplate({
	templateId,
}: UseCreateClaimTemplateOptions = {}) {
	const router = useRouter();
	const isEditMode = Boolean(templateId);

	const [generatedId, setGeneratedId] = useState<string>(() => {
		if (templateId) {
			const existing = claimsRepository.getTemplateById(templateId);
			if (existing) return existing.id;
			return templateId;
		}
		return claimsRepository.getNextTemplateId();
	});

	const [formData, setFormData] = useState<ClaimTemplateFormData>(() => {
		if (templateId) {
			const existing = claimsRepository.getTemplateById(templateId);
			if (existing) {
				return {
					name: existing.name,
					title: existing.title,
					date: existing.date,
					description: existing.description,
				};
			}
		}
		return {
			name: "Mall Namn",
			title: DEFAULT_TEMPLATE_TITLES[0],
			date: DEFAULT_TEMPLATE_DATES[0],
			description: "",
		};
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (templateId) {
			const existing = claimsRepository.getTemplateById(templateId);
			if (existing) {
				setGeneratedId(existing.id);
				setFormData({
					name: existing.name,
					title: existing.title,
					date: existing.date,
					description: existing.description,
				});
			}
		}
	}, [templateId]);

	const handleFieldChange = useCallback(
		(field: keyof ClaimTemplateFormData, value: string) => {
			setFormData((prev: ClaimTemplateFormData) => ({ ...prev, [field]: value }));
			setErrors((prev: Record<string, string>) => {
				const fieldKey = field as string;
				if (!prev[fieldKey]) return prev;
				const updated = { ...prev };
				delete updated[fieldKey];
				return updated;
			});
		},
		[],
	);

	const validate = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};
		if (!formData.title.trim()) {
			newErrors.title = "Vänligen ange en titel";
		}
		if (!formData.description.trim()) {
			newErrors.description = "Vänligen ange en beskrivning";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleCancel = useCallback(() => {
		router.push(`${CLAIMS_BASE_ROUTE}?tab=mallar`);
	}, [router]);

	const handleSave = useCallback(() => {
		if (!validate()) return;

		if (isEditMode && templateId) {
			claimsRepository.updateTemplate(templateId, formData);
		} else {
			claimsRepository.createTemplate(formData);
		}

		router.push(`${CLAIMS_BASE_ROUTE}?tab=mallar`);
	}, [formData, isEditMode, templateId, validate, router]);

	return {
		isEditMode,
		generatedId,
		formData,
		errors,
		handleFieldChange,
		handleCancel,
		handleSave,
	};
}

export default useCreateClaimTemplate;
