"use client";

import React from "react";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { casesRoutes } from "../../../constants/cases.constants";
import type { CaseItem, CaseStatus } from "../../../types/cases.types";
import { CaseStatusBadge } from "../shared";
import { CaseStatusMenu } from "./CaseStatusMenu";

interface CaseDetailHeaderProps {
	caseItem: CaseItem;
	onStatusChange: (status: CaseStatus) => void;
	showConversationLink?: boolean;
	showDetailsLink?: boolean;
	onBack?: () => void;
	/** Which module the case is being read in; every link is built from it. */
	basePath?: string;
}

export function CaseDetailHeader({
	caseItem,
	onStatusChange,
	showConversationLink = true,
	showDetailsLink = false,
	onBack,
	basePath,
}: CaseDetailHeaderProps) {
	const router = useRouter();
	const t = useTranslate();
	const routes = casesRoutes(basePath);

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.push(routes.list);
		}
	};

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
			{/* Left side: Back arrow, Title, Status Badge, and #ID */}
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={handleBack}
					className="p-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
					aria-label={t(localizationConstants.casesBackToList)}
				>
					<ArrowLeft className="w-5 h-5" />
				</button>

				<div>
					<div className="flex items-center gap-2.5">
						<h1 className="text-xl font-bold text-slate-900 tracking-tight lowercase">
							<Translate text={localizationConstants.casesDetailTitle} />
						</h1>
						<CaseStatusBadge status={caseItem.status} />
					</div>
					<p className="text-xs text-slate-400 font-normal mt-0.5">
						#{caseItem.caseNumber || caseItem.id}
					</p>
				</div>
			</div>

			{/* Right side: Action link and Status transition button */}
			<div className="flex items-center gap-3">
				{showConversationLink && (
					<button
						type="button"
						onClick={() =>
							router.push(routes.conversation(caseItem.id))
						}
						className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
					>
						<MessageSquare className="w-3.5 h-3.5 text-slate-500" />
						<span>
							<Translate text={localizationConstants.casesTabConversation} />
						</span>
					</button>
				)}

				{showDetailsLink && (
					<button
						type="button"
						onClick={() =>
							router.push(routes.detail(caseItem.id))
						}
						className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
					>
						<FileText className="w-3.5 h-3.5 text-slate-500" />
						<span>
							<Translate text={localizationConstants.casesTabBasicInfo} />
						</span>
					</button>
				)}

				<CaseStatusMenu status={caseItem.status} onStatusChange={onStatusChange} />
			</div>

		</div>
	);
}

export default CaseDetailHeader;
