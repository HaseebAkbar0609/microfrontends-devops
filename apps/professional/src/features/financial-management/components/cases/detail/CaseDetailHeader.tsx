"use client";

import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CASES_BASE_ROUTE } from "../../../constants/cases.constants";
import type { CaseItem, CaseStatus } from "../../../types/cases.types";
import { CaseStatusBadge, CaseStatusConfirmDialog } from "../shared";

interface CaseDetailHeaderProps {
	caseItem: CaseItem;
	onStatusChange: (status: CaseStatus) => void;
}

export function CaseDetailHeader({
	caseItem,
	onStatusChange,
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

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => router.push(CASES_BASE_ROUTE)}
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
					<p className="text-xs text-slate-400 font-mono mt-0.5">
						#{caseItem.caseNumber || caseItem.id}
					</p>
				</div>
			</div>

			{/* Top right blue action button matching Figma Image 1 */}
			<div className="relative">
				<button
					type="button"
					onClick={() => setShowMenu((prev) => !prev)}
					className="h-9 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
				>
					<CheckCircle2 className="w-4 h-4" />
					<span>
						{caseItem.status === "completed"
							? "Klart"
							: caseItem.status === "closed"
							? "Stängd"
							: "Avsluta ärende"}
					</span>
					<ChevronDown className="w-3.5 h-3.5 opacity-80" />
				</button>

				{showMenu && (
					<div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-xs">
						<div className="px-3 py-1.5 font-semibold text-slate-400 text-[10px] uppercase">
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
									className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
								>
									<CaseStatusBadge status={st} />
									{caseItem.status === st && (
										<span className="text-[10px] text-slate-400">✓</span>
									)}
								</button>
							)
						)}
					</div>
				)}
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
