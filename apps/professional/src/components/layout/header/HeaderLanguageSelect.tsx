"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	AVAILABLE_LANGUAGES,
	DEFAULT_LANGUAGE,
	type LanguageCode,
} from "@/constants/constant";
import { cn } from "@/lib/utils";
import { refreshLanguage } from "@/utils/localization";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function normalizeLanguage(lng: string): LanguageCode {
	const base = lng?.split("-")[0]?.toLowerCase();
	if (base === "sv") return "sv";
	return "en";
}

export default function HeaderLanguageSelect() {
	const { i18n } = useTranslation();
	const [value, setValue] = useState<LanguageCode>(() =>
		normalizeLanguage(i18n.language || DEFAULT_LANGUAGE),
	);

	useEffect(() => {
		const sync = (lng: string) => setValue(normalizeLanguage(lng));
		i18n.on("languageChanged", sync);
		sync(i18n.language);
		return () => {
			i18n.off("languageChanged", sync);
		};
	}, [i18n]);

	const handleChange = (lang: string) => {
		const code = lang as LanguageCode;
		setValue(code);
		refreshLanguage(code);
	};

	return (
		<Select value={value} onValueChange={handleChange}>
			<SelectTrigger
				size="default"
				aria-label="Language"
				className={cn(
					"h-10 min-w-[132px] shrink-0 border-slate-200 bg-white text-slate-800 shadow-sm",
					"rounded-lg px-3.5 py-2 font-normal hover:bg-slate-50",
					"focus-visible:border-slate-300 focus-visible:ring-slate-200/60",
					"dark:border-slate-200 dark:bg-white dark:text-slate-800 dark:hover:bg-slate-50",
					"[&_svg]:text-slate-400",
				)}
			>
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent
				align="end"
				className="rounded-lg border-slate-200 bg-white dark:bg-white dark:text-slate-800"
			>
				{AVAILABLE_LANGUAGES.map((lang) => (
					<SelectItem
						key={lang.code}
						value={lang.code}
						className="cursor-pointer rounded-md focus:bg-slate-100"
					>
						{lang.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
