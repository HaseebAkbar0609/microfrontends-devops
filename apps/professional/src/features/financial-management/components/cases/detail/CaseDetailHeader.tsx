"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronDown, MessageSquare, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CASES_BASE_ROUTE } from "../../../constants/cases.constants";
import type { CaseItem, CaseStatus } from "../../../types/cases.types";
import { CaseStatusBadge, CaseStatusConfirmDialog } from "../shared";

interface CaseDetailHeaderProps {
	caseItem: CaseItem;
	onStatusChange: (status: CaseStatus) => void;
	showConversationLink?: boolean;
	showDetailsLink?: boolean;
	onBack?: () => void;
}

export function CaseDetailHeader({
	caseItem,
	onStatusChange,
	showConversationLink = true,
	showDetailsLink = false,
	onBack,
}: CaseDetailHeaderProps) {
	const router = useRouter();
	const [pendingStatus, setPendingStatus] = useState<CaseStatus | null>(null);
	const [showMenu, setShowMenu] = useState(false);

	const handleConfirmStatus = () => {
		if (pendingStatus) {
			onStatusChange(pendingStatus);
			setPendingStatus(null);
		}
	};

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.push(CASES_BASE_ROUTE);
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
					aria-label="Back"
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
							router.push(`${CASES_BASE_ROUTE}/${caseItem.id}/conversation`)
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
							router.push(`${CASES_BASE_ROUTE}/${caseItem.id}`)
						}
						className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
					>
						<FileText className="w-3.5 h-3.5 text-slate-500" />
						<span>
							<Translate text={localizationConstants.casesTabBasicInfo} />
						</span>
					</button>
				)}

				<div className="relative">
				<button
					type="button"
					onClick={() => setShowMenu((prev) => !prev)}
					className="h-9 px-4 bg-sky-400 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
				>
					<span>
						<Translate
							text={
								caseItem.status === "completed"
									? localizationConstants.casesStatusCompleted
									: caseItem.status === "ongoing"
									? localizationConstants.casesStatusOngoing
									: localizationConstants.casesStatusNotStarted
							}
						/>
					</span>
					<ChevronDown className="w-3.5 h-3.5" />
				</button>

				{showMenu && (
					<div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-xs">
						<div className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase">
							<Translate text={localizationConstants.casesDetailChangeStatus} />
						</div>
						{(["not_started", "ongoing", "completed", "closed", "rejected"] as CaseStatus[]).map(
							(st) => (
								<button
									key={st}
									type="button"
									onClick={() => {
										setShowMenu(false);
										if (st !== caseItem.status) {
											setPendingStatus(st);
										}
									}}
									className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
								>
									<CaseStatusBadge status={st} />
									{caseItem.status === st && (
										<span className="text-[10px] text-slate-500 font-bold">✓</span>
									)}
								</button>
							)
						)}
					</div>
				)}
				</div>
			</div>

			{/* Status change confirmation dialog */}
			<CaseStatusConfirmDialog
				isOpen={pendingStatus !== null}
				newStatus={pendingStatus}
				onClose={() => setPendingStatus(null)}
				onConfirm={handleConfirmStatus}
			/>
		</div>
	);
}

export default CaseDetailHeader;
