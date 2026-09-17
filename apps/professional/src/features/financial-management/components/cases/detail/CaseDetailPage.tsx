"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab") as CaseDetailTab | null;
	const { t } = useTranslation();
	const { getCaseById, updateCaseStatus, addMessage, isLoading } = useCases();

	const caseItem = getCaseById(id);

	const [activeTab, setActiveTab] = useState<CaseDetailTab>(() => {
		if (tabParam && ["grundlaggande_info", "dokument", "konversation", "aktivitetslogg"].includes(tabParam)) {
			return tabParam;
		}
		if (caseItem && caseItem.messages && caseItem.messages.length > 0) {
			return "konversation";
		}
		return "grundlaggande_info";
	});

	useEffect(() => {
		if (tabParam && ["grundlaggande_info", "dokument", "konversation", "aktivitetslogg"].includes(tabParam)) {
			setActiveTab(tabParam);
		}
	}, [tabParam]);

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
					{t(localizationConstants.casesNoItemsFound)} (#{id})
				</p>
				<button
					type="button"
					onClick={() => router.push(CASES_BASE_ROUTE)}
					className="h-8 px-4 bg-slate-900 text-white rounded-lg text-xs cursor-pointer hover:bg-slate-800 transition-colors"
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
			authorRole: "SE",
			content,
		});
		showToast("success", t(localizationConstants.casesToastMessageSent));
	};

	return (
		<div className="p-6 max-w-6xl mx-auto space-y-6">
			{/* Top Header matching Figma Image 2 and 5 */}
			<CaseDetailHeader
				caseItem={caseItem}
				onStatusChange={handleStatusChange}
			/>

			{/* Sub Tabs matching Figma Image 5: Grundläggande info | Dokuments | Konversation | Aktivitetslogg */}
			<CaseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab 1: Grundläggande info matching Figma Image 5 Left */}
			{activeTab === "grundlaggande_info" && (
				<CaseBasicInfoView
					caseItem={caseItem}
					onEdit={() => router.push(`${CREATE_CASE_ROUTE}?edit=${caseItem.id}`)}
				/>
			)}

			{/* Tab 2: Dokuments matching Figma Image 5 Right */}
			{activeTab === "dokument" && (
				<CaseDocumentsView
					documents={caseItem.documents || []}
					images={caseItem.images || []}
				/>
			)}

			{/* Tab 3: Konversation matching Figma Image 2 */}
			{activeTab === "konversation" && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					{/* Left Column: Allmän information */}
					<div className="lg:col-span-1">
						<CaseInfoSidebar caseItem={caseItem} />
					</div>

					{/* Right Column: Konversation Thread */}
					<div className="lg:col-span-2">
						<CaseConversation
							messages={caseItem.messages || []}
							onSendMessage={handleSendMessage}
						/>
					</div>
				</div>
			)}

			{/* Tab 4: Aktivitetslogg / Timeline */}
			{activeTab === "aktivitetslogg" && (
				<CaseActivityLogView caseItem={caseItem} />
			)}
		</div>
	);
}

export default CaseDetailPage;
