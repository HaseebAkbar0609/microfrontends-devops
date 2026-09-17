"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useCases } from "../../../hooks/useCases";
import {
	CASES_BASE_ROUTE,
	CREATE_CASE_ROUTE,
} from "../../../constants/cases.constants";
import type { CaseStatus } from "../../../types/cases.types";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseDetailTabs, type CaseDetailTab } from "./CaseDetailTabs";
import { CaseInfoSidebar } from "./CaseInfoSidebar";
import { CaseConversation } from "./CaseConversation";
import { CaseBasicInfoView } from "./CaseBasicInfoView";
import { CaseDocumentsView } from "./CaseDocumentsView";
import { CaseActivityLogView } from "./CaseActivityLogView";

interface CaseDetailPageProps {
	id: string;
}

export function CaseDetailPage({ id }: CaseDetailPageProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const { getCaseById, updateCaseStatus, addMessage, isLoading } = useCases();

	const caseItem = getCaseById(id);

	// In Figma Image 1, case #5000 is showing the Conversation view.
	// In Figma Image 4 & 5, case #M101 is showing Grundläggande info and Dokument views.
	const [activeTab, setActiveTab] = useState<CaseDetailTab>(() => {
		if (id === "5000" || (caseItem && caseItem.messages.length > 0)) {
			return "konversation";
		}
		return "grundlaggande_info";
	});

	if (isLoading) {
		return (
			<div className="p-12 text-center text-xs text-slate-400">
				{t(localizationConstants.casesLoading)}
			</div>
		);
	}

	if (!caseItem) {
		return (
			<div className="p-12 text-center space-y-4">
				<p className="text-xs text-slate-400 italic">
					{t(localizationConstants.casesNoItemsFound)}
				</p>
				<button
					type="button"
					onClick={() => router.push(CASES_BASE_ROUTE)}
					className="h-8 px-4 bg-slate-900 text-white rounded-lg text-xs cursor-pointer"
				>
					Tillbaka till översikten
				</button>
			</div>
		);
	}

	const handleStatusChange = (newStatus: CaseStatus) => {
		updateCaseStatus(caseItem.id, newStatus);
		showToast("success", t(localizationConstants.casesToastStatusChanged));
	};

	const handleSendMessage = (content: string) => {
		addMessage(caseItem.id, {
			author: "Stefan Eriksson",
			authorRole: "Kund",
			content,
			createdAt: `${new Date().toISOString().split("T")[0]} | ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
		});
		showToast("success", t(localizationConstants.casesToastMessageSent));
	};

	return (
		<div className="p-6 max-w-6xl mx-auto space-y-6">
			{/* Top Header */}
			<CaseDetailHeader
				caseItem={caseItem}
				onStatusChange={handleStatusChange}
			/>

			{/* Sub Tabs */}
			<CaseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab Contents */}
			{activeTab === "konversation" && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					{/* Left Column: Ärende information matching Figma Image 1 */}
					<div className="lg:col-span-1">
						<CaseInfoSidebar caseItem={caseItem} />
					</div>

					{/* Right Column: Konversation matching Figma Image 1 */}
					<div className="lg:col-span-2">
						<CaseConversation
							messages={caseItem.messages || []}
							onSendMessage={handleSendMessage}
						/>
					</div>
				</div>
			)}

			{activeTab === "grundlaggande_info" && (
				<CaseBasicInfoView
					caseItem={caseItem}
					onEdit={() => router.push(`${CREATE_CASE_ROUTE}?edit=${caseItem.id}`)}
				/>
			)}

			{activeTab === "dokument" && (
				<CaseDocumentsView
					documents={caseItem.documents || []}
					images={caseItem.images || []}
				/>
			)}

			{activeTab === "aktivitetslogg" && (
				<CaseActivityLogView caseItem={caseItem} />
			)}
		</div>
	);
}

export default CaseDetailPage;
