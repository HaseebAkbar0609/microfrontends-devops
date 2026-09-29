"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { casesRoutes } from "../../../constants/cases.constants";

interface CreateCaseHeaderProps {
	title: string;
	onBack?: () => void;
	/** Which module the screen is mounted in; the way back is built from it. */
	basePath?: string;
}

export function CreateCaseHeader({
	title,
	onBack,
	basePath,
}: CreateCaseHeaderProps) {
	const t = useTranslate();
	const router = useRouter();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.push(casesRoutes(basePath).list);
		}
	};

	return (
		<div className="flex items-center gap-3">
			<button
				type="button"
				onClick={handleBack}
				className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
				aria-label={t(localizationConstants.backAriaLabel)}
			>
				<ArrowLeft className="w-5 h-5" />
			</button>
			<h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
		</div>
	);
}

export default CreateCaseHeader;
