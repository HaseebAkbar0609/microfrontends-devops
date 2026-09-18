"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONSTRUCTION_LOG_CONSTANTS } from "../constants/constructionLog.constants";
import { createConstructionLog } from "@/api-actions/orders/constructionLog";
import type {
	CreateLogFormData,
	WeatherInfo,
} from "../types/constructionLog.types";

const TODAY = (() => {
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	const dd = String(now.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
})();

export function useCreateConstructionLog(orderId?: string) {
	const t = useTranslate();
	const router = useRouter();
	const targetOrderId = orderId || CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID;

	const [currentStep, setCurrentStep] = useState<1 | 2>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [formData, setFormData] = useState<CreateLogFormData>({
		step1: {
			date: TODAY,
			author: "",
			weather: {
				location: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_LOCATION,
				date: TODAY,
				temperature: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_TEMP,
				tempUnit: CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.CELSIUS,
				weatherCondition: CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SUNNY,
				description: "",
				otherNote: "",
			},
		},
		step2: {
			workforce: [],
			activities: [],
			machines: [],
			deviations: [],
			generalNotes: "",
			selfInspectionNote: "",
		},
	});

	const updateStep1 = useCallback((patch: Partial<CreateLogFormData["step1"]>) => {
		setFormData((prev) => ({ ...prev, step1: { ...prev.step1, ...patch } }));
		setErrors({});
	}, []);

	const updateStep1Weather = useCallback((patch: Partial<WeatherInfo>) => {
		setFormData((prev) => ({
			...prev,
			step1: { ...prev.step1, weather: { ...prev.step1.weather, ...patch } },
		}));
		setErrors({});
	}, []);

	const updateStep2 = useCallback((patch: Partial<CreateLogFormData["step2"]>) => {
		setFormData((prev) => ({ ...prev, step2: { ...prev.step2, ...patch } }));
		setErrors({});
	}, []);

	const validateStep1 = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};
		if (!formData.step1.date) {
			newErrors.date = t(localizationConstants.orderDagbokValidationErrorDate);
		}
		if (!formData.step1.author) {
			newErrors.author = t(localizationConstants.orderDagbokValidationErrorAuthor);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData.step1.date, formData.step1.author, t]);

	const validateStep2 = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};
		if (formData.step2.workforce.length === 0) {
			newErrors.workforce = t(localizationConstants.orderDagbokValidationErrorWorkforce);
		}
		if (formData.step2.activities.length === 0) {
			newErrors.activities = t(localizationConstants.orderDagbokValidationErrorActivities);
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData.step2.workforce, formData.step2.activities, t]);

	const handleNext = useCallback(() => {
		if (currentStep === 1 && !validateStep1()) return;
		if (currentStep === 2 && !validateStep2()) return;
		if (currentStep < 2) {
			setCurrentStep((prev) => (prev + 1) as 1 | 2);
		}
	}, [currentStep, validateStep1, validateStep2]);

	const handleBack = useCallback(() => {
		if (currentStep > 1) {
			setCurrentStep((prev) => (prev - 1) as 1 | 2);
		}
	}, [currentStep]);

	const handleCancel = useCallback(() => {
		router.back();
	}, [router]);

	const submitLog = useCallback(
		async (status: "draft" | "published") => {
			setIsSubmitting(true);
			try {
				await createConstructionLog(
					{
						id: "",
						orderId: targetOrderId,
						date: formData.step1.date,
						projectName: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_PROJECT_NAME,
						projectNo: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID,
						constructionDay: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_CONSTRUCTION_DAY,
						address: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ADDRESS,
						weather: formData.step1.weather,
						workforce: formData.step2.workforce,
						activities: formData.step2.activities,
						machines: formData.step2.machines,
						deviations: formData.step2.deviations,
						generalNotes: formData.step2.generalNotes,
						selfInspectionNote: formData.step2.selfInspectionNote,
						signatures: {
							siteManager: { name: "", role: "", signed: false },
							client: { name: "", role: "", signed: false },
						},
						status,
						createdAt: "",
						updatedAt: "",
					},
					targetOrderId
				);
				const msgKey =
					status === "draft"
						? localizationConstants.orderDagbokToastCreated
						: localizationConstants.orderDagbokToastPublished;
				toast.success(t(msgKey));
				router.back();
			} catch {
				toast.error(t(localizationConstants.orderDagbokToastCreateError));
			} finally {
				setIsSubmitting(false);
			}
		},
		[formData, targetOrderId, t, router]
	);

	const handlePublish = useCallback(() => {
		if (!validateStep1()) {
			setCurrentStep(1);
			return;
		}
		submitLog("published");
	}, [validateStep1, submitLog]);

	return {
		currentStep,
		isSubmitting,
		errors,
		formData,
		updateStep1,
		updateStep1Weather,
		updateStep2,
		handleNext,
		handleBack,
		handleCancel,
		handlePublish,
	};
}
