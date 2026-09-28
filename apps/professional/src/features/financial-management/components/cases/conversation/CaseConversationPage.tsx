"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useCases } from "../../../hooks/useCases";
import { mintTypedUrl } from "@/features/project/shared/recordFiles";
import { CASE_MESSAGE_FILE_RULES, casesRoutes } from "../../../constants/cases.constants";
import type { CaseStatus } from "../../../types/cases.types";
import { CaseDetailHeader } from "../detail/CaseDetailHeader";
import { CaseInfoSidebar } from "../detail/CaseInfoSidebar";
import { CaseConversation } from "../detail/CaseConversation";

interface CaseConversationPageProps {
	id: string;
	/** Which module the case is being read in; every link is built from it. */
	basePath?: string;
}

export function CaseConversationPage({ id, basePath }: CaseConversationPageProps) {
	const router = useRouter();
	const routes = casesRoutes(basePath);
	const { t } = useTranslation();
	const { getCaseById, updateCaseStatus, addMessage, isLoading } = useCases();

	const caseItem = getCaseById(id);

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

	const handleSendMessage = (content: string, files: File[]) => {
		/* The file is served from the tab's own memory — there is no upload
		   endpoint — so its URL lives as long as the tab and is not stored. */
		const attachments = files.map((file, index) => ({
			id: `att-${Date.now()}-${index}`,
			name: file.name,
			size: file.size,
			url: mintTypedUrl(file, CASE_MESSAGE_FILE_RULES.types),
		}));

		addMessage(caseItem.id, {
			author: "Stefan Eriksson",
			authorRole: "SE",
			content,
			...(attachments.length > 0 ? { attachments } : {}),
		});
		showToast("success", t(localizationConstants.casesToastMessageSent));
	};

	return (
		<div className="p-6 w-full space-y-6">
			{/* Top Header matching Figma Image 2 */}
			<CaseDetailHeader
				caseItem={caseItem}
				onStatusChange={handleStatusChange}
				showConversationLink={false}
				showDetailsLink={true}
				basePath={basePath}
				onBack={() => router.push(routes.detail(caseItem.id))}
			/>

			{/* Full-width 2-column split matching Figma Image 2 (Node 15813-186836) */}
			<div className="flex flex-col lg:flex-row items-start gap-6 w-full">
				{/* Left Column: Allmän information */}
				<div className="w-full lg:w-80 shrink-0">
					<CaseInfoSidebar caseItem={caseItem} />
				</div>

				{/* Right Column: Konversation thread & composer */}
				<div className="w-full flex-1 min-w-0">
					<CaseConversation
						messages={caseItem.messages || []}
						onSendMessage={handleSendMessage}
					/>
				</div>
			</div>
		</div>
	);
}

export default CaseConversationPage;
