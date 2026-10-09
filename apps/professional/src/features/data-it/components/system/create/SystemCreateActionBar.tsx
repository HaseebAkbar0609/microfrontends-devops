"use client";

import React from "react";
import { ArrowRight, Save } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	SYSTEM_DETAIL_TAB_BASIC,
	type SystemDetailTabId,
} from "@/features/data-it/constants/dataItSystem.constants";

interface SystemCreateActionBarProps {
	activeTab: SystemDetailTabId;
	onCancel: () => void;
	onSave: () => void;
	onNext: () => void;
}

export const SystemCreateActionBar: React.FC<SystemCreateActionBarProps> = ({
	activeTab,
	onCancel,
	onSave,
	onNext,
}) => {
	const t = useTranslate();

	return (
		<div className="flex items-center justify-end gap-3 pt-2">
			{/* Avbryt (Cancel) */}
			<button
				type="button"
				onClick={onCancel}
				className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
			>
				{t(localizationConstants.dataItSystemBtnCancel)}
			</button>

			{/* Spara (Save) */}
			<button
				type="button"
				onClick={onSave}
				className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
			>
				<Save className="h-4 w-4" />
				<span>{t(localizationConstants.dataItSystemBtnSave)}</span>
			</button>

			{/* Nästa (Next) - Only displayed on Tab 1 */}
			{activeTab === SYSTEM_DETAIL_TAB_BASIC && (
				<button
					type="button"
					onClick={onNext}
					className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
				>
					<span>{t(localizationConstants.dataItSystemCreateBtnNext)}</span>
					<ArrowRight className="h-4 w-4" />
				</button>
			)}
		</div>
	);
};

export default SystemCreateActionBar;
