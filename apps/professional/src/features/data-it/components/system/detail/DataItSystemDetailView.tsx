"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { SystemAssigneeDialog } from "./SystemAssigneeDialog";
import { SystemEditDialog } from "./SystemEditDialog";

interface DataItSystemDetailViewProps {
	id: string;
}

export const DataItSystemDetailView: React.FC<DataItSystemDetailViewProps> = ({
	id,
}) => {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isEditOpen, setIsEditOpen] = useState(
		() => searchParams?.get("edit") === "1",
	);
	const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

	const {
		system,
		activeTab,
		setActiveTab,
		showPassword,
		togglePasswordVisibility,
		updateSystem,
	} = useDataItSystemDetail(id);

	const handleCloseEdit = () => {
		setIsEditOpen(false);
		if (searchParams?.get("edit") === "1") {
			router.replace(`${DATA_IT_SYSTEM_BASE_URL}/${encodeURIComponent(id)}`);
		}
	};

	if (!system) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
				<h2 className="text-lg font-semibold text-slate-800">
					{t(localizationConstants.dataItSystemNotFoundTitle)}
				</h2>
				<p className="mt-2 text-sm text-slate-500">
					{id}
				</p>
				<button
					type="button"
					onClick={() => router.push(DATA_IT_SYSTEM_BASE_URL)}
					className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
				>
					{t(localizationConstants.dataItBackToOverview)}
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-6 px-6 py-5">
			{/* Header with back button & System ID */}
			<SystemDetailHeader system={system} />

			{/* Sub-tabs: Grundläggande info | Tilldelning */}
			<SystemDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab 1 Content: Grundläggande info */}
			{activeTab === SYSTEM_DETAIL_TAB_BASIC && (
				<div className="flex flex-col gap-6">
					<SystemBasicInfoCard
						system={system}
						showPassword={showPassword}
						onTogglePassword={togglePasswordVisibility}
						onEdit={() => setIsEditOpen(true)}
					/>
					<SystemDocumentsCard
						documents={system.documents}
					/>
				</div>
			)}

			{/* Tab 2 Content: Tilldelning */}
			{activeTab === SYSTEM_DETAIL_TAB_ASSIGNMENT && (
				<div className="flex flex-col gap-6">
					<SystemAssignmentCard
						assignedUsers={system.assignedUsers}
						onEdit={() => setIsAssigneeOpen(true)}
					/>
				</div>
			)}

			{/* Edit System Dialog (Basic info / credentials) */}
			{isEditOpen && (
				<SystemEditDialog
					key={system.id}
					isOpen={isEditOpen}
					system={system}
					onClose={handleCloseEdit}
					onSave={updateSystem}
				/>
			)}

			{/* Assignee Management Dialog */}
			{isAssigneeOpen && (
				<SystemAssigneeDialog
					isOpen={isAssigneeOpen}
					assignedUsers={system.assignedUsers}
					onClose={() => setIsAssigneeOpen(false)}
					onSave={(users) => updateSystem({ assignedUsers: users })}
				/>
			)}
		</div>
	);
};

export default DataItSystemDetailView;
