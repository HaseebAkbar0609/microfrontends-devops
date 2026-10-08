"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	DATA_IT_SYSTEM_BASE_URL,
	SYSTEM_DETAIL_TAB_BASIC,
	SYSTEM_DETAIL_TAB_ASSIGNMENT,
} from "@/features/data-it/constants/dataItSystem.constants";
import { useDataItSystemDetail } from "@/features/data-it/hooks/useDataItSystemDetail";
import { SystemDetailHeader } from "./SystemDetailHeader";
import { SystemDetailTabs } from "./SystemDetailTabs";
import { SystemBasicInfoCard } from "./SystemBasicInfoCard";
import { SystemDocumentsCard } from "./SystemDocumentsCard";
import { SystemAssignmentCard } from "./SystemAssignmentCard";
import { SystemEditDialog } from "./SystemEditDialog";

interface DataItSystemDetailViewProps {
	id: string;
}

export const DataItSystemDetailView: React.FC<DataItSystemDetailViewProps> = ({
	id,
}) => {
	const t = useTranslate();
	const router = useRouter();
	const [isEditOpen, setIsEditOpen] = useState(false);

	const {
		system,
		activeTab,
		setActiveTab,
		showPassword,
		togglePasswordVisibility,
		updateSystem,
	} = useDataItSystemDetail(id);

	if (!system) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<h2 className="text-lg font-bold text-slate-900">
					{t(localizationConstants.dataItSystemNotFoundTitle)}
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					{t(localizationConstants.dataItSystemNotFoundDesc)}
				</p>
				<button
					type="button"
					onClick={() => router.push(DATA_IT_SYSTEM_BASE_URL)}
					className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
				>
					{t(localizationConstants.dataItBackToOverview)}
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with back button & System ID */}
			<SystemDetailHeader system={system} />

			{/* Sub-tabs: Grundläggande info | Tilldelning */}
			<SystemDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab 1 Content: Grundläggande info */}
			{activeTab === SYSTEM_DETAIL_TAB_BASIC && (
				<div className="space-y-6">
					<SystemBasicInfoCard
						system={system}
						showPassword={showPassword}
						onTogglePassword={togglePasswordVisibility}
						onEdit={() => setIsEditOpen(true)}
					/>
					<SystemDocumentsCard
						documents={system.documents}
						onEdit={() => setIsEditOpen(true)}
					/>
				</div>
			)}

			{/* Tab 2 Content: Tilldelning */}
			{activeTab === SYSTEM_DETAIL_TAB_ASSIGNMENT && (
				<div className="space-y-6">
					<SystemAssignmentCard
						assignedUsers={system.assignedUsers}
						onEdit={() => setIsEditOpen(true)}
					/>
				</div>
			)}

			{/* Edit System Dialog */}
			<SystemEditDialog
				isOpen={isEditOpen}
				system={system}
				onClose={() => setIsEditOpen(false)}
				onSave={updateSystem}
			/>
		</div>
	);
};

export default DataItSystemDetailView;
