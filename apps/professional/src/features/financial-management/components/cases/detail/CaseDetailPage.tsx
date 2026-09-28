"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useCases } from "../../../hooks/useCases";
import { casesRoutes } from "../../../constants/cases.constants";
import type { CaseStatus } from "../../../types/cases.types";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseDetailTabs, type CaseDetailTab } from "./CaseDetailTabs";
import { CaseBasicInfoView } from "./CaseBasicInfoView";
import { CaseDocumentsView } from "./CaseDocumentsView";

interface CaseDetailPageProps {
	id: string;
	/** Which module the case is being read in; every link is built from it. */
	basePath?: string;
}

export function CaseDetailPage({ id, basePath }: CaseDetailPageProps) {
	const router = useRouter();
	const routes = casesRoutes(basePath);
	const searchParams = useSearchParams();
	const tabParam = searchParams.get("tab") as CaseDetailTab | null;
	const { t } = useTranslation();
	const { getCaseById, updateCaseStatus, isLoading } = useCases();

	const caseItem = getCaseById(id);

	const [activeTab, setActiveTab] = useState<CaseDetailTab>(() => {
		if (tabParam && ["grundlaggande_info", "dokument"].includes(tabParam)) {
			return tabParam;
		}
		return "grundlaggande_info";
	});

	useEffect(() => {
		if (tabParam && ["grundlaggande_info", "dokument"].includes(tabParam)) {
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
					onClick={() => router.push(routes.list)}
					className="h-8 px-4 bg-slate-900 text-white rounded-lg text-xs cursor-pointer hover:bg-slate-800 transition-colors"
				>
					{t(localizationConstants.casesBtnBackToOverview)}
				</button>
			</div>
		);
	}

	const handleStatusChange = (newStatus: CaseStatus) => {
		updateCaseStatus(caseItem.id, newStatus);
		showToast("success", t(localizationConstants.casesToastStatusChanged));
	};

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Header matching Figma Image 5 */}
			<CaseDetailHeader
				caseItem={caseItem}
				onStatusChange={handleStatusChange}
				basePath={basePath}
			/>

			{/* Sub Tabs matching Figma Image 5: Grundläggande info | Dokuments */}
			<CaseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Tab 1: Grundläggande info matching Figma Image 5 Left */}
			{activeTab === "grundlaggande_info" && (
				<CaseBasicInfoView
					caseItem={caseItem}
					onEdit={() => router.push(routes.edit(caseItem.id))}
				/>
			)}

			{/* Tab 2: Dokuments matching Figma Image 5 Right */}
			{activeTab === "dokument" && (
				<CaseDocumentsView
					documents={caseItem.documents || []}
					images={caseItem.images || []}
				/>
			)}
		</div>
	);
}

export default CaseDetailPage;
