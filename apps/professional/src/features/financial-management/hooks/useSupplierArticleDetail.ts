"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierArticleDetail } from "../types/article.types";
import { getSupplierArticleDetailAPIAction } from "../utils/articleRepository";
import {
	ARTICLE_OVERVIEW_BASE_ROUTE,
	SUPPLIER_ARTICLE_DETAIL_BASE_ROUTE,
} from "../constants/article.constants";

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

	const handleEdit = useCallback(() => {
		if (id) {
			router.push(`${SUPPLIER_ARTICLE_DETAIL_BASE_ROUTE}/${encodeURIComponent(id)}/edit`);
		}
	}, [id, router]);

	const handleBack = useCallback(() => {
		router.push(`${ARTICLE_OVERVIEW_BASE_ROUTE}?subtab=leverantorsArtiklar`);
	}, [router]);

	return {
		article,
		isLoading,
		id,
		handleEdit,
		handleBack,
		router,
	};
}
