"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleDetail, CreateArticleFormData } from "../types/article.types";
import {
	getArticleDetailAPIAction,
	updateArticleAPIAction,
} from "../utils/articleRepository";
import { ARTICLE_OVERVIEW_BASE_ROUTE } from "../constants/article.constants";

export function useArticleDetail(articleIdProp?: string) {
	const t = useTranslate();
	const router = useRouter();
	const params = useParams();
	const id = articleIdProp ?? (params?.id ? String(params.id) : "");

	const [article, setArticle] = useState<ArticleDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchArticle = useCallback(async () => {
		if (!id) return;
		setIsLoading(true);
		try {
			const data = await getArticleDetailAPIAction(id);
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

	const updateArticle = useCallback(
		async (updates: Partial<ArticleDetail>) => {
			if (!id) return;
			try {
				const updated = await updateArticleAPIAction(
					id,
					updates as Partial<CreateArticleFormData>,
				);
				setArticle(updated);
				showToast("success", t(localizationConstants.articleUpdatedSuccess));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[id, t],
	);

	const handleBack = useCallback(() => {
		router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
	}, [router]);

	return {
		article,
		isLoading,
		id,
		updateArticle,
		handleBack,
		router,
	};
}
