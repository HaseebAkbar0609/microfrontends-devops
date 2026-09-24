"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListDetail } from "../types/priceLists.types";
import { priceListsRepository } from "../utils/priceListsRepository";

export function usePriceListDetail(id: string) {
	const t = useTranslate();
	const [priceList, setPriceList] = useState<PriceListDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"grundinfo" | "artikellista">("grundinfo");

	// In-place edit state for Grund info
	const [isEditingGrundInfo, setIsEditingGrundInfo] = useState(false);
	const [editGrundInfoData, setEditGrundInfoData] = useState<{
		code: string;
		name: string;
		date: string;
		createdBy: string;
		comment: string;
	}>({ code: "", name: "", date: "", createdBy: "", comment: "" });

	// In-place edit state for Settings
	const [isEditingSettings, setIsEditingSettings] = useState(false);
	const [editSettingsData, setEditSettingsData] = useState<{
		category: string;
		unit: string;
	}>({ category: "", unit: "" });

	// Search within detail article list
	const [articleSearchQuery, setArticleSearchQuery] = useState("");

	const loadDetail = useCallback(() => {
		setIsLoading(true);
		try {
			const found = priceListsRepository.getById(id);
			if (found) {
				setPriceList(found);
				setEditGrundInfoData({
					code: found.code,
					name: found.name,
					date: found.date,
					createdBy: found.createdBy,
					comment: found.comment || "",
				});
				setEditSettingsData({
					category: found.category,
					unit: found.unit || "Styck",
				});
			} else {
				setPriceList(null);
			}
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [id, t]);

	useEffect(() => {
		loadDetail();
		const unsubscribe = priceListsRepository.subscribe(loadDetail);
		return () => {
			unsubscribe();
		};
	}, [loadDetail]);

	const startEditGrundInfo = useCallback(() => {
		if (!priceList) return;
		setEditGrundInfoData({
			code: priceList.code,
			name: priceList.name,
			date: priceList.date,
			createdBy: priceList.createdBy,
			comment: priceList.comment || "",
		});
		setIsEditingGrundInfo(true);
	}, [priceList]);

	const cancelEditGrundInfo = useCallback(() => {
		setIsEditingGrundInfo(false);
	}, []);

	const saveGrundInfo = useCallback(() => {
		if (!priceList) return;
		priceListsRepository.update(priceList.id, {
			code: editGrundInfoData.code,
			name: editGrundInfoData.name,
			date: editGrundInfoData.date,
			createdBy: editGrundInfoData.createdBy,
			comment: editGrundInfoData.comment,
		});
		setIsEditingGrundInfo(false);
		showToast("success", t(localizationConstants.priceListUpdateSuccess));
	}, [priceList, editGrundInfoData, t]);

	const startEditSettings = useCallback(() => {
		if (!priceList) return;
		setEditSettingsData({
			category: priceList.category,
			unit: priceList.unit || "Styck",
		});
		setIsEditingSettings(true);
	}, [priceList]);

	const cancelEditSettings = useCallback(() => {
		setIsEditingSettings(false);
	}, []);

	const saveSettings = useCallback(() => {
		if (!priceList) return;
		priceListsRepository.update(priceList.id, {
			category: editSettingsData.category,
			unit: editSettingsData.unit,
		});
		setIsEditingSettings(false);
		showToast("success", t(localizationConstants.priceListUpdateSuccess));
	}, [priceList, editSettingsData, t]);

	const filteredArticles = useMemo(() => {
		if (!priceList?.articles) return [];
		if (!articleSearchQuery.trim()) return priceList.articles;
		const q = articleSearchQuery.toLowerCase();
		return priceList.articles.filter(
			(a) =>
				a.articleNo.toLowerCase().includes(q) ||
				a.benamning.toLowerCase().includes(q),
		);
	}, [priceList, articleSearchQuery]);

	return useMemo(
		() => ({
			priceList,
			isLoading,
			activeTab,
			setActiveTab,
			isEditingGrundInfo,
			editGrundInfoData,
			setEditGrundInfoData,
			startEditGrundInfo,
			cancelEditGrundInfo,
			saveGrundInfo,
			isEditingSettings,
			editSettingsData,
			setEditSettingsData,
			startEditSettings,
			cancelEditSettings,
			saveSettings,
			articleSearchQuery,
			setArticleSearchQuery,
			filteredArticles,
			refetch: loadDetail,
		}),
		[
			priceList,
			isLoading,
			activeTab,
			isEditingGrundInfo,
			editGrundInfoData,
			startEditGrundInfo,
			cancelEditGrundInfo,
			saveGrundInfo,
			isEditingSettings,
			editSettingsData,
			startEditSettings,
			cancelEditSettings,
			saveSettings,
			articleSearchQuery,
			filteredArticles,
			loadDetail,
		],
	);
}
