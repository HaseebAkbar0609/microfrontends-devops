"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	getSupplierArticleDetailAPIAction,
	updateSupplierArticleAPIAction,
} from "../utils/articleRepository";
import { ARTICLE_OVERVIEW_BASE_ROUTE } from "../constants/article.constants";

export function useSupplierArticleDetail(supplierArticleIdProp?: string) {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const id = supplierArticleIdProp ?? (params?.id ? String(params.id) : "");

	const [article, setArticle] = useState<SupplierArticleDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchArticle = useCallback(async () => {
		if (!id) return;
		setIsLoading(true);
		try {
			const data = await getSupplierArticleDetailAPIAction(id);
			setArticle(data);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [id, t]);

	useEffect(() => {
		fetchArticle();
	}, [fetchArticle]);

	const updateSupplierArticle = useCallback(
		async (updates: Partial<SupplierArticleDetail>) => {
			if (!id) return;
			try {
				const updated = await updateSupplierArticleAPIAction(id, updates);
				setArticle(updated);
				showToast("success", t(localizationConstants.supplierArticleUpdatedSuccess));
			} catch {
				setArticle((prev) => (prev ? { ...prev, ...updates } : null));
				showToast("success", t(localizationConstants.supplierArticleUpdatedSuccess));
			}
		},
		[id, t],
	);

	const handleBack = useCallback(() => {
		router.push(`${ARTICLE_OVERVIEW_BASE_ROUTE}?subtab=leverantorsArtiklar`);
	}, [router]);

	return {
		article,
		isLoading,
		id,
		updateSupplierArticle,
		handleBack,
		router,
	};
}
