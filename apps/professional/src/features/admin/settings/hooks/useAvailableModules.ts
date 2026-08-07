"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LocalizedText, getAvailableModules } from "../api/permissions.api";

export const useAvailableModules = () =>
	useQuery({
		queryKey: ["admin-available-modules"],
		queryFn: getAvailableModules,
	});

export const useLocalizedText = () => {
	const { i18n } = useTranslation();
	const lang: keyof LocalizedText = i18n.language?.startsWith("en")
		? "en"
		: "sv";
	return (text: LocalizedText) => text[lang] || text.sv;
};
