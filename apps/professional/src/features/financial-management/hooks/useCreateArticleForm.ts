"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ApiError } from "@/types/api";
import {
	type CreateArticleFormData,
	type PriceListRow,
} from "../types/article.types";
import { createArticleSchema } from "../schemas/createArticle.schema";
import {
	createArticleAPIAction,
	updateArticleAPIAction,
	getArticleDetailAPIAction,
} from "../utils/articleRepository";
import { ARTICLE_OVERVIEW_BASE_ROUTE } from "../constants/article.constants";

export const ARTICLE_FORM_TABS = [
	{ key: 1, labelKey: localizationConstants.createArticleBasicInfoTab },
	{ key: 2, labelKey: localizationConstants.createArticleStructuredInfoTab },
];

export const TOTAL_ARTICLE_STEPS = 2;

export const STEP_FIELDS: Record<number, (keyof CreateArticleFormData)[]> = {
	1: [
		"articleNr",
		"benamning",
		"typAvArtikel",
		"enhet",
		"kalkylkostnad",
		"moms",
		"forsaljning",
	],
	2: [],
};

export const EMPTY_ARTICLE_DEFAULTS: CreateArticleFormData = {
	articleNr: "",
	benamning: "",
	ean: "",
	leverantor: "",
	enhet: "st",
	typAvArtikel: "Standardartikel",
	kalkylkostnad: "",
	moms: "25%",
	forsaljning: "",
	prisSek: "",
	rabattProcent: "",
	avrundning: "Ingen",
	bruttovinstProcent: "",
	valuta: "SEK",
	marginal: "",
	streckkod: "",
	artikelgrupp: "",
	avdelning: "",
	vikt: "",
	volym: "",
	langd: "",
	bredd: "",
	hojd: "",
	material: "",
	forsaljningSESkattskyldighet: "",
	momsSESkattskyldighet: "",
	forsaljningEUSkattskyldighet: "",
	lagerforandring: "",
};

export function useCreateArticleForm(articleIdProp?: string) {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const rawId =
		articleIdProp ?? (params?.id ? String(params.id) : undefined);
	const articleId =
		rawId && rawId !== "create" && rawId !== "import" ? rawId : undefined;
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(Boolean(articleId));
	const [priceListRows, setPriceListRows] = useState<PriceListRow[]>([]);

	const isEdit = Boolean(articleId);

	const methods = useForm<CreateArticleFormData>({
		resolver: zodResolver(createArticleSchema),
		defaultValues: EMPTY_ARTICLE_DEFAULTS,
	});

	useEffect(() => {
		if (!articleId) return;
		let cancelled = false;
		getArticleDetailAPIAction(articleId)
			.then((detail) => {
				if (cancelled) return;
				methods.reset({
					articleNr: detail.articleNo,
					benamning: detail.benamning,
					ean: detail.ean,
					leverantor: detail.leverantor,
					husarbete: detail.husarbete || "nej",
					supplierArticleNo: detail.supplierArticleNo,
					typHusarbete: detail.typHusarbete,
					enhet: detail.enhet,
					typAvArtikel: detail.typAvArtikel,
					lagerVara: detail.lagerVara,
					forsaljning: detail.forsaljning,
					moms: detail.moms,
					forsaljningSE: detail.forsaljningSE,
					forsaljningEU: detail.forsaljningEU,
					lagerkonto: detail.lagerkonto,
					forsaljningEUMoms: detail.forsaljningEUMoms,
					forsaljningExport: detail.forsaljningExport,
					inkop: detail.inkop,
					priserA: detail.priserA,
					europrislista: detail.europrislista,
					kampanj: detail.kampanj,
					vipPriser: detail.vipPriser,
					kalkylkostnad: detail.kalkylkostnad,
					bestallningspunkt: detail.bestallningspunkt,
					iLager: detail.iLager,
					stock: detail.stock,
					reserved: detail.reserved,
					status: detail.status,
					vikt: detail.vikt,
					langd: detail.langd,
					bredd: detail.bredd,
					hojd: detail.hojd,
					material: detail.material,
					forsaljningSESkattskyldighet: detail.forsaljningSESkattskyldighet,
					momsSESkattskyldighet: detail.momsSESkattskyldighet,
					forsaljningEUSkattskyldighet: detail.forsaljningEUSkattskyldighet,
					lagerforandring: detail.lagerforandring,
				});
				setPriceListRows(detail.priceListRows || []);
			})
			.catch(() => {
				if (cancelled) return;
				showToast("error", t(localizationConstants.genericError));
				router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [articleId, methods, router, t]);

	const validateStep = useCallback(
		async (step: number): Promise<boolean> => {
			const fields = STEP_FIELDS[step];
			if (!fields) return true;
			return await methods.trigger(fields);
		},
		[methods],
	);

	const handleNext = useCallback(async () => {
		if (currentStep >= TOTAL_ARTICLE_STEPS) return;
		const isValid = await validateStep(currentStep);
		if (!isValid) return;
		setCurrentStep((prev) => prev + 1);
	}, [currentStep, validateStep]);

	const handleTabClick = useCallback(
		async (step: number) => {
			if (step <= currentStep) {
				setCurrentStep(step);
				return;
			}
			for (let s = currentStep; s < step; s++) {
				const isValid = await validateStep(s);
				if (!isValid) return;
			}
			setCurrentStep(step);
		},
		[currentStep, validateStep],
	);

	const handleSubmit = methods.handleSubmit(async (data: CreateArticleFormData) => {
		setIsSubmitting(true);
		try {
			const formData: CreateArticleFormData = { ...data, priceListRows };
			if (isEdit && articleId) {
				await updateArticleAPIAction(articleId, formData);
				showToast("success", t(localizationConstants.articleUpdatedSuccess));
			} else {
				await createArticleAPIAction(formData);
				showToast("success", t(localizationConstants.articleCreatedSuccess));
			}
			router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
		} catch (error) {
			const backendMessage = (error as ApiError).response?.data?.message;
			showToast(
				"error",
				backendMessage ||
					t(isEdit ? localizationConstants.articleUpdateError : localizationConstants.articleCreateError),
			);
		} finally {
			setIsSubmitting(false);
		}
	});

	const handleCancel = useCallback(() => {
		router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
	}, [router]);

	const handleAddPriceListRow = useCallback((newRow: PriceListRow) => {
		setPriceListRows((prev) => [...prev, newRow]);
	}, []);

	const handleRemovePriceListRow = useCallback((id: string) => {
		setPriceListRows((prev) => prev.filter((row) => row.id !== id));
	}, []);

	return {
		methods,
		control: methods.control,
		currentStep,
		isSubmitting,
		isLoading,
		isEdit,
		priceListRows,
		handleNext,
		handleTabClick,
		handleSubmit,
		handleCancel,
		handleAddPriceListRow,
		handleRemovePriceListRow,
	};
}
