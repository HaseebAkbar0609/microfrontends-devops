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
		<div className="space-y-1">
			{/* Back Button */}
			<button
				type="button"
				onClick={handleBack}
				className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
			>
				<ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
				<span className="capitalize">
					{t(localizationConstants.dataItSystemDetailBack)}
				</span>
			</button>

			{/* System ID display */}
			<p className="text-xs font-normal text-slate-500 pl-6">
				{system.systemId}
			</p>
		</div>
	);
};

export default SystemDetailHeader;
