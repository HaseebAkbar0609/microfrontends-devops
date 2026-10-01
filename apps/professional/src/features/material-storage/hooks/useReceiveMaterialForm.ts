"use client";

import { useCallback, useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	createReceiveMaterialSchema,
	toReceiveMaterialInput,
	type ReceiveIntent,
	type ReceiveMaterialFormValues,
} from "../components/receive/receiveMaterial.schema";
import { MATERIAL_QUERY_KEYS, MATERIAL_UNIT_LABELS } from "../constants/materialStorage.constants";
import { materialReceiptService } from "../services/materialReceiptService";
import type { MaterialArticle, MaterialDepot } from "../types/materialStorage.types";
import type {
	MaterialTransaction,
	ReceiveMaterialInput,
	MaterialDialogPreset,
} from "../types/materialTransaction.types";
import { todayIso } from "../utils/materialDates";
import { useMaterialFormatters } from "./useMaterialFormatters";

interface UseReceiveMaterialFormOptions {
	preset: MaterialDialogPreset;
	articles: MaterialArticle[];
	depots: MaterialDepot[];
	/** Called after a successful receipt or draft, to close the dialog. */
	onDone: () => void;
}

/**
 * Form state for "Ta in material". The dialog mounts afresh for every opening,
 * so the defaults are only the preset (depot, and the article when opened from
 * a row) and today's date; everything else starts empty.
 */
export function useReceiveMaterialForm({ preset, articles, depots, onDone }: UseReceiveMaterialFormOptions) {
	const t = useTranslate();
	const queryClient = useQueryClient();
	const userName = useCurrentUserName(localizationConstants.materialCurrentUserFallback);
	const { formatCount, formatDecimalInput } = useMaterialFormatters();

	// The resolver is created once; it reads the current intent and articles through refs.
	const intentRef = useRef<ReceiveIntent>("receive");
	const articlesRef = useRef(articles);
	useEffect(() => {
		articlesRef.current = articles;
	}, [articles]);

	const [resolver] = useState(() => {
		const resolve: Resolver<ReceiveMaterialFormValues> = (values, context, options) =>
			zodResolver(
				createReceiveMaterialSchema({
					intent: intentRef.current,
					today: todayIso(),
					unitOf: (articleId) => articlesRef.current.find((article) => article.id === articleId)?.unit,
				}),
			)(values, context, options);
		return resolve;
	});

	const [defaultValues] = useState<ReceiveMaterialFormValues>(() => ({
		depotId: preset.depotId ?? "",
		articleId: preset.article?.id ?? "",
		quantity: "",
		supplierName: preset.article?.supplierName ?? "",
		unitPrice: preset.article ? formatDecimalInput(preset.article.purchasePrice) : "",
		deliveryDate: todayIso(),
		supplierOrderNo: "",
		comment: "",
	}));

	const form = useForm<ReceiveMaterialFormValues>({ resolver, defaultValues });

	/** Picking a material also fills in its supplier and purchase price, which stay editable. */
	const selectArticle = useCallback(
		(article: MaterialArticle) => {
			// Validating clears a "Välj ett material." left from an earlier submit.
			form.setValue("articleId", article.id, { shouldDirty: true, shouldValidate: true });
			form.setValue("supplierName", article.supplierName, { shouldDirty: true });
			form.setValue("unitPrice", formatDecimalInput(article.purchasePrice), { shouldDirty: true });
			form.clearErrors("unitPrice");
			// The unit decides whether a typed quantity must be whole.
			if (form.getValues("quantity").trim()) void form.trigger("quantity");
		},
		[form, formatDecimalInput],
	);

	const successMessage = (transaction: MaterialTransaction) =>
		t(localizationConstants.materialReceiveSuccess, {
			quantity: formatCount(transaction.quantity ?? 0),
			unit: t(MATERIAL_UNIT_LABELS[transaction.unit]),
			material: articles.find((article) => article.id === transaction.articleId)?.name ?? "",
			depot: depots.find((depot) => depot.id === transaction.depotId)?.name ?? "",
		});

	const mutation = useMutation({
		mutationFn: ({ intent, input }: { intent: ReceiveIntent; input: ReceiveMaterialInput }) =>
			intent === "draft" ? materialReceiptService.saveDraft(input, userName) : materialReceiptService.receive(input, userName),
		onSuccess: (transaction, { intent }) => {
			void queryClient.invalidateQueries({ queryKey: MATERIAL_QUERY_KEYS.all });
			showToast(
				"success",
				intent === "draft" ? t(localizationConstants.materialReceiveDraftSaved) : successMessage(transaction),
			);
			onDone();
		},
		onError: () => showToast("error", t(localizationConstants.materialReceiveError)),
	});

	// The intent is set on click, before validation runs, so the resolver checks the right rules.
	const submitAs = (intent: ReceiveIntent) => (event?: BaseSyntheticEvent) => {
		intentRef.current = intent;
		return form.handleSubmit((values) => {
			if (mutation.isPending) return;
			mutation.mutate({ intent, input: toReceiveMaterialInput(values) });
		})(event);
	};

	return {
		form,
		selectArticle,
		receive: submitAs("receive"),
		saveDraft: submitAs("draft"),
		isPending: mutation.isPending,
	};
}
