"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SystemCreateHeaderProps {
	onBack: () => void;
}

export const SystemCreateHeader: React.FC<SystemCreateHeaderProps> = ({
	onBack,
}) => {
	const t = useTranslate();

	return (
		<div className="flex items-center">
			<button
				type="button"
				onClick={onBack}
				className="group inline-flex items-center gap-2.5 text-xl font-bold text-slate-900 hover:text-slate-600 transition-colors"
			>
				<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
				<span>{t(localizationConstants.dataItSystemCreateTitle)}</span>
			</button>
		</div>
	);
};

export default SystemCreateHeader;
