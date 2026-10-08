"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DATA_IT_SYSTEM_BASE_URL } from "@/features/data-it/constants/dataItSystem.constants";
import type { SystemItem } from "@/features/data-it/types/dataItSystem.types";

interface SystemDetailHeaderProps {
	system: SystemItem;
}

export const SystemDetailHeader: React.FC<SystemDetailHeaderProps> = ({
	system,
}) => {
	const t = useTranslate();
	const router = useRouter();

	const handleBack = () => {
		router.push(DATA_IT_SYSTEM_BASE_URL);
	};

	return (
		<div className="flex flex-col gap-0.5">
			{/* Back Button & Title matching Figma Node 13350-66392 */}
			<button
				type="button"
				onClick={handleBack}
				className="group inline-flex items-center gap-2.5 text-xl font-bold text-slate-900 hover:text-slate-600 transition-colors w-fit"
			>
				<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
				<span>{t(localizationConstants.dataItSystemDetailBack)}</span>
			</button>

			{/* System ID display */}
			<p className="text-xs font-normal text-slate-500">
				{system.systemId}
			</p>
		</div>
	);
};

export default SystemDetailHeader;
